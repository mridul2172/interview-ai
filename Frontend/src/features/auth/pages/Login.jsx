import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import "./loginPage.scss"
import { useAuth } from '../hooks/useAuth'
import AuthSidePanel from '../../../components/AuthSidePanel'

const Login = () => {

    const { error, handleLogin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ submitting, setSubmitting ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const success = await handleLogin({ email, password })
        setSubmitting(false)
        if (success) {
            const redirectTo = location.state?.from || '/dashboard'
            navigate(redirectTo)
        }
    }

    return (
        <div className="split-auth-page">

            <AuthSidePanel variant="login" />

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

                        <h2>Welcome back</h2>
                        <p className="split-form__subtitle">Sign in to continue prepping for your next interview.</p>

                        <form onSubmit={handleSubmit}>

                            <label htmlFor="email">Email</label>
                            <div className="split-form__input-wrap">
                                <svg className="split-form__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                                </svg>
                                <input
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    type="email" id="email" name='email' placeholder='you@example.com' />
                            </div>

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

                            <p className="split-form__forgot-link">
                                <Link to="/forgot-password">Forgot password?</Link>
                            </p>

                            {error && <p className="split-form__error">{error}</p>}

                            <button className="split-form__submit-btn" disabled={submitting}>
                                {submitting ? "Logging in..." : (
                                    <>
                                        Log In
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="split-form__switch-text">
                            Don't have an account? <Link to="/register">Register</Link>
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

export default Login