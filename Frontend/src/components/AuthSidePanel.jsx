import React from 'react'
import './authSidePanel.scss'

/**
 * Reusable inline SVG icon wrapper.
 * Keeps stroke/viewBox/size config in one place so every icon
 * used in this component stays visually consistent.
 *
 * @param {React.ReactNode} children - SVG path/shape elements to render inside the <svg>
 * @param {number} [size=18] - width & height of the icon in px
 * @param {string} [className] - optional extra class for styling hooks
 */
const Icon = ({ children, size = 18, className = "" }) => (
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

// Centralized icon path data.
// Keeping these outside the component avoids re-creating JSX on every render
// and makes it easy to add/reuse icons elsewhere without duplicating markup.
const paths = {
    brain: (
        <>
            <path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
            <path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
        </>
    ),
    target: (
        <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" />
        </>
    ),
    route: (
        <>
            <circle cx="6" cy="19" r="2" />
            <circle cx="18" cy="5" r="2" />
            <path d="M8 19h6a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4H8" />
        </>
    ),
    download: (
        <>
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 21h14" />
        </>
    ),
}

/**
 * AuthSidePanel
 * ---------------------------------------------------------------------------
 * Decorative side panel shown alongside the Login/Register forms.
 * Displays brand identity, a sample "report card" preview, variant-specific
 * marketing copy (login vs register), and a testimonial block.
 *
 * @param {"login" | "register"} [variant="login"] - controls which copy/
 *        feature-list block is rendered on the right-hand side.
 */
const AuthSidePanel = ({ variant = "login" }) => {
    return (
        <div className="auth-side-panel">
            {/* ---------- Brand / Logo ---------- */}
            <div className="auth-side-panel__brand">
                <span className="auth-side-panel__brand-mark">
                    <Icon size={17}>{paths.brain}</Icon>
                </span>
                InterviewAI
            </div>

            <div className="auth-side-panel__body">
                {/* ---------- Sample report card (visual proof/preview) ---------- */}
                <div className="auth-side-panel__report-card">
                    <div className="auth-side-panel__report-card-header">
                        <span>Frontend Engineer @ Acme</span>
                        <span className="auth-side-panel__report-card-score">82%</span>
                    </div>

                    {/* Static progress bar — purely illustrative, not tied to real data */}
                    <div className="auth-side-panel__report-card-bar">
                        <div className="auth-side-panel__report-card-bar-fill"></div>
                    </div>

                    <div className="auth-side-panel__report-card-stats">
                        <div>
                            <span>Skill gap</span>
                            <p>System design</p>
                        </div>
                        <div>
                            <span>Prep plan</span>
                            <p>7 days</p>
                        </div>
                    </div>
                </div>

                {/*
                  ---------- Variant-specific content ----------
                  "login"    -> short welcome-back message
                  "register" -> marketing badge + headline + feature highlights
                */}
                {variant === "login" ? (
                    <>
                        <h2>Pick up right where you left off</h2>
                        <p>Your reports, prep plans, and analytics are all saved securely to your account.</p>
                    </>
                ) : (
                    <>
                        <span className="auth-side-panel__badge">✦ Free to start</span>
                        <h2>Know exactly what to study before your next interview</h2>
                        <p>Join 2,400+ candidates using InterviewAI to prep smarter, not longer.</p>

                        {/* Feature list — each item pairs an icon with a title + short description */}
                        <div className="auth-side-panel__features">
                            <div>
                                <span><Icon size={18}>{paths.target}</Icon></span>
                                <div>
                                    <p className="auth-side-panel__feature-title">Instant match score</p>
                                    <p className="auth-side-panel__feature-desc">Know your fit before you apply</p>
                                </div>
                            </div>
                            <div>
                                <span><Icon size={18}>{paths.route}</Icon></span>
                                <div>
                                    <p className="auth-side-panel__feature-title">Day-by-day prep plan</p>
                                    <p className="auth-side-panel__feature-desc">Never wonder what to study next</p>
                                </div>
                            </div>
                            <div>
                                <span><Icon size={18}>{paths.download}</Icon></span>
                                <div>
                                    <p className="auth-side-panel__feature-title">Tailored resume export</p>
                                    <p className="auth-side-panel__feature-desc">Download it ready to send</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ---------- Social proof / testimonial ---------- */}
            <div className="auth-side-panel__testimonial">
                <span className="auth-side-panel__testimonial-avatar">RK</span>
                <div>
                    <p className="auth-side-panel__testimonial-quote">"Went from guessing to a clear 7-day plan."</p>
                    <p className="auth-side-panel__testimonial-name">Riya K. — Software Engineer</p>
                </div>
            </div>
        </div>
    )
}

export default AuthSidePanel