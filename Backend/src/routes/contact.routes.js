const { Router } = require('express')
const contactController = require("../controllers/contact.controller")

const contactRouter = Router()

/**
 * @route POST /api/contact
 * @description submit the contact form
 * @access Public
 */
contactRouter.post("/", contactController.submitContactFormController)

module.exports = contactRouter