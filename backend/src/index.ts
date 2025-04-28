    import express from 'express'
    import cors from 'cors'
    import dotenv from 'dotenv'
    import { initializeApp, cert } from 'firebase-admin/app'
    import { getAuth } from 'firebase-admin/auth'
    import { getFirestore } from 'firebase-admin/firestore'

    // Routes
    import authRoutes from './routes/auth'
    import aiRoutes from './routes/ai'
    import documentRoutes from './routes/documents'
    import converterRoutes from './routes/converters'
    import calendarRoutes from './routes/calendar'

    dotenv.config()

    const app = express()

    // Middleware
    app.use(cors())
    app.use(express.json())

    // Initialize Firebase Admin
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })

    // Initialize Firestore
    const db = getFirestore()

    // Routes
    app.use('/api/auth', authRoutes)
    app.use('/api/ai', aiRoutes)
    app.use('/api/documents', documentRoutes)
    app.use('/api/converters', converterRoutes)
    app.use('/api/calendar', calendarRoutes)

    // Error handling middleware
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack)
      res.status(500).json({ error: 'Something went wrong!' })
    })

    const PORT = process.env.PORT || 3000

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
