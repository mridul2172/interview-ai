import React, { useState } from 'react'
import { Link } from 'react-router'
import "./editProfile.scss"
import { useAuth } from '../hooks/useAuth'
import Toast from '../../../components/Toast'

const EditProfile = () => {

    const { user, error, otpSent, otpLoading, handleUpdateProfile, handleChangeEmail, handleSendOtp } = useAuth()

    const [ username, setUsername ] = useState(user?.username || "")
    const [ newEmail, setNewEmail ] = useState("")
    const [ emailOtp, setEmailOtp ] = useState("")
    const [ toast, setToast ] = useState(null)
    const [ submittingUsername, setSubmittingUsername ] = useState(false)
    const [ submittingEmail, setSubmittingEmail ] = useState(false)

    const handleUsernameSubmit = async (e) => {
        e.preventDefault()
        setSubmittingUsername(true)
        const result = await handleUpdateProfile(username)
        setSubmittingUsername(false)
        if (result) {
            setToast({ type: "success", text: "Username updated successfully!" })
        }
    }

    const handleSendEmailCode = async (e) => {
        e.preventDefault()
        if (!newEmail) return
        await handleSendOtp(newEmail)
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        setSubmittingEmail(true)
        const result = await handleChangeEmail({ newEmail, otp: emailOtp })
        setSubmittingEmail(false)
        if (result) {
            setToast({ type: "success", text: "Email updated successfully!" })
            setNewEmail("")
            setEmailOtp("")
        }
    }

    return (
        <div className="edit-profile-page">

            {toast && (
                <Toast
                    message={toast.text}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="ep-container">

                <div className="ep-icon">✏️</div>
                <h1>Edit Profile</h1>
                <p className="ep-subtitle">Update your account details.</p>

                {/* Username Card */}
                <div className="ep-card">
                    <form onSubmit={handleUsernameSubmit}>

                        <label htmlFor="username">Username</label>
                        <div className="ep-input-wrapper">
                            <input
                                value={username}
                                onChange={(e) => { setUsername(e.target.value) }}
                                type="text" id="username" name='username' placeholder='Enter username' />
                        </div>

                        {error && <p className="ep-error">{error}</p>}

                        <button className="ep-submit-btn" disabled={submittingUsername}>
                            {submittingUsername ? "Saving..." : "Save Username"}
                        </button>

                    </form>
                </div>

                {/* Email Card */}
                <div className="ep-card" style={{ marginTop: "16px" }}>
                    <form onSubmit={handleEmailSubmit}>

                        <label htmlFor="currentEmail">Current Email</label>
                        <div className="ep-input-wrapper">
                            <input
                                value={user?.email || ""}
                                type="email" id="currentEmail" disabled />
                        </div>

                        <label htmlFor="newEmail">New Email</label>
                        <div className="ep-input-wrapper" style={{ display: "flex", gap: "8px" }}>
                            <input
                                value={newEmail}
                                onChange={(e) => { setNewEmail(e.target.value) }}
                                type="email" id="newEmail" name='newEmail' placeholder='Enter new email' />
                            <button type="button" className="ep-send-code-btn" onClick={handleSendEmailCode} disabled={otpLoading}>
                                {otpLoading ? "Sending..." : otpSent ? "Resend" : "Send code"}
                            </button>
                        </div>

                        {otpSent && (
                            <>
                                <label htmlFor="emailOtp">Verification Code</label>
                                <div className="ep-input-wrapper">
                                    <input
                                        value={emailOtp}
                                        onChange={(e) => { setEmailOtp(e.target.value) }}
                                        type="text" id="emailOtp" name='emailOtp' placeholder='Enter 6-digit code' maxLength={6} />
                                </div>
                            </>
                        )}

                        {error && <p className="ep-error">{error}</p>}

                        <button className="ep-submit-btn" disabled={!otpSent || submittingEmail}>
                            {submittingEmail ? "Updating..." : "Update Email"}
                        </button>

                    </form>
                </div>

                <p className="ep-back-link"><Link to="/dashboard">← Back to Home</Link></p>

            </div>
        </div>
    )
}

export default EditProfile