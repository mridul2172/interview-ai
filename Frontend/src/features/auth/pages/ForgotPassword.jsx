import React, { useState } from 'react'
import { Link } from 'react-router'
import "./forgotPassword.scss"
import { useAuth } from '../hooks/useAuth'

const ForgotPassword = () => {

    const { error, message, handleForgotPassword } = useAuth()
    const [ email, setEmail ] = useState("")
    const [ submitted, setSubmitted ] = useState(false)
    const [ submitting, setSubmitting ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        await handleForgotPassword(email)
        setSubmitting(false)
        setSubmitted(true)
    }

    return (
        <div className="forgot-password-page">
            <div className="fp-container">

                <div className={`fp-icon ${submitted ? "fp-icon--success" : ""}`}>
                    {submitted ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /><path d="M9 12l2 2 4-4" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                        </svg>
                    )}
                </div>

                <h1>{submitted ? "Check your email" : "Forgot Password"}</h1>
                <p className="fp-subtitle">
                    {submitted
                        ? <>We've sent a reset link to <strong>{email}</strong></>
                        : "We'll email you a link to reset your password."}
                </p>

                <div className="fp-card">
                    {submitted ? (
                        <>
                            <p className="fp-success">{message || "If an account with that email exists, a reset link has been sent."}</p>
                            <button className="fp-resend-btn" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "Resending..." : "Resend link"}
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email</label>
                            <div className="fp-input-wrapper">
                                <svg className="fp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                                </svg>
                                <input
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    type="email" id="email" name='email' placeholder='Enter your account email' />
                            </div>

                            {error && <p className="fp-error">{error}</p>}

                            <button className="fp-submit-btn" disabled={submitting}>
                                {submitting ? "Sending..." : (
                                    <>
                                        Send Reset Link
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="fp-back-link"><Link to="/login">← Back to login</Link></p>

            </div>
        </div>
    )
}

export default ForgotPassword