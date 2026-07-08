const nodemailer = require("nodemailer")

// family: 4 forces IPv4 for the SMTP connection — Render's free tier has
// unreliable outbound IPv6 routing, which was causing ENETUNREACH errors
// when nodemailer tried to reach Gmail's SMTP server over IPv6
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    family: 4
})


/**
 * Sends an email verification link to a newly registered user.
 * The token is expected to expire in 1 hour on the backend as well,
 * matching what's stated in the email copy.
 *
 * @param {string} to - Recipient email address
 * @param {string} token - Email verification token to embed in the link
 * @returns {Promise<void>}
 * @throws Will re-throw if nodemailer fails to send the email
 */
async function sendVerificationEmail(to, token) {
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: "Verify your email",
            html: `<p>Click <a href="${link}">here</a> to verify your email. This link expires in 1 hour.</p>`
        })
        // Log delivery status so email issues show up in server logs, not just silent failures
        console.log("Email sent:", info.messageId, info.accepted, info.rejected)
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
 * @throws Will re-throw if nodemailer fails to send the email
 */
async function sendResetPasswordEmail(to, token) {
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: "Reset your password",
            html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 1 hour.</p>`
        })
        console.log("Email sent:", info.messageId, info.accepted, info.rejected)
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
 * @throws Will re-throw if nodemailer fails to send the email
 */
async function sendOtpEmail(to, otp) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: "Your verification code",
            html: `<p>Your verification code is:</p>
                   <h2 style="letter-spacing: 4px;">${otp}</h2>
                   <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>`
        })
        console.log("OTP email sent:", info.messageId, info.accepted, info.rejected)
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
 * @throws Will re-throw if nodemailer fails to send the email
 */
async function sendContactEmail({ name, email, message }) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New contact form message from ${name}`,
            html: `<p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong></p>
                   <p>${message}</p>`
        })
        console.log("Contact email sent:", info.messageId, info.accepted, info.rejected)
    } catch (err) {
        console.error("Contact email sending failed:", err.message)
        throw err
    }
}



module.exports = { sendVerificationEmail, sendResetPasswordEmail, sendOtpEmail, sendContactEmail }