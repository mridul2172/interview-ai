import React from 'react'
import { Link } from 'react-router'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useInterview } from '../hooks/useInterview'
import { SimpleLoader } from '../../../components/LoadingScreen'
import './analytics.scss'

const Analytics = () => {
    const { reports, loading } = useInterview()

    if (loading) {
        return <SimpleLoader text="Loading your analytics..." />
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="analytics-page">
                <div className="analytics-empty">
                    <p>Generate at least one interview report to see your analytics.</p>
                    <Link to="/dashboard">← Back to Home</Link>
                </div>
            </div>
        )
    }

    // Match score distribution
    const avgScore = Math.round(reports.reduce((sum, r) => sum + (r.matchScore || 0), 0) / reports.length)
    const highest = Math.max(...reports.map(r => r.matchScore || 0))
    const lowest = Math.min(...reports.map(r => r.matchScore || 0))

    // Score trend over time (oldest to newest)
    const trendData = [ ...reports ]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((r, i) => ({ name: `#${i + 1}`, score: r.matchScore }))

    // Skill gap frequency
    const skillCount = {}
    reports.forEach(r => {
        (r.skillGaps || []).forEach(gap => {
            skillCount[ gap.skill ] = (skillCount[ gap.skill ] || 0) + 1
        })
    })
    const skillData = Object.entries(skillCount)
        .map(([ skill, count ]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)

    // Severity distribution
    const severityCount = { low: 0, medium: 0, high: 0 }
    reports.forEach(r => {
        (r.skillGaps || []).forEach(gap => {
            if (severityCount[ gap.severity ] !== undefined) severityCount[ gap.severity ]++
        })
    })
    const severityData = [
        { name: "Low", value: severityCount.low, color: "#34d399" },
        { name: "Medium", value: severityCount.medium, color: "#fbbf24" },
        { name: "High", value: severityCount.high, color: "#f87171" }
    ].filter(d => d.value > 0)

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h1>Your Analytics</h1>
                <p>Trends across all {reports.length} interview reports.</p>
            </div>

            <div className="analytics-stats">
                <div className="stat-card">
                    <p className="stat-num">{reports.length}</p>
                    <p className="stat-label">Total Reports</p>
                </div>
                <div className="stat-card">
                    <p className="stat-num">{avgScore}%</p>
                    <p className="stat-label">Average Match</p>
                </div>
                <div className="stat-card">
                    <p className="stat-num" style={{ color: "#34d399" }}>{highest}%</p>
                    <p className="stat-label">Highest Score</p>
                </div>
                <div className="stat-card">
                    <p className="stat-num" style={{ color: "#f87171" }}>{lowest}%</p>
                    <p className="stat-label">Lowest Score</p>
                </div>
            </div>

            <div className="analytics-grid">

                <div className="analytics-card">
                    <h3>Match Score Trend</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={trendData}>
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} domain={[ 0, 100 ]} />
                            <Tooltip contentStyle={{ background: "#171a21", border: "1px solid #262b35", borderRadius: "8px", color: "#fff" }} />
                            <Bar dataKey="score" fill="#e1034d" radius={[ 6, 6, 0, 0 ]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                    <h3>Skill Gap Severity</h3>
                    {severityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {severityData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: "#171a21", border: "1px solid #262b35", borderRadius: "8px", color: "#fff" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="no-data">No skill gaps recorded yet.</p>
                    )}
                </div>

                <div className="analytics-card analytics-card--full">
                    <h3>Most Common Skill Gaps</h3>
                    {skillData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={skillData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                                <YAxis type="category" dataKey="skill" stroke="#6b7280" fontSize={12} width={160} />
                                <Tooltip contentStyle={{ background: "#171a21", border: "1px solid #262b35", borderRadius: "8px", color: "#fff" }} />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[ 0, 6, 6, 0 ]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="no-data">No skill gaps recorded yet.</p>
                    )}
                </div>

            </div>

            <Link to="/dashboard" className="analytics-back">← Back to Home</Link>
        </div>
    )
}

export default Analytics