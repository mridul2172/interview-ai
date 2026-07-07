import React, { useState } from 'react'
import { Link } from 'react-router'
import "./changePassword.scss"
import { useAuth } from '../hooks/useAuth'
import Toast from '../../../components/Toast'

const ChangePassword = () => {

    const { error, handleChangePassword } = useAuth()

    const [ currentPassword, setCurrentPassword ] = useState("")
    const [ newPassword, setNewPassword ] = useState("")
    const [ showCurrentPassword, setShowCurrentPassword ] = useState(false)
    const [ showNewPassword, setShowNewPassword ] = useState(false)
    const [ toast, setToast ] = useState(null)
    const [ submitting, setSubmitting ] = useState(false)

    // On success, show a toast and clear the form; on failure, `error` from
    // useAuth is already set and rendered below, so nothing extra to do here.
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const result = await handleChangePassword({ currentPassword, newPassword })
        setSubmitting(false)
        if (result) {
            setToast({ type: "success", text: "Password changed successfully!" })
            setCurrentPassword("")
            setNewPassword("")
        }
    }

    return (
        <div className="change-password-page">

            {toast && (
                <Toast
                    message={toast.text}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="cp-container">

                <div className="cp-icon">🔒</div>
                <h1>Change Password</h1>
                <p className="cp-subtitle">Update your password to keep your account secure.</p>

                <div className="cp-card">
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="cp-input-wrapper">
                            <input
                                value={currentPassword}
                                onChange={(e) => { setCurrentPassword(e.target.value) }}
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword" name='currentPassword' placeholder='Enter current password' />
                            <button type="button" className="cp-eye-btn" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                {showCurrentPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <label htmlFor="newPassword">New Password</label>
                        <div className="cp-input-wrapper">
                            <input
                                value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value) }}
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword" name='newPassword' placeholder='Enter new password' />
                            <button type="button" className="cp-eye-btn" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <p className="cp-hint">Use at least 8 characters.</p>

                        {error && <p className="cp-error">{error}</p>}

                        <button className="cp-submit-btn" disabled={submitting}>
                            {submitting ? "Updating..." : "Update Password"}
                        </button>

                    </form>
                </div>

                <p className="cp-back-link"><Link to="/dashboard">← Back to Home</Link></p>
            </div>
        </div>
    )
}

export default ChangePassword