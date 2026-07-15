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
                        <div className="split-form__brand">
                            <span className="split-form__brand-mark">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
                                    <path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
                                </svg>
                            </span>
                            InterviewAI
                        </div>

                        <h2>Create your account</h2>
                        <p className="split-form__subtitle">Get your first interview plan in minutes.</p>

                        <form onSubmit={handleSubmit}>

                            <label htmlFor="username">Username</label>
                            <div className="split-form__input-wrap">
                                <svg className="split-form__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                                </svg>
                                <input
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                    type="text" id="username" name='username' placeholder='Enter username' />
                            </div>

                            <label htmlFor="email">Email</label>
                            <div className="split-form__input-row">
                                <div className="split-form__input-wrap split-form__input-wrap--inline">
                                    <svg className="split-form__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                                    </svg>
                                    <input
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        type="email" id="email" name='email' placeholder='you@example.com' />
                                </div>
                                <button type="button" className="split-form__send-code-btn" onClick={handleSendCode} disabled={otpLoading}>
                                    {otpLoading ? "Sending..." : otpSent ? "Resend" : "Send code"}
                                </button>
                            </div>

                            {otpSent && (
                                <>
                                    <label htmlFor="otp">Verification code</label>
                                    <div className="split-form__input-wrap">
                                        <svg className="split-form__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
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
                                <svg className="split-form__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </svg>
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
                                {submitting ? "Creating account..." : (
                                    <>
                                        Create Account
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" />
                                        </svg>
                                    </>
                                )}
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