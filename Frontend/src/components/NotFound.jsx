import React from 'react'
import { Link } from 'react-router'

const NotFound = () => {
    return (
        <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "72px", fontWeight: 800, background: "linear-gradient(90deg, #e1034d, #ff6b9d)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: "8px" }}>
                404
            </div>
            <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: "0 0 10px" }}>Page not found</h1>
            <p style={{ color: "#9199a8", fontSize: "14px", margin: "0 0 28px", maxWidth: "360px" }}>
                The page you're looking for doesn't exist or may have been moved.
            </p>
            <Link to="/" style={{ background: "#e1034d", color: "#fff", padding: "12px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
                ← Back to Home
            </Link>
        </div>
    )
}

export default NotFound