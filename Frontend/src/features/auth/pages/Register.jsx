import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "./registerPage.scss"
import { useAuth } from '../hooks/useAuth'
import AuthSidePanel from '../../../components/AuthSidePanel'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ otp, setOtp ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ submitting, setSubmitting ] = useState(false)

    const { error, otpSent, otpLoading, message, handleRegister, handleSendOtp } = useAuth()

    const handleSendCode = async (e) => {
        e.preventDefault()
        if (!email) return
        await handleSendOtp(email)
    }

    // Registration is only submitted after OTP verification (submit button
    // stays disabled via `!otpSent` until a code has been sent/entered)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const success = await handleRegister({ username, email, password, otp })
        setSubmitting(false)
        if (success) {
            navigate("/login")
        }
    }

    return (
        <div className="split-auth-page">

            <AuthSidePanel variant="register" />

            <div className="split-auth-page__form-panel">

                <div className="split-auth-page__top-link">
                    <Link to="/">← Back to home</Link>
                </div>

                <div className="split-auth-page__form-wrap">
                    <div className="split-form">
                        <h2>Create your account</h2>
                        <p className="split-form__subtitle">Get your first interview plan in minutes.</p>

                        <form onSubmit={handleSubmit}>

                            <label htmlFor="username">Username</label>
                            <div className="split-form__input-wrap">
                                <input
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                    type="text" id="username" name='username' placeholder='Enter username' />
                            </div>

                            <label htmlFor="email">Email</label>
                            <div className="split-form__input-row">
                                <input
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    type="email" id="email" name='email' placeholder='you@example.com' />
                                <button type="button" className="split-form__send-code-btn" onClick={handleSendCode} disabled={otpLoading}>
                                    {otpLoading ? "Sending..." : otpSent ? "Resend" : "Send code"}
                                </button>
                            </div>

                            {otpSent && (
                                <>
                                    <label htmlFor="otp">Verification code</label>
                                    <div className="split-form__input-wrap">
                                        <input
                                            value={otp}
                                            onChange={(e) => { setOtp(e.target.value) }}
                                            type="text" id="otp" name='otp' placeholder='Enter 6-digit code' maxLength={6} />
                                    </div>
                                    {message && <p className="split-form__hint">{message}</p>}
                                </>
                            )}

                            <label htmlFor="password">Password</label>
                            <div className="split-form__input-wrap split-form__input-wrap--password">
                                <input
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    type={showPassword ? "text" : "password"}
                                    id="password" name='password' placeholder='Enter password' />
                                <button type="button" className="split-form__eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {error && <p className="split-form__error">{error}</p>}

                            <button className="split-form__submit-btn" disabled={!otpSent || submitting}>
                                {submitting ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        <p className="split-form__switch-text">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>

                <div className="split-auth-page__footer">
                    <p>© 2026 InterviewAI · All rights reserved</p>
                </div>

            </div>
        </div>
    )
}

export default Register