import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "./navbar.scss"

const gradients = [
    "linear-gradient(135deg, #e1034d, #ff6b9d)",
    "linear-gradient(135deg, #6366f1, #a78bfa)",
    "linear-gradient(135deg, #059669, #34d399)",
    "linear-gradient(135deg, #d97706, #fbbf24)",
    "linear-gradient(135deg, #0891b2, #67e8f9)",
    "linear-gradient(135deg, #7c3aed, #c084fc)",
]

/**
 * Deterministically picks a gradient for a user's avatar based on a string
 * (username/email) — same input always maps to the same gradient, so a
 * user's avatar color stays consistent across sessions without storing it.
 *
 * @param {string} str - Value to hash (usually username or email)
 * @returns {string} A CSS gradient from the `gradients` list
 */
const getGradient = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return gradients[ Math.abs(hash) % gradients.length ]
}

const Navbar = () => {

    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const [ open, setOpen ] = useState(false)
    const [ copied, setCopied ] = useState(false)
    const dropdownRef = useRef()

    // Closes the profile dropdown when the user clicks anywhere outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const onLogout = async () => {
        setOpen(false)
        await handleLogout()
        navigate("/login")
    }

    // Copies the user's email to clipboard and briefly shows "Copied!" as feedback.
    // stopPropagation so clicking the email doesn't trigger the dropdown's outside-click close.
    const copyEmail = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(user.email)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    // Don't render the navbar until user data is available (e.g. during initial auth load)
    if (!user) return null

    const initial = user.username?.charAt(0).toUpperCase() || "U"
    const avatarGradient = getGradient(user.username || user.email)

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar__brand">
                <span className="navbar__brand-dot"></span>
                InterviewAI
            </Link>

            <div className="navbar__profile" ref={dropdownRef}>
                <button className="navbar__avatar-btn" onClick={() => setOpen(!open)}>
                    <span className="navbar__avatar" style={{ background: avatarGradient }}>{initial}</span>
                    <svg className={`navbar__chevron ${open ? "navbar__chevron--open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {open && (
                    <div className="navbar__dropdown">
                        <div className="navbar__dropdown-header">
                            <span className="navbar__avatar navbar__avatar--lg" style={{ background: avatarGradient }}>{initial}</span>
                            <div className="navbar__user-info">
                                <p className="navbar__username">{user.username}</p>
                                <p className="navbar__email" onClick={copyEmail} title="Click to copy">
                                    {copied ? "Copied!" : user.email}
                                </p>
                            </div>
                        </div>

                        <div className="navbar__dropdown-section">
                            <Link to="/edit-profile" className="navbar__item" onClick={() => setOpen(false)}>
                                <svg className="navbar__item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Edit Profile
                            </Link>
                            <Link to="/change-password" className="navbar__item" onClick={() => setOpen(false)}>
                                <svg className="navbar__item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                Change Password
                            </Link>
                            <Link to="/reports" className="navbar__item" onClick={() => setOpen(false)}>
                                <svg className="navbar__item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M14 2v6h6M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                My Reports
                            </Link>
                            <Link to="/analytics" className="navbar__item" onClick={() => setOpen(false)}>
                                <svg className="navbar__item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Analytics
                            </Link>
                        </div>

                        <div className="navbar__dropdown-section navbar__dropdown-section--danger">
                            <Link to="/delete-account" className="navbar__item navbar__item--danger" onClick={() => setOpen(false)}>
                                <svg className="navbar__item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Delete Account
                            </Link>
                            <button className="navbar__item navbar__item--button" onClick={onLogout}>
                                <svg className="navbar__item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar