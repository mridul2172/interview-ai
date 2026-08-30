import { createContext, useState, useEffect } from "react"
import { getMe } from "./services/auth.api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    // Runs exactly ONCE for the whole app, no matter how many components
    // call useAuth() — this used to live inside useAuth itself, which meant
    // every component using the hook fired its own independent getMe() call
    useEffect(() => {
        const checkSession = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }
        checkSession()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}