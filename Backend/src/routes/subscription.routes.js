const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const {
    createSubscription,
    getMySubscription,
    handleWebhook,
} = require('../controllers/subscription.controller')

const subscriptionRouter = express.Router()

/**
 * @route POST /api/subscription/create-subscription
 * @description starts a new Pro subscription for the logged-in user
 * @access private
 */
subscriptionRouter.post('/create-subscription', authMiddleware.authUser, createSubscription)

/**
 * @route GET /api/subscription/me
 * @description returns the logged-in user's current plan/status
 * @access private
 */
subscriptionRouter.get('/me', authMiddleware.authUser, getMySubscription)

/**
 * @route POST /api/subscription/webhook
 * @description Razorpay server callback — activates/cancels Pro plan.
 * Uses express.raw() instead of the app-level express.json() because the
 * signature check needs the exact raw bytes Razorpay sent.
 * @access public (Razorpay only, verified via signature)
 */
subscriptionRouter.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook)

module.exports = subscriptionRouter