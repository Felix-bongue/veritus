    import express from 'express'
    import { getAuth } from 'firebase-admin/auth'
    import { getFirestore } from 'firebase-admin/firestore'

    const router = express.Router()
    const auth = getAuth()
    const db = getFirestore()

    // Register new user
    router.post('/register', async (req, res) => {
      try {
        const { email, password, name } = req.body

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
          email,
          password,
          displayName: name
        })

        // Create user document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
          name,
          email,
          createdAt: new Date(),
          role: 'user'
        })

        res.status(201).json({ message: 'User created successfully' })
      } catch (error: any) {
        res.status(400).json({ error: error.message })
      }
    })

    // Get user profile
    router.get('/profile', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const userDoc = await db.collection('users').doc(decodedToken.uid).get()

        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' })
        }

        res.json(userDoc.data())
      } catch (error: any) {
        res.status(401).json({ error: error.message })
      }
    })

    // Update user profile
    router.put('/profile', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const { name, phone, office, specialization } = req.body

        await db.collection('users').doc(decodedToken.uid).update({
          name,
          phone,
          office,
          specialization,
          updatedAt: new Date()
        })

        res.json({ message: 'Profile updated successfully' })
      } catch (error: any) {
        res.status(400).json({ error: error.message })
      }
    })

    export default router
