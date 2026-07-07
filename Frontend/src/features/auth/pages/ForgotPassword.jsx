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

                <div className="fp-icon">📧</div>
                <h1>Forgot Password</h1>
                <p className="fp-subtitle">We'll email you a link to reset your password.</p>

                <div className="fp-card">
                    {submitted ? (
                        <p className="fp-success">{message || "If an account with that email exists, a reset link has been sent."}</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email</label>
                            <div className="fp-input-wrapper">
                                <input
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    type="email" id="email" name='email' placeholder='Enter your account email' />
                            </div>

                            {error && <p className="fp-error">{error}</p>}

                            <button className="fp-submit-btn" disabled={submitting}>
                                {submitting ? "Sending..." : "Send Reset Link"}
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