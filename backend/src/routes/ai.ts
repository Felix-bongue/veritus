    import express from 'express'
    import { getAuth } from 'firebase-admin/auth'
    import { getFirestore } from 'firebase-admin/firestore'
    import { OpenAI } from 'openai'
    import { PineconeClient } from 'pinecone-client'

    const router = express.Router()
    const auth = getAuth()
    const db = getFirestore()

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    // Initialize Pinecone
    const pinecone = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT
    })

    // Get legal advice
    router.post('/consult', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const { question } = req.body

        // Search relevant laws in Pinecone
        const searchResults = await pinecone.query({
          vector: await getEmbedding(question),
          topK: 5,
          includeMetadata: true
        })

        // Prepare context from search results
        const context = searchResults.matches
          .map(match => match.metadata?.text)
          .join('\n')

        // Generate response using OpenAI
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a legal assistant specializing in Angolan law. Provide accurate and helpful legal advice based on the context provided."
            },
            {
              role: "user",
              content: `Context: ${context}\n\nQuestion: ${question}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })

        // Save consultation to Firestore
        await db.collection('consultations').add({
          userId: decodedToken.uid,
          question,
          answer: completion.choices[0].message.content,
          createdAt: new Date()
        })

        res.json({
          answer: completion.choices[0].message.content,
          sources: searchResults.matches.map(match => match.metadata?.source)
        })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    // Get consultation history
    router.get('/history', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const consultations = await db
          .collection('consultations')
          .where('userId', '==', decodedToken.uid)
          .orderBy('createdAt', 'desc')
          .limit(10)
          .get()

        res.json(consultations.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    // Helper function to get embeddings
    async function getEmbedding(text: string): Promise<number[]> {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
      })
      return response.data[0].embedding
    }

    export default router
