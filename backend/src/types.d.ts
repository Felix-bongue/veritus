    declare namespace NodeJS {
      interface ProcessEnv {
        PORT: string
        FIREBASE_PROJECT_ID: string
        FIREBASE_CLIENT_EMAIL: string
        FIREBASE_PRIVATE_KEY: string
        OPENAI_API_KEY: string
        PINECONE_API_KEY: string
        PINECONE_ENVIRONMENT: string
        ASSEMBLYAI_API_KEY: string
        CLOUDCONVERT_API_KEY: string
        GOOGLE_CLIENT_ID: string
        GOOGLE_CLIENT_SECRET: string
        GOOGLE_REDIRECT_URI: string
      }
    }

    declare module 'express' {
      interface Request {
        file?: any
      }
    }
