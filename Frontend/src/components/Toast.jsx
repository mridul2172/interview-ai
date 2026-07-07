import React, { useEffect } from 'react'
import "./toast.scss"

const Toast = ({ message, type = "success", onClose }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 3000)

        return () => clearTimeout(timer)
    }, [ onClose ])

    if (!message) return null

    return (
        <div className={`toast toast--${type}`}>
            <span className="toast__icon">{type === "success" ? "✓" : "✕"}</span>
            <span className="toast__message">{message}</span>
        </div>
    )
}

export default Toast