const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

// Resend requires the "from" address to be on a domain you've verified in
// their dashboard. Until a custom domain is verified there, their sandbox
// address "onboarding@resend.dev" works for testing.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"


/**
 * Sends an email verification link to a newly registered user.
 * The token is expected to expire in 1 hour on the backend as well,
 * matching what's stated in the email copy.
 *
 * @param {string} to - Recipient email address
 * @param {string} token - Email verification token to embed in the link
 * @returns {Promise<void>}
 * @throws Will re-throw if Resend fails to send the email
 */
async function sendVerificationEmail(to, token) {
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: "Verify your email",
            html: `<p>Click <a href="${link}">here</a> to verify your email. This link expires in 1 hour.</p>`
        })

        if (error) throw error

        console.log("Email sent:", data.id)
    } catch (err) {
        console.error("Email sending failed:", err.message)
        throw err
    }
}


/**
 * Sends a password reset link to the user's email.
 *
 * @param {string} to - Recipient email address
 * @param {string} token - Password reset token to embed in the link
 * @returns {Promise<void>}
 * @throws Will re-throw if Resend fails to send the email
 */
async function sendResetPasswordEmail(to, token) {
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: "Reset your password",
            html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 1 hour.</p>`
        })

        if (error) throw error

        console.log("Email sent:", data.id)
    } catch (err) {
        console.error("Email sending failed:", err.message)
        throw err
    }
}


/**
 * Sends a one-time password (OTP) to the given email, used for flows like
 * pre-registration verification or email change confirmation.
 *
 * @param {string} to - Recipient email address
 * @param {string|number} otp - The OTP code to send
 * @returns {Promise<void>}
 * @throws Will re-throw if Resend fails to send the email
 */
async function sendOtpEmail(to, otp) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: "Your verification code",
            html: `<p>Your verification code is:</p>
                   <h2 style="letter-spacing: 4px;">${otp}</h2>
                   <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>`
        })

        if (error) throw error

        console.log("OTP email sent:", data.id)
    } catch (err) {
        console.error("OTP email sending failed:", err.message)
        throw err
    }
}


/**
 * Forwards a contact form submission to the site owner's inbox,
 * with the sender's email set as replyTo so replies go straight to them.
 *
 * @param {Object} params
 * @param {string} params.name - Name of the person submitting the form
 * @param {string} params.email - Email of the person submitting the form
 * @param {string} params.message - Message content from the form
 * @returns {Promise<void>}
 * @throws Will re-throw if Resend fails to send the email
 */
async function sendContactEmail({ name, email, message }) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New contact form message from ${name}`,
            html: `<p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong></p>
                   <p>${message}</p>`
        })

        if (error) throw error

        console.log("Contact email sent:", data.id)
    } catch (err) {
        console.error("Contact email sending failed:", err.message)
        throw err
    }
}



module.exports = { sendVerificationEmail, sendResetPasswordEmail, sendOtpEmail, sendContactEmail }