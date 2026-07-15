import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './landingPage.scss'

// icon wrapper so we don't have to repeat svg attrs everywhere
const Icon = ({ children, size = 20, className = "" }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {children}
    </svg>
)

// all icon paths in one place, outside the component so they don't get recreated on every render
const paths = {
    brain: <><path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" /><path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    question: <><path d="M9 9a3 3 0 1 1 4 2.83c-.7.3-1.5.9-1.5 2.17" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h6a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4H8" /></>,
    download: <><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></>,
    chart: <><path d="M4 20V10" /><path d="M12 20V4" /><path d="M20 20v-7" /></>,
    refresh: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" /></>,
    github: <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="8" y1="10" x2="8" y2="16" /><circle cx="8" cy="7" r="0.5" /><path d="M12 16v-3a2 2 0 0 1 4 0v3" /><line x1="12" y1="10" x2="12" y2="16" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
    arrow: <><line x1="4" y1="12" x2="20" y2="12" /><polyline points="14 6 20 12 14 18" /></>,
}

// feature grid data — edit here, not in the JSX below
const features = [
    { icon: "target", title: "Match score", desc: "See how well you fit the role before you apply." },
    { icon: "question", title: "Likely questions", desc: "Technical and behavioral, tailored to the JD." },
    { icon: "route", title: "Day-by-day plan", desc: "A roadmap so you know what to study first." },
    { icon: "download", title: "Tailored resume", desc: "Download an AI-adjusted resume as PDF." },
    { icon: "chart", title: "Track your trends", desc: "Analytics on scores and recurring gaps over time." },
    { icon: "refresh", title: "Regenerate a section", desc: "Redo just the questions without starting over." },
]

const steps = [
    { num: 1, text: "Upload resume and paste the job description" },
    { num: 2, text: "Gemini analyzes your fit and finds the gaps" },
    { num: 3, text: "Get your full interview prep report" },
]

const stats = [
    { value: "2,400+", label: "Reports generated" },
    { value: "4.8/5", label: "Average rating" },
    { value: "Free", label: "To get started" },
]

