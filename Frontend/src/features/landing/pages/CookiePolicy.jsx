import React from 'react'
import { Link } from 'react-router'
import "./legalPage.scss";

const CookiePolicy = () => {
    return (
        <div className="legal-page">
            <div className="legal-page__container">
                <Link to="/" className="legal-page__back">← Back to home</Link>
                <h1>Cookie Policy</h1>
                <p className="legal-page__updated">Last updated: July 2026</p>

                <section>
                    <h2>1. What are cookies</h2>
                    <p>Cookies are small text files stored on your device when you visit InterviewAI. They help us remember your preferences and keep you signed in.</p>
                </section>

                <section>
                    <h2>2. Cookies we use</h2>
                    <p>We use essential cookies to keep you logged in and maintain your session, and functional cookies to remember settings like your last uploaded resume or generated report. We do not use third-party advertising cookies.</p>
                </section>

                <section>
                    <h2>3. Managing cookies</h2>
                    <p>You can control or delete cookies through your browser settings at any time. Disabling essential cookies may prevent you from staying signed in or generating reports.</p>
                </section>

                <section>
                    <h2>4. Changes to this policy</h2>
                    <p>We may update this Cookie Policy from time to time. Continued use of InterviewAI after changes means you accept the updated policy.</p>
                </section>

                <section>
                    <h2>5. Contact</h2>
                    <p>Questions about this policy? Reach out through our <Link to="/contact">contact page</Link>.</p>
                </section>
            </div>
        </div>
    )
}

export default CookiePolicy