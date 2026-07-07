import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "./loginPage.scss"
import { useAuth } from '../hooks/useAuth'
import AuthSidePanel from '../../../components/AuthSidePanel'

const Login = () => {

    const { error, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState(false)
    const [ submitting, setSubmitting ] = useState(false)

    // Redirect to dashboard only on success; on failure, `error` from
    // useAuth is already set and rendered below.
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const success = await handleLogin({ email, password })
        setSubmitting(false)
        if (success) {
            navigate('/dashboard')
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
                        <h2>Welcome back</h2>
                        <p className="split-form__subtitle">Log in to continue your prep.</p>

                        <form onSubmit={handleSubmit}>

                            <label htmlFor="email">Email</label>
                            <div className="split-form__input-wrap">
                                <input
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    type="email" id="email" name='email' placeholder='you@example.com' />
                            </div>

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

                            <p className="split-form__forgot-link">
                                <Link to="/forgot-password">Forgot password?</Link>
                            </p>

                            {error && <p className="split-form__error">{error}</p>}

                            <button className="split-form__submit-btn" disabled={submitting}>
                                {submitting ? "Logging in..." : "Log In"}
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