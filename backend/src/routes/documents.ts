    import express from 'express'
    import multer from 'multer'
    import { getAuth } from 'firebase-admin/auth'
    import { getFirestore } from 'firebase-admin/firestore'
    import { getStorage } from 'firebase-admin/storage'

    const router = express.Router()
    const auth = getAuth()
    const db = getFirestore()
    const storage = getStorage()

    // Configure multer for file upload
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      }
    })

    // Upload document
    router.post('/upload', upload.single('file'), async (req, res) => {
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
        const file = bucket.file(`documents/${decodedToken.uid}/${Date.now()}-${originalname}`)
        
        await file.save(buffer, {
          metadata: {
            contentType: mimetype
          }
        })

        // Save document metadata to Firestore
        const docRef = await db.collection('documents').add({
          userId: decodedToken.uid,
          name: originalname,
          type: mimetype,
          size: buffer.length,
          url: file.publicUrl(),
          createdAt: new Date()
        })

        res.status(201).json({
          id: docRef.id,
          name: originalname,
          url: file.publicUrl()
        })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    // Get user documents
    router.get('/', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const documents = await db
          .collection('documents')
          .where('userId', '==', decodedToken.uid)
          .orderBy('createdAt', 'desc')
          .get()

        res.json(documents.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    // Delete document
    router.delete('/:id', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const docRef = db.collection('documents').doc(req.params.id)
        const doc = await docRef.get()

        if (!doc.exists) {
          return res.status(404).json({ error: 'Document not found' })
        }

        const data = doc.data()
        if (data?.userId !== decodedToken.uid) {
          return res.status(403).json({ error: 'Unauthorized' })
        }

        // Delete from Firebase Storage
        const bucket = storage.bucket()
        const file = bucket.file(data.url)
        await file.delete()

        // Delete from Firestore
        await docRef.delete()

        res.json({ message: 'Document deleted successfully' })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    export default router
