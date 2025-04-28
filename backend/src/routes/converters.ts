    import express from 'express'
    import multer from 'multer'
    import { getAuth } from 'firebase-admin/auth'
    import { getFirestore } from 'firebase-admin/firestore'
    import { getStorage } from 'firebase-admin/storage'
    import { AssemblyAI } from 'assemblyai'
    import { CloudConvert } from 'cloudconvert'

    const router = express.Router()
    const auth = getAuth()
    const db = getFirestore()
    const storage = getStorage()

    // Initialize converters
    const assemblyai = new AssemblyAI(process.env.ASSEMBLYAI_API_KEY)
    const cloudconvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY)

    // Configure multer for file upload
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      }
    })

    // Convert image to PDF
    router.post('/image-to-pdf', upload.single('file'), async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const { originalname, buffer, mimetype } = req.file

        // Upload to Firebase Storage
        const bucket = storage.bucket()
        const inputFile = bucket.file(`temp/${decodedToken.uid}/${Date.now()}-${originalname}`)
        await inputFile.save(buffer, {
          metadata: {
            contentType: mimetype
          }
        })

        // Convert using CloudConvert
        const job = await cloudconvert.jobs.create({
          tasks: {
            'import-image': {
              operation: 'import/url',
              url: inputFile.publicUrl()
            },
            'convert-to-pdf': {
              operation: 'convert',
              input: 'import-image',
              output_format: 'pdf'
            },
            'export-pdf': {
              operation: 'export/url',
              input: 'convert-to-pdf'
            }
          }
        })

        // Wait for job to complete
        const completedJob = await cloudconvert.jobs.wait(job.id)
        const exportTask = completedJob.tasks.find(task => task.operation === 'export/url')
        const pdfUrl = exportTask?.result?.files[0]?.url

        // Save PDF to Firebase Storage
        const pdfFile = bucket.file(`documents/${decodedToken.uid}/${Date.now()}-${originalname}.pdf`)
        await pdfFile.save(pdfUrl, {
          metadata: {
            contentType: 'application/pdf'
          }
        })

        // Save conversion metadata to Firestore
        await db.collection('conversions').add({
          userId: decodedToken.uid,
          type: 'image-to-pdf',
          originalName: originalname,
          resultUrl: pdfFile.publicUrl(),
          createdAt: new Date()
        })

        // Clean up temporary file
        await inputFile.delete()

        res.json({
          url: pdfFile.publicUrl()
        })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    // Convert audio to text
    router.post('/audio-to-text', upload.single('file'), async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const { originalname, buffer, mimetype } = req.file

        // Upload to Firebase Storage
        const bucket = storage.bucket()
        const audioFile = bucket.file(`temp/${decodedToken.uid}/${Date.now()}-${originalname}`)
        await audioFile.save(buffer, {
          metadata: {
            contentType: mimetype
          }
        })

        // Transcribe using AssemblyAI
        const transcript = await assemblyai.transcripts.create({
          audio_url: audioFile.publicUrl(),
          language_code: 'pt'
        })

        // Save transcription to Firestore
        await db.collection('transcriptions').add({
          userId: decodedToken.uid,
          originalName: originalname,
          text: transcript.text,
          createdAt: new Date()
        })

        // Clean up temporary file
        await audioFile.delete()

        res.json({
          text: transcript.text
        })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    export default router
