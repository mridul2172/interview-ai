import React, { useState, useEffect } from 'react'

const defaultSteps = [
    { icon: "📄", label: "Analyzing Resume" },
    { icon: "🧠", label: "Understanding Skills" },
    { icon: "📋", label: "Crafting Interview Plan" },
    { icon: "⭐", label: "Personalizing Experience" },
    { icon: "✓", label: "Almost Done" }
]

/**
 * Multi-step animated loading screen shown while an interview plan/report
 * is being generated on the backend. Steps auto-advance on a timer purely
 * for perceived-progress UX — they don't reflect actual backend progress.
 *
 * @param {Object} props
 * @param {string} [props.title="interview plan"] - What's being prepared, shown in the heading
 * @param {string} [props.subtitle] - Supporting line under the heading
 * @param {Array<{icon: string, label: string}>} [props.steps=defaultSteps] - Steps to animate through
 */
const LoadingScreen = ({ title = "interview plan", subtitle = "Our AI is analyzing your profile and crafting the best plan for you", steps = defaultSteps }) => {

    const [ current, setCurrent ] = useState(0)

    // Auto-advances through the steps every 1.5s, stopping at the last step
    // so it doesn't loop back or run past the actual response arriving.
    useEffect(() => {
        if (current >= steps.length - 1) return
        const timer = setTimeout(() => {
            setCurrent(prev => prev + 1)
        }, 1500)
        return () => clearTimeout(timer)
    }, [ current, steps.length ])

    // +1 because "current" is a zero-based index, so step 0 should already show 1/steps.length progress
    const progressPct = Math.round(((current + 1) / steps.length) * 100)

    return (
        <>
            <main className="ls-screen">

                <h1 className="ls-title">
                    Preparing your <span className="ls-title-gradient">{title}...</span>
                </h1>
                <p className="ls-subtitle">{subtitle}</p>

                <div className="ls-steps-row">
                    {steps.map((step, i) => (
                        <div key={i} className="ls-step-wrap">
                            <div className="ls-step-item">
                                <div className={`ls-circle ${i <= current ? "ls-circle--active" : ""}`}>
                                    {step.icon}
                                </div>
                                <span className={`ls-label ${i <= current ? "ls-label--active" : ""}`}>
                                    {step.label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`ls-line ${i < current ? "ls-line--active" : ""}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="ls-progress-wrap">
                    <div className="ls-progress-track">
                        <div className="ls-progress-fill" style={{ width: `${progressPct}%` }}></div>
                    </div>
                    <span className="ls-progress-pct">{progressPct}%</span>
                </div>

                <p className="ls-tagline">🚀 Good things take time. Great interviews start with great preparation!</p>

                <div className="ls-tip-box">
                    💡 <strong>Tip:</strong> Complete your profile and resume for more accurate interview plans.
                </div>

            </main>

            <style>{`
                .ls-screen {
                    min-height: 70vh;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1.5rem;
                    text-align: center;
                }

                .ls-title {
                    color: #fff;
                    font-size: 26px;
                    font-weight: 700;
                    margin: 0 0 8px;
                }

                .ls-title-gradient {
                    background: linear-gradient(90deg, #e1034d, #ff6b9d);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .ls-subtitle {
                    color: #9199a8;
                    font-size: 14px;
                    margin: 0 0 36px;
                }

                .ls-steps-row {
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    margin-bottom: 32px;
                }

                .ls-step-wrap {
                    display: flex;
                    align-items: center;
                }

                .ls-step-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    width: 100px;
                }

                .ls-circle {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    border: 2px solid #262b35;
                    background: #171a21;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    transition: all 0.4s ease;
                }

                .ls-circle--active {
                    border-color: #e1034d;
                    box-shadow: 0 0 14px rgba(225, 3, 77, 0.5);
                }

                .ls-label {
                    color: #5a5f6e;
                    font-size: 12px;
                    transition: color 0.4s ease;
                }

                .ls-label--active {
                    color: #fff;
                }

                .ls-line {
                    width: 32px;
                    height: 2px;
                    background: #262b35;
                    margin-top: -30px;
                    transition: background 0.4s ease;
                }

                .ls-line--active {
                    background: linear-gradient(90deg, #e1034d, #ff6b9d);
                }

                .ls-progress-wrap {
                    width: 100%;
                    max-width: 420px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .ls-progress-track {
                    flex: 1;
                    height: 8px;
                    background: #1a1a24;
                    border-radius: 20px;
                    overflow: hidden;
                }

                .ls-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #e1034d, #ff6b9d);
                    border-radius: 20px;
                    transition: width 0.6s ease;
                }

                .ls-progress-pct {
                    color: #e1034d;
                    font-weight: 700;
                    font-size: 14px;
                    min-width: 36px;
                }

                .ls-tagline {
                    color: #9199a8;
                    font-size: 13px;
                    margin: 0 0 20px;
                }

                .ls-tip-box {
                    max-width: 420px;
                    background: #14141e;
                    border: 1px solid #262b35;
                    border-radius: 12px;
                    padding: 12px 18px;
                    text-align: left;
                    font-size: 13px;
                    color: #b4b7c2;
                }
            `}</style>
        </>
    )
}

/**
 * Minimal fallback spinner for short/generic loading states where the
 * full multi-step LoadingScreen would be overkill (e.g. small in-page
 * actions rather than a full report generation).
 *
 * @param {Object} props
 * @param {string} [props.text="Loading..."] - Text shown below the spinner
 */
export const SimpleLoader = ({ text = "Loading..." }) => {
    return (
        <>
            <div className="sl-wrap">
                <div className="sl-spinner"></div>
                <p className="sl-text">{text}</p>
            </div>
            <style>{`
                .sl-wrap {
                    min-height: 50vh;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                }
                .sl-spinner {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 3px solid #262b35;
                    border-top-color: #e1034d;
                    animation: sl-spin 0.7s linear infinite;
                }
                .sl-text {
                    color: #9199a8;
                    font-size: 14px;
                    margin: 0;
                }
                @keyframes sl-spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    )
}

export default LoadingScreen