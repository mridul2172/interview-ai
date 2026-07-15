import React from 'react'
import { Link } from 'react-router'
import './howItWorksPage.scss'

const Icon = ({ children, size = 22, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
)

const paths = {
    brain: <><path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" /><path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" /></>,
    upload: <><path d="M12 21V9" /><path d="M7 14l5-5 5 5" /><path d="M5 21h14" /></>,
    sparkle: <><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></>,
    file: <><path d="M14 3v5h5" /><path d="M6 3h8l5 5v13H6z" /></>,
    arrow: <><line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" /></>,
    arrowLeft: <><line x1="20" y1="12" x2="4" y2="12" /><polyline points="10 6 4 12 10 18" /></>,
}

const steps = [
    { icon: "upload", title: "Upload resume & paste job description", desc: "Drop in your resume as a PDF and paste the full job description. No forms to fill out — just the two things you already have." },
    { icon: "sparkle", title: "Gemini analyzes fit and gaps", desc: "Our AI compares your background against the role's requirements, scoring your match and identifying exactly where the gaps are." },
    { icon: "file", title: "Get your full prep report", desc: "Receive a match score, likely interview questions, a day-by-day study plan, and a tailored resume — ready to download." },
]

const HowItWorksPage = () => {
    return (
        <div className="hiw-page">
            <nav className="hiw-navbar">
                <div className="hiw-container hiw-navbar__inner">
                    <Link to="/" className="hiw-navbar__brand">
                        <span className="hiw-logo-mark"><Icon size={16}>{paths.brain}</Icon></span>
                        InterviewAI
                    </Link>
                    <div className="hiw-navbar__links">
                        <Link to="/features">Features</Link>
                        <Link to="/how-it-works">How it works</Link>
                        <Link to="/pricing">Pricing</Link>
                    </div>
                    <div className="hiw-navbar__actions">
                        <Link to="/login" className="hiw-navbar__signin">Sign in</Link>
                        <Link to="/register" className="hiw-navbar__cta">Get started</Link>
                    </div>
                </div>
            </nav>

            <div className="hiw-container hiw-back-link">
                <Link to="/">
                    <Icon size={14}>{paths.arrowLeft}</Icon> Back to home
                </Link>
            </div>

            <header className="hiw-hero">
                <div className="hiw-container">
                    <span className="hiw-hero__badge">✦ Three steps, a few minutes</span>
                    <h1>From resume to<br />prep report in minutes</h1>
                    <p>No complicated setup. Upload what you already have, and let Gemini do the analysis.</p>
                </div>
            </header>

            <section className="hiw-steps">
                <div className="hiw-container">
                    {steps.map((s, i) => (
                        <div key={i} className={`hiw-step ${i % 2 === 1 ? "hiw-step--reverse" : ""}`}>
                            <div className="hiw-step__visual">
                                <span className="hiw-step__number">{i + 1}</span>
                                <Icon size={32} className="hiw-step__icon">{paths[s.icon]}</Icon>
                            </div>
                            <div className="hiw-step__content">
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="hiw-cta">
                <div className="hiw-container">
                    <h2>Try it with your own resume</h2>
                    <p>Free to start. No credit card needed.</p>
                    <Link to="/register" className="hiw-btn-primary">
                        Get your report <Icon size={16}>{paths.arrow}</Icon>
                    </Link>
                </div>
            </section>

            <footer className="hiw-footer">
                <div className="hiw-container">
                    <p>
        © 2026 InterviewAI. Built by{" "}
        <a href="https://github.com/mridul2172" target="_blank" rel="noreferrer" className="lp-footer__credit">
            Mridul Tiwari
        </a>
    </p>
                </div>
            </footer>
        </div>
    )
}

export default HowItWorksPage