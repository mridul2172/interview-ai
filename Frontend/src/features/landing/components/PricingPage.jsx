import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { createSubscription } from '../../auth/services/subscription.api'
import './pricingPage.scss'

const Icon = ({ children, size = 18, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
)

const paths = {
    brain: <><path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" /><path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>,
    arrowLeft: <><line x1="20" y1="12" x2="4" y2="12" /><polyline points="10 6 4 12 10 18" /></>,
}

const plans = [
    {
        name: "Free",
        price: "₹0",
        period: "forever",
        desc: "Everything you need to try InterviewAI for a single application.",
        features: ["1 report per day", "Match score & skill gaps", "Likely interview questions", "7-day prep plan"],
        cta: "Get started",
        highlighted: false,
        isPro: false,
    },
    {
        name: "Pro",
        price: "₹299",
        period: "/ month",
        desc: "For active job seekers applying to multiple roles at once.",
        features: ["Unlimited reports", "Tailored resume PDF export", "Analytics & score trends", "Regenerate any section", "Priority Gemini processing"],
        cta: "Upgrade to Pro",
        highlighted: true,
        isPro: true,
    },
]

const PricingPage = () => {
    const { user } = useAuth() // apne useAuth hook mein jo bhi logged-in user milta hai
    const navigate = useNavigate()
    const [ loadingPlan, setLoadingPlan ] = useState(null)

    const handleUpgrade = async () => {
        // Not logged in? Send to login, remember to come back here after
        if (!user) {
            navigate('/login', { state: { from: '/pricing' } })
            return
        }

        setLoadingPlan('pro')
        try {
            const { subscriptionId, keyId } = await createSubscription()

            const options = {
                key: keyId,
                subscription_id: subscriptionId,
                name: "InterviewAI",
                description: "Pro Plan",
                handler: function (response) {
                    // Payment done — webhook will confirm & activate plan on the backend.
                    // We just tell the user and let them refresh/check status.
                    alert("Payment successful! Your Pro plan will activate shortly.")
                    navigate('/dashboard')
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPlan(null)
                    }
                },
                theme: { color: "#FF0F5B" }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (err) {
            alert(err.message || "Could not start checkout")
        } finally {
            setLoadingPlan(null)
        }
    }

    return (
        <div className="pp-page">
            <nav className="pp-navbar">
                <div className="pp-container pp-navbar__inner">
                    <Link to="/" className="pp-navbar__brand">
                        <span className="pp-logo-mark"><Icon size={16}>{paths.brain}</Icon></span>
                        InterviewAI
                    </Link>
                    <div className="pp-navbar__links">
                        <Link to="/features">Features</Link>
                        <Link to="/how-it-works">How it works</Link>
                        <Link to="/pricing">Pricing</Link>
                    </div>
                    <div className="pp-navbar__actions">
                        <Link to="/login" className="pp-navbar__signin">Sign in</Link>
                        <Link to="/register" className="pp-navbar__cta">Get started</Link>
                    </div>
                </div>
            </nav>

            <div className="pp-container pp-back-link">
                <Link to="/">
                    <Icon size={14}>{paths.arrowLeft}</Icon> Back to home
                </Link>
            </div>

            <header className="pp-hero">
                <div className="pp-container">
                    <span className="pp-hero__badge">✦ Simple pricing</span>
                    <h1>Start free. Upgrade<br />when you need more.</h1>
                    <p>No hidden fees. Cancel your subscription anytime.</p>
                </div>
            </header>

            <section className="pp-plans">
                <div className="pp-container pp-plans__grid">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`pp-card ${plan.highlighted ? "pp-card--highlighted" : ""}`}>
                            {plan.highlighted && <span className="pp-card__badge">Most popular</span>}
                            <h3>{plan.name}</h3>
                            <div className="pp-card__price">
                                <span className="pp-card__amount">{plan.price}</span>
                                <span className="pp-card__period">{plan.period}</span>
                            </div>
                            <p className="pp-card__desc">{plan.desc}</p>
                            <ul>
                                {plan.features.map((f) => (
                                    <li key={f}>
                                        <Icon size={16}>{paths.check}</Icon>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {plan.isPro ? (
                                <button
                                    className="pp-btn-primary"
                                    onClick={handleUpgrade}
                                    disabled={loadingPlan === 'pro'}
                                >
                                    {loadingPlan === 'pro' ? "Loading..." : plan.cta}
                                </button>
                            ) : (
                                <Link to="/register" className="pp-btn-secondary">
                                    {plan.cta}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <footer className="pp-footer">
                <div className="pp-container">
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

export default PricingPage