import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router'
import "./resetPassword.scss"
import { useAuth } from '../hooks/useAuth'

const ResetPassword = () => {

    const navigate = useNavigate()
    const [ searchParams ] = useSearchParams()
    const token = searchParams.get("token")

    const { error, handleResetPassword } = useAuth()

    const [ newPassword, setNewPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ submitting, setSubmitting ] = useState(false)
    const [ success, setSuccess ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!token) return
        setSubmitting(true)
        const result = await handleResetPassword({ token, newPassword })
        setSubmitting(false)
        if (result) {
            setSuccess(true)
            setTimeout(() => navigate("/login"), 2000)
        }
    }

    if (!token) {
        return (
            <div className="reset-password-page">
                <div className="rp-container">
                    <h1>Invalid Link</h1>
                    <p className="rp-subtitle">This reset link is missing or invalid.</p>
                    <p className="rp-back-link"><Link to="/forgot-password">Request a new link</Link></p>
                </div>
            </div>
        )
    }

    return (
        <div className="reset-password-page">
            <div className="rp-container">

                <div className="rp-icon">🔑</div>
                <h1>Reset Password</h1>
                <p className="rp-subtitle">Enter a new password for your account.</p>

                <div className="rp-card">
                    {success ? (
                        <p className="rp-success">Password reset successfully! Redirecting to login...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="newPassword">New Password</label>
                            <div className="rp-input-wrapper">
                                <input
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value) }}
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword" name='newPassword' placeholder='Enter new password' />
                                <button type="button" className="rp-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {error && <p className="rp-error">{error}</p>}

                            <button className="rp-submit-btn" disabled={submitting}>
                                {submitting ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>

                <p className="rp-back-link"><Link to="/login">← Back to login</Link></p>

            </div>
        </div>
    )
}

export default ResetPassword