const LandingPage = () => {

    // fake counting animation for the score on the hero card, just for effect
    const [ score, setScore ] = useState(0)

    useEffect(() => {
        const target = 82
        let current = 0

        // ticks up by 3 every 40ms till it hits 82, then stops
        const timer = setInterval(() => {
            current += 3
            if (current >= target) {
                current = target
                clearInterval(timer)
            }
            setScore(current)
        }, 40)

        return () => clearInterval(timer) // clear it if we unmount mid-animation
    }, [])

    return (
        <div className="landing-page">

            {/* navbar */}
            <nav className="lp-navbar">
                <div className="lp-container lp-navbar__inner">
                    <Link to="/" className="lp-navbar__brand">
                        <span className="lp-logo-mark">
                            <Icon size={16}>{paths.brain}</Icon>
                        </span>
                        InterviewAI
                    </Link>
                    <div className="lp-navbar__links">
                        <Link to="/features">Features</Link>
                        <Link to="/how-it-works">How it works</Link>
                        <Link to="/pricing">Pricing</Link>
                    </div>
                    <div className="lp-navbar__actions">
                        <Link to="/login" className="lp-navbar__signin">Sign in</Link>
                        <Link to="/register" className="lp-navbar__cta">Get started</Link>
                    </div>
                </div>
            </nav>

            {/* hero */}
            <section className="lp-hero">
                <div className="lp-container lp-hero__grid">
                    <div className="lp-hero__content">
                        <span className="lp-hero__badge">✦ Powered by Gemini AI</span>
                        <h1>Know exactly what<br />to study before your<br />next interview</h1>
                        <p>Upload your resume, paste the job description, and get a match score, likely questions, skill gaps, and a day-by-day prep plan — all in minutes.</p>
                        <div className="lp-hero__actions">
                            <Link to="/register" className="lp-btn-primary">
                                Generate my report <Icon size={16}>{paths.arrow}</Icon>
                            </Link>
                            <Link to="/how-it-works" className="lp-btn-secondary">See how it works</Link>
                        </div>
                        <div className="lp-hero__stats">
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <div className="lp-hero__stats-value">{s.value}</div>
                                    <div className="lp-hero__stats-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* two overlapping mock cards, back one's static, front one animates */}
                    <div className="lp-hero__visual">
                        <div className="lp-report-card lp-report-card--back">
                            <div className="lp-report-card__header">
                                <span>Backend Engineer @ Nova</span>
                                <span className="lp-report-card__score lp-report-card__score--sm">74%</span>
                            </div>
                            <div className="lp-report-card__bar lp-report-card__bar--sm">
                                <div className="lp-report-card__bar-fill" style={{ width: "74%" }}></div>
                            </div>
                        </div>

                        <div className="lp-report-card lp-report-card--front">
                            <div className="lp-report-card__header">
                                <span>Frontend Engineer @ Acme</span>
                                <span className="lp-report-card__score">{score}%</span>
                            </div>
                            <div className="lp-report-card__bar">
                                <div className="lp-report-card__bar-fill" style={{ width: `${score}%` }}></div>
                            </div>
                            <div className="lp-report-card__stats">
                                <div>
                                    <span>Skill gap</span>
                                    <p>System design</p>
                                </div>
                                <div>
                                    <span>Prep plan</span>
                                    <p>7 days</p>
                                </div>
                            </div>
                            <div className="lp-report-card__question">
                                <span>Likely question</span>
                                <p>"Walk me through how you'd design a URL shortener."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* features grid */}
            <section className="lp-section">
                <div className="lp-container">
                    <p className="lp-section__eyebrow">What you get</p>
                    <div className="lp-features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="lp-feature-card">
                                <Icon className="lp-feature-card__icon">{paths[f.icon]}</Icon>
                                <p className="lp-feature-card__title">{f.title}</p>
                                <p className="lp-feature-card__desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* how it works - 3 steps */}
            <section className="lp-how-it-works">
                <div className="lp-container">
                    <p className="lp-section__eyebrow">How it works</p>
                    <div className="lp-steps-row">
                        <div className="lp-steps-row__line"></div>
                        {steps.map((step) => (
                            <div className="lp-step" key={step.num}>
                                <div className="lp-step__circle">{step.num}</div>
                                <p>{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* bottom cta */}
            <section className="lp-cta">
                <div className="lp-container">
                    <h2>Stop guessing what to study</h2>
                    <p>Free to start. No credit card needed.</p>
                    <Link to="/register" className="lp-btn-primary">
                        Get your report <Icon size={16}>{paths.arrow}</Icon>
                    </Link>
                </div>
            </section>

            {/* footer */}
            <footer className="lp-footer">
                <div className="lp-container">
                    <div className="lp-footer__grid">
                        <div>
                            <div className="lp-footer__brand">
                                <span className="lp-logo-mark lp-logo-mark--small">
                                    <Icon size={13}>{paths.brain}</Icon>
                                </span>
                                InterviewAI
                            </div>
                            <p className="lp-footer__tagline">Prep smarter, not longer.</p>
                        </div>
                        <div>
                            <p className="lp-footer__heading">Product</p>
                            <Link to="/features">Features</Link>
                            <Link to="/how-it-works">How it works</Link>
                            <Link to="/pricing">Pricing</Link>
                        </div>
                        <div>
                            <p className="lp-footer__heading">Legal</p>
                            <Link to="/privacy">Privacy policy</Link>
                            <Link to="/terms">Terms of service</Link>
                            <Link to="/cookies">Cookie policy</Link>
                        </div>
                        <div>
                            <p className="lp-footer__heading">Connect</p>
                            <div className="lp-footer__socials">
                                 <a href="https://github.com/mridul2172/interview-ai" target="_blank" rel="noreferrer" aria-label="GitHub">
        <Icon size={18}>{paths.github}</Icon>
    </a>
                                <a href="https://www.linkedin.com/in/mridul-tiwari-144292338" target="_blank" rel="noreferrer" aria-label="LinkedIn">
        <Icon size={18}>{paths.linkedin}</Icon>
    </a>
                                <Link to="/contact" aria-label="Contact">
                                    <Icon size={18}>{paths.mail}</Icon>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="lp-footer__bottom">
    <p>
        © 2026 InterviewAI. Built by{" "}
        <a href="https://github.com/mridul2172" target="_blank" rel="noreferrer" className="lp-footer__credit">
            Mridul Tiwari
        </a>
    </p>
</div>
                </div>
            </footer>

        </div>
    )
}

export default LandingPage