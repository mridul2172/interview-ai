import React, { useState } from 'react'
import { Link } from 'react-router'
import './legalPage.scss'
import Toast from '../../../components/Toast'
import { submitContactForm } from '../services/contact.api'

const Contact = () => {

    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ message, setMessage ] = useState("")
    const [ toast, setToast ] = useState(null)
    const [ submitting, setSubmitting ] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await submitContactForm({ name, email, message })
            setToast({ type: "success", text: "Message sent! We'll get back to you soon." })
            setName("")
            setEmail("")
            setMessage("")
        } catch (err) {
            setToast({ type: "error", text: err.message || "Something went wrong. Try again." })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="legal-page">

            {toast && (
                <Toast
                    message={toast.text}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <nav className="legal-navbar">
                <Link to="/" className="legal-navbar__brand">
                    <span className="legal-navbar__dot"></span>
                    InterviewAI
                </Link>
            </nav>

            <div className="legal-content">
                <h1>Contact Us</h1>
                <p className="legal-updated">Have a question or feedback? Send us a message.</p>

                <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>

                    <div className="input-group" style={{ marginBottom: "16px" }}>
                        <label htmlFor="name" style={{ display: "block", color: "#c5cad3", fontSize: "13px", marginBottom: "6px" }}>Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text" id="name" required
                            style={{ width: "100%", boxSizing: "border-box", background: "#171a21", border: "1px solid #262b35", color: "#fff", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
                    </div>

                    <div className="input-group" style={{ marginBottom: "16px" }}>
                        <label htmlFor="email" style={{ display: "block", color: "#c5cad3", fontSize: "13px", marginBottom: "6px" }}>Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" required
                            style={{ width: "100%", boxSizing: "border-box", background: "#171a21", border: "1px solid #262b35", color: "#fff", padding: "10px 14px", borderRadius: "10px", fontSize: "14px" }} />
                    </div>

                    <div className="input-group" style={{ marginBottom: "20px" }}>
                        <label htmlFor="message" style={{ display: "block", color: "#c5cad3", fontSize: "13px", marginBottom: "6px" }}>Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            id="message" required rows={5}
                            style={{ width: "100%", boxSizing: "border-box", background: "#171a21", border: "1px solid #262b35", color: "#fff", padding: "10px 14px", borderRadius: "10px", fontSize: "14px", resize: "vertical" }} />
                    </div>

                    <button className="button primary-button" style={{ width: "100%" }} disabled={submitting}>
                        {submitting ? "Sending..." : "Send Message"}
                    </button>

                </form>

                <Link to="/" className="legal-back-link">← Back to Home</Link>
            </div>

        </div>
    )
}

export default Contact