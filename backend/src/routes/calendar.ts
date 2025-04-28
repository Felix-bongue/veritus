    import express from 'express'
    import { getAuth } from 'firebase-admin/auth'
    import { getFirestore } from 'firebase-admin/firestore'
    import { google } from 'googleapis'

    const router = express.Router()
    const auth = getAuth()
    const db = getFirestore()

    // Initialize Google Calendar API
    const calendar = google.calendar('v3')
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    // Get Google Calendar authorization URL
    router.get('/auth-url', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const scopes = [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events'
        ]

        const authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: scopes,
          state: decodedToken.uid
        })

        res.json({ url: authUrl })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    // Handle Google OAuth callback
    router.get('/callback', async (req, res) => {
      try {
        const { code, state: userId } = req.query
        if (!code || !userId) {
          return res.status(400).json({ error: 'Missing required parameters' })
        }

        const { tokens } = await oauth2Client.getToken(code as string)
        oauth2Client.setCredentials(tokens)

        // Save tokens to Firestore
        await db.collection('users').doc(userId as string).update({
          googleCalendarTokens: tokens
        })

        res.redirect('/dashboard')
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    // Get calendar events
    router.get('/events', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const userDoc = await db.collection('users').doc(decodedToken.uid).get()
        const userData = userDoc.data()

        if (!userData?.googleCalendarTokens) {
          return res.status(400).json({ error: 'Google Calendar not connected' })
        }

        oauth2Client.setCredentials(userData.googleCalendarTokens)

        const { data } = await calendar.events.list({
          auth: oauth2Client,
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime'
        })

        res.json(data.items)
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    // Create calendar event
    router.post('/events', async (req, res) => {
      try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decodedToken = await auth.verifyIdToken(token)
        const userDoc = await db.collection('users').doc(decodedToken.uid).get()
        const userData = userDoc.data()

        if (!userData?.googleCalendarTokens) {
          return res.status(400).json({ error: 'Google Calendar not connected' })
        }

        oauth2Client.setCredentials(userData.googleCalendarTokens)

        const { summary, description, start, end } = req.body
        const event = {
          summary,
          description,
          start: {
            dateTime: start,
            timeZone: 'Africa/Luanda'
          },
          end: {
            dateTime: end,
            timeZone: 'Africa/Luanda'
          }
        }

        const { data } = await calendar.events.insert({
          auth: oauth2Client,
          calendarId: 'primary',
          requestBody: event
        })

        res.status(201).json(data)
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
    })

    export default router
