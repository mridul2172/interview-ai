import React from 'react'
import './authSidePanel.scss'

/**
 * Static copy + preview data for the auth side panel, keyed by variant.
 * Add a new key here (e.g. "forgotPassword") to support another auth page
 * without touching the component's rendering logic.
 */
const content = {
    login: {
        heading: <>Your next interview<br />starts <span className="auth-side-panel__gradient-text">right here</span></>,
        tagline: "Personalized questions, skill-gap analysis, and a prep roadmap — tailored to the exact role you're targeting.",
        card: {
            title: "Full Stack Engineer",
            sub: "Match analysis ready",
            score: "95%",
            tags: [
                { label: "React" },
                { label: "Node.js" },
                { label: "✓ 12 questions ready", success: true }
            ]
        },
        stats: [
            { num: "12.4K+", label: "plans made" },
            { num: "4.8★", label: "avg rating" }
        ]
    },
    register: {
        heading: <>Turn your resume<br />into an <span className="auth-side-panel__gradient-text">interview edge</span></>,
        tagline: "Create a free account and get a personalized interview plan — questions, skill gaps, and a prep roadmap — in under a minute.",
        card: {
            title: "Product Designer",
            sub: "Prep plan generated",
            score: "88%",
            tags: [
                { label: "Figma" },
                { label: "UX Research" },
                { label: "✓ 7-day roadmap ready", success: true }
            ]
        },
        stats: [
            { num: "2 min", label: "average setup" },
            { num: "100%", label: "free to start" }
        ]
    }
}

/**
 * Decorative side panel shown next to the login/register forms.
 * Renders a headline, tagline, and a fake "preview card" to give new
 * visitors a quick visual sense of what the product produces.
 *
 * @param {Object} props
 * @param {"login"|"register"} [props.variant="login"] - Which copy/preview set to show
 */
const AuthSidePanel = ({ variant = "login" }) => {
    // Falls back to login content if an unrecognized variant is passed in
    const data = content[ variant ] || content.login

    return (
        <div className="auth-side-panel">
            <div className="auth-side-panel__content">
                <div className="auth-side-panel__brand">
                    <span className="auth-side-panel__brand-dot"></span>
                    <span className="auth-side-panel__brand-name">InterviewAI</span>
                </div>

                <h1>{data.heading}</h1>

                <p className="auth-side-panel__tagline">{data.tagline}</p>
            </div>

            <div className="auth-side-panel__preview-card">
                <div className="auth-side-panel__card-header">
                    <div>
                        <p className="auth-side-panel__card-title">{data.card.title}</p>
                        <p className="auth-side-panel__card-sub">{data.card.sub}</p>
                    </div>
                    <div className="auth-side-panel__card-score">{data.card.score}</div>
                </div>
                <div className="auth-side-panel__card-tags">
                    {data.card.tags.map((tag, i) => (
                        <span key={i} className={`auth-side-panel__tag ${tag.success ? "auth-side-panel__tag--success" : ""}`}>
                            {tag.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="auth-side-panel__stats">
                {data.stats.map((stat, i) => (
                    <div key={i}>
                        <p className="auth-side-panel__stat-num">{stat.num}</p>
                        <p className="auth-side-panel__stat-label">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AuthSidePanel