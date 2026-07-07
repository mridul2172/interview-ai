const { sendContactEmail } = require("../services/email.service")

/**
 * @name submitContactFormController
 * @description sends the contact form message to the app owner's email
 * @access Public
 */
async function submitContactFormController(req, res) {

    const { name, email, message } = req.body

    if (!name || !email || !message) {
        return res.status(400).json({
            message: "Name, email and message are required."
        })
    }

    await sendContactEmail({ name, email, message })

    res.status(200).json({
        message: "Your message has been sent successfully."
    })

}

module.exports = { submitContactFormController }