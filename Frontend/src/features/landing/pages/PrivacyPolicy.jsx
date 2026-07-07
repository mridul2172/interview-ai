import React from 'react'
import { Link } from 'react-router'
import './legalPage.scss'

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">

            <nav className="legal-navbar">
                <Link to="/" className="legal-navbar__brand">
                    <span className="legal-navbar__dot"></span>
                    InterviewAI
                </Link>
            </nav>

            <div className="legal-content">
                <h1>Privacy Policy</h1>
                <p className="legal-updated">Last updated: July 2026</p>

                <h2>What we collect</h2>
                <p>When you create an account, we collect your username, email address, and password (stored securely as a hash, never in plain text). When you generate an interview plan, we process the resume, job description, and self-description you provide.</p>

                <h2>How we use your data</h2>
                <ul>
                    <li>To generate your personalized interview reports using AI</li>
                    <li>To authenticate you and keep your account secure</li>
                    <li>To send verification codes and password reset links</li>
                </ul>

                <h2>Data storage</h2>
                <p>Your data is stored in a secure database. Resume content and generated reports are linked to your account and are only visible to you.</p>

                <h2>Your rights</h2>
                <p>You can edit your profile, change your email or password, and permanently delete your account and associated data at any time from your account settings.</p>

                <h2>Contact us</h2>
                <p>If you have questions about this policy, reach out via our <Link to="/contact">contact page</Link>.</p>

                <Link to="/" className="legal-back-link">← Back to Home</Link>
            </div>

        </div>
    )
}

export default PrivacyPolicy