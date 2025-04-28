    import { useState, useEffect } from 'react'
    import { getAuth, onAuthStateChanged, User } from 'firebase/auth'

    export const useAuth = () => {
      const [user, setUser] = useState<User | null>(null)
      const [loading, setLoading] = useState(true)
      const auth = getAuth()

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })

        return () => unsubscribe()
      }, [auth])

      return { user, loading }
    }
