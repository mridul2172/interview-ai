import React, { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router'
import "./myReports.scss"
import { useInterview } from '../hooks/useInterview'
import { SimpleLoader } from '../../../components/LoadingScreen'


const MyReports = () => {

    const { reports, loading } = useInterview()
    const navigate = useNavigate()

    const [ search, setSearch ] = useState("")
    const [ sortBy, setSortBy ] = useState("newest")

    const filteredReports = useMemo(() => {
        let list = [ ...(reports || []) ]

        if (search.trim()) {
            list = list.filter(r =>
                (r.title || "Untitled Position").toLowerCase().includes(search.toLowerCase())
            )
        }

        if (sortBy === "newest") {
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        } else if (sortBy === "oldest") {
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        } else if (sortBy === "highest") {
            list.sort((a, b) => b.matchScore - a.matchScore)
        } else if (sortBy === "lowest") {
            list.sort((a, b) => a.matchScore - b.matchScore)
        }

        return list
    }, [ reports, search, sortBy ])

    const getScoreClass = (score) => {
        if (score >= 80) return "mr-score--high"
        if (score >= 60) return "mr-score--mid"
        return "mr-score--low"
    }

   if (loading) {
        return <SimpleLoader text="Fetching your reports..." />
    }

    return (
        <div className="my-reports-page">

            <div className="mr-header">
                <h1>
                    My Interview Reports
                    {loading && <span className="mr-mini-spinner"></span>}
                </h1>
                <p>All your generated interview strategies in one place.</p>
            </div>

            <div className="mr-controls">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search by job title..." />

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest score</option>
                    <option value="lowest">Lowest score</option>
                </select>
            </div>

           {filteredReports.length === 0 ? (
                <div className="mr-empty">
                    <div className="mr-empty-icon">📋</div>
                    {reports?.length === 0 ? (
                        <>
                            <p className="mr-empty-title">No interview reports yet</p>
                            <p className="mr-empty-sub">Generate your first personalized interview plan to see it here.</p>
                            <Link to="/dashboard" className="mr-empty-cta">Create your first plan →</Link>
                        </>
                    ) : (
                        <p className="mr-empty-title">No reports match your search</p>
                    )}
                </div>
            ) : (
                <div className="mr-list">
                    {filteredReports.map(report => (
                        <div key={report._id} className="mr-item" onClick={() => navigate(`/interview/${report._id}`)}>
                            <h3>{report.title || "Untitled Position"}</h3>
                            <p className="mr-meta">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                            <span className={`mr-score ${getScoreClass(report.matchScore)}`}>
                                Match Score: {report.matchScore}%
                            </span>
                        </div>
                    ))}
                </div>
            )}

           <Link to="/dashboard" className="mr-back-link">← Back to Home</Link>

        </div>
    )
}

export default MyReports