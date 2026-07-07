import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import './landingPage.scss'

const steps = [
    { num: 1, title: "Upload your details", desc: "Add your resume and the job you're targeting." },
    { num: 2, title: "AI builds your plan", desc: "Questions, skill gaps, and a roadmap in under a minute." },
    { num: 3, title: "Practice and prepare", desc: "Work through your plan at your own pace." },
]

const features = [
    { icon: "📄", title: "Resume analysis", desc: "Matches your experience against the exact job requirements." },
    { icon: "💬", title: "Custom questions", desc: "Technical and behavioral questions built for this exact role." },
    { icon: "🗺️", title: "Prep roadmap", desc: "A day-by-day plan so you know exactly what to study next." },
]

// Edit or add testimonials here — each entry just needs a quote, name, and role
const testimonials = [
    {
        quote: "I walked into my interview knowing exactly what they'd ask. The skill-gap section alone saved me a week of guessing what to study.",
        name: "Ananya R.",
        role: "Software engineer",
    },
    {
        quote: "The custom questions felt like they were pulled straight from the actual job posting. I've never felt this prepared before a call.",
        name: "Rohit S.",
        role: "Backend developer",
    },
    {
        quote: "The prep roadmap turned a vague 'study everything' panic into a clear day-by-day plan. That structure alone calmed my nerves.",
        name: "Priya M.",
        role: "Frontend developer",
    },
    {
        quote: "Resume analysis pointed out gaps I didn't even know existed. Fixed them in a day and got a callback within the week.",
        name: "Karan D.",
        role: "Data analyst",
    },
    {
        quote: "Best part was how specific everything was to my exact role, not generic interview tips I'd already read a hundred times.",
        name: "Sneha K.",
        role: "Product manager",
    },
]

const AUTO_SLIDE_MS = 4000

const LandingPage = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Wraps around in both directions (e.g. going "previous" from index 0
    // loops to the last testimonial) using modulo with an added length
    // to avoid negative numbers from JS's modulo behavior
    const goToSlide = useCallback((i) => {
        setActiveIndex((i + testimonials.length) % testimonials.length)
    }, [])

    const goToNext = useCallback(() => {
        goToSlide(activeIndex + 1)
    }, [goToSlide, activeIndex])

    // Auto-advances the testimonial carousel, but pauses while the user is
    // hovering over it (see isPaused, toggled by onMouseEnter/onMouseLeave below)
    useEffect(() => {
        if (isPaused) return
        const timer = setInterval(goToNext, AUTO_SLIDE_MS)
        return () => clearInterval(timer)
    }, [goToNext, isPaused])

    const activeTestimonial = testimonials[activeIndex]

    return (
        <div className="landing-page">

            <nav className="lp-navbar">
                <Link to="/" className="lp-navbar__brand">
                    <span className="lp-navbar__dot"></span>
                    InterviewAI
                </Link>
                <div className="lp-navbar__actions">
                    <Link to="/login" className="lp-btn-ghost">Log in</Link>
                    <Link to="/register" className="lp-btn-primary">Sign up free</Link>
                </div>
            </nav>

            <section className="lp-hero">
                <span className="lp-hero__badge">✨ Powered by AI</span>
                <h1>
                    Walk into every interview <span className="lp-hero__gradient">fully prepared</span>
                </h1>
                <p>
                    Upload your resume and the job description. Our AI builds a personalized question set,
                    skill-gap analysis, and day-by-day prep plan.
                </p>
                <Link to="/register" className="lp-btn-primary lp-btn-primary--lg">
                    Get your interview plan →
                </Link>
            </section>

            <div className="lp-stats">
                <div>
                    <p className="lp-stats__num">12,400+</p>
                    <p className="lp-stats__label">plans generated</p>
                </div>
                <div>
                    <p className="lp-stats__num">89%</p>
                    <p className="lp-stats__label">felt more confident</p>
                </div>
                <div>
                    <p className="lp-stats__num">4.8/5</p>
                    <p className="lp-stats__label">average rating</p>
                </div>
            </div>

            <section className="lp-section">
                <p className="lp-section__eyebrow">How it works</p>
                <h2 className="lp-section__title">Three steps to your custom plan</h2>
                <div className="lp-steps">
                    {steps.map(step => (
                        <div key={step.num} className="lp-step">
                            <div className="lp-step__num">{step.num}</div>
                            <p>{step.title}</p>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="lp-section">
                <div className="lp-features">
                    {features.map((f, i) => (
                        <div key={i} className="lp-feature-card">
                            <div className="lp-feature-card__icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="lp-section">
                <div
                    className="lp-testimonial"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <span className="lp-testimonial__icon">"</span>
                    <p className="lp-testimonial__quote">
                        {activeTestimonial.quote}
                    </p>
                    <p className="lp-testimonial__name">{activeTestimonial.name}</p>
                    <p className="lp-testimonial__role">{activeTestimonial.role}</p>

                    <div className="lp-testimonial__dots">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Testimonial ${i + 1}`}
                                className={
                                    i === activeIndex
                                        ? "lp-testimonial__dot lp-testimonial__dot--active"
                                        : "lp-testimonial__dot"
                                }
                                onClick={() => goToSlide(i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="lp-final-cta">
                <h2>Ready for your next interview?</h2>
                <p>Free to start. No credit card needed.</p>
                <Link to="/register" className="lp-btn-primary lp-btn-primary--lg">
                    Create my plan →
                </Link>
            </section>

            <footer className="lp-footer">
                <p>© 2026 InterviewAI</p>
                <div className="lp-footer__links">
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/terms">Terms</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </footer>

        </div>
    )
}

export default LandingPage