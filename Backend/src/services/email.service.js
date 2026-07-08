const nodemailer = require("nodemailer")

/**
 * Gmail SMTP transporter, forced to use IPv4 explicitly.
 * Render's free tier doesn't support outbound IPv6, and Nodemailer's default
 * DNS resolution sometimes picks IPv6 first even with dns.setDefaultResultOrder,
 * so `family: 4` on the transport itself is the reliable fix here.
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
})


/**
 * Sends an email verification link to a newly registered user.
 * The token is expected to expire in 1 hour on the backend as well,
 * matching what's stated in the email copy.
 *
 * @param {string} to - Recipient email address
 * @param {string} token - Email verification token to embed in the link
 * @returns {Promise<void>}
 * @throws Will re-throw if sending the email fails
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
 * @throws Will re-throw if sending the email fails
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
 * @throws Will re-throw if sending the email fails
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
 * @throws Will re-throw if sending the email fails
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