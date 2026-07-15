import React from 'react'
import { Link } from 'react-router'
import './featuresPage.scss'

const Icon = ({ children, size = 22, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
)

const paths = {
    brain: <><path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" /><path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    question: <><path d="M9 9a3 3 0 1 1 4 2.83c-.7.3-1.5.9-1.5 2.17" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h6a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4H8" /></>,
    download: <><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></>,
    chart: <><path d="M4 20V10" /><path d="M12 20V4" /><path d="M20 20v-7" /></>,
    refresh: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></>,
    arrow: <><line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" /></>,
    arrowLeft: <><line x1="20" y1="12" x2="4" y2="12" /><polyline points="10 6 4 12 10 18" /></>,
}

const features = [
    { icon: "target", title: "Match score", desc: "Paste a job description and your resume to get an instant compatibility score, so you know exactly how strong your application is before you hit apply." },
    { icon: "question", title: "Likely questions", desc: "Get a tailored list of technical and behavioral questions based on the actual role — not generic interview question banks." },
    { icon: "route", title: "Day-by-day plan", desc: "Turn your skill gaps into a structured prep schedule, so you always know what to study next instead of guessing." },
    { icon: "download", title: "Tailored resume", desc: "Download an AI-adjusted version of your resume, rewritten to better match the language and priorities of the job description." },
    { icon: "chart", title: "Track your trends", desc: "See your match scores and recurring skill gaps over time across every report you generate, so you can track real improvement." },
    { icon: "refresh", title: "Regenerate a section", desc: "Not happy with the questions or plan you got? Regenerate just that section without starting your whole report over." },
]

const FeaturesPage = () => {
    return (
        <div className="features-page">
            <nav className="fp-navbar">
                <div className="fp-container fp-navbar__inner">
                    <Link to="/" className="fp-navbar__brand">
                        <span className="fp-logo-mark"><Icon size={16}>{paths.brain}</Icon></span>
                        InterviewAI
                    </Link>
                    <div className="fp-navbar__links">
                        <Link to="/features">Features</Link>
                        <Link to="/how-it-works">How it works</Link>
                        <Link to="/pricing">Pricing</Link>
                    </div>
                    <div className="fp-navbar__actions">
                        <Link to="/login" className="fp-navbar__signin">Sign in</Link>
                        <Link to="/register" className="fp-navbar__cta">Get started</Link>
                    </div>
                </div>
            </nav>

            <div className="fp-container fp-back-link">
                <Link to="/">
                    <Icon size={14}>{paths.arrowLeft}</Icon> Back to home
                </Link>
            </div>

            <header className="fp-hero">
                <div className="fp-container">
                    <span className="fp-hero__badge">✦ Everything in one place</span>
                    <h1>Everything you need to walk<br />into an interview prepared</h1>
                    <p>From match scoring to a day-by-day study plan, InterviewAI turns a resume and a job description into a complete prep report.</p>
                </div>
            </header>

            <section className="fp-list">
                <div className="fp-container fp-list__grid">
                    {features.map((f, i) => (
                        <div key={i} className="fp-card">
                            <Icon className="fp-card__icon">{paths[f.icon]}</Icon>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="fp-cta">
                <div className="fp-container">
                    <h2>Ready to see your match score?</h2>
                    <p>Free to start. No credit card needed.</p>
                    <Link to="/register" className="fp-btn-primary">
                        Get your report <Icon size={16}>{paths.arrow}</Icon>
                    </Link>
                </div>
            </section>

            <footer className="fp-footer">
                <div className="fp-container">
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

export default FeaturesPage