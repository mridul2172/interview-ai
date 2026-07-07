import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, sendOtp, forgotPassword, changePassword, updateProfile, changeEmail, deleteAccount, resetPassword } from "../services/auth.api";

/**
 * Central auth hook — wraps AuthContext and exposes all auth-related state
 * (user, loading, error, message) along with handler functions for every
 * auth action (login, register, password/email changes, etc.).
 *
 * Keeping all these API calls here means components just call
 * `handleLogin(...)` etc. without worrying about loading/error state themselves.
 */
export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const [ error, setError ] = useState("")
    const [ otpSent, setOtpSent ] = useState(false)
    const [ message, setMessage ] = useState("")
    // Separate loading state for OTP requests so it doesn't trigger the
    // app-wide "loading" flag (used for full-page auth checks/redirects)
    const [ otpLoading, setOtpLoading ] = useState(false)


    const handleSendOtp = async (email) => {
        setError("")
        setMessage("")
        setOtpLoading(true)
        try {
            const data = await sendOtp(email)
            setOtpSent(true)
            setMessage(data.message)
        } catch (err) {
            setError(err.message)
        } finally {
            setOtpLoading(false)
        }
    }

    const handleLogin = async ({ email, password }) => {
        setError("")
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password, otp }) => {
        setError("")
        setLoading(true)
        try {
            await register({ username, email, password, otp })
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            // Intentionally silent — even if the server-side logout call fails,
            // we still want to clear local user state below via `finally`
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (email) => {
        setError("")
        setMessage("")
        setLoading(true)
        try {
            const data = await forgotPassword(email)
            setMessage(data.message)
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }
    const handleChangePassword = async ({ currentPassword, newPassword }) => {
        setError("")
        setMessage("")
        try {
            const data = await changePassword({ currentPassword, newPassword })
            setMessage(data.message)
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const handleUpdateProfile = async (username) => {
        setError("")
        setMessage("")
        try {
            const data = await updateProfile(username)
            setUser(data.user)
            setMessage(data.message)
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const handleChangeEmail = async ({ newEmail, otp }) => {
        setError("")
        setMessage("")
        try {
            const data = await changeEmail({ newEmail, otp })
            setUser(data.user)
            setMessage(data.message)
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const handleDeleteAccount = async (password) => {
        setError("")
        try {
            await deleteAccount(password)
            setUser(null)
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const handleResetPassword = async ({ token, newPassword }) => {
        setError("")
        setMessage("")
        try {
            const data = await resetPassword({ token, newPassword })
            setMessage(data.message)
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    // On mount, check if a valid session/cookie already exists and restore
    // the user without requiring them to log in again. Errors are ignored
    // here since "not logged in" is a valid, expected outcome, not a real failure.
    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

  return {
        user, loading, error, otpSent, message, otpLoading,
        handleRegister, handleLogin, handleLogout,
        handleSendOtp, handleForgotPassword, handleChangePassword, handleUpdateProfile, handleChangeEmail, handleDeleteAccount, handleResetPassword
    }
}