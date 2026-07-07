import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "./deleteAccount.scss"
import { useAuth } from '../hooks/useAuth'

const DeleteAccount = () => {

    const navigate = useNavigate()
    const { error, handleDeleteAccount } = useAuth()

    const [ password, setPassword ] = useState("")
    const [ submitting, setSubmitting ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const result = await handleDeleteAccount(password)
        setSubmitting(false)
        if (result) {
            navigate("/login")
        }
    }

    return (
        <div className="delete-account-page">
            <div className="da-container">

                <div className="da-icon">⚠️</div>
                <h1>Delete Account</h1>
                <p className="da-subtitle">This action is permanent and cannot be undone.</p>

                <div className="da-warning-box">
                    <span className="da-warning-icon">⚠️</span>
                    <div>
                        <p>What happens when you delete your account:</p>
                        <ul>
                            <li>Your profile and login access will be removed</li>
                            <li>You will be immediately logged out</li>
                            <li>This action cannot be reversed</li>
                        </ul>
                    </div>
                </div>

                <div className="da-card">
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="password">Enter your password to confirm</label>
                        <div className="da-input-wrapper">
                            <input
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password" id="password" name='password' placeholder='Enter password' />
                        </div>

                        {error && <p className="da-error">{error}</p>}

                        <button className="da-delete-btn" disabled={submitting}>
                            {submitting ? "Deleting..." : "Delete My Account"}
                        </button>

                        <Link to="/dashboard" className="da-cancel-link">Cancel</Link>

                    </form>
                </div>

            </div>
        </div>
    )
}

export default DeleteAccount