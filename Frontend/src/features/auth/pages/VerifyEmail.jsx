import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import "../auth.form.scss"
import { verifyEmail } from '../services/auth.api'

const VerifyEmail = () => {

    const [ searchParams ] = useSearchParams()
    const token = searchParams.get("token")

    const [ status, setStatus ] = useState("loading") // loading | success | error
    const [ message, setMessage ] = useState("")

    useEffect(() => {

        const runVerification = async () => {

            if (!token) {
                setStatus("error")
                setMessage("No verification token found in the link.")
                return
            }

            try {
                const data = await verifyEmail(token)
                setStatus("success")
                setMessage(data.message)
            } catch (err) {
                setStatus("error")
                setMessage(err.message || "Verification failed.")
            }

        }

        runVerification()

    }, [ token ])

    return (
        <main>
            <div className="form-container">
                {status === "loading" && <h1>Verifying your email...</h1>}

                {status === "success" && (
                    <>
                        <h1>✅ Email Verified!</h1>
                        <p>{message}</p>
                        <Link to="/login" className='button primary-button'>Go to Login</Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1>❌ Verification Failed</h1>
                        <p>{message}</p>
                        <Link to="/login">Back to Login</Link>
                    </>
                )}
            </div>
        </main>
    )
}

export default VerifyEmail