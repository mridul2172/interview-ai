const razorpay = require('../config/razorpay')
const crypto = require('crypto')
const userModel = require('../models/user.model')

/**
 * @name createSubscription
 * @description creates a new Razorpay subscription for the logged-in user against the Pro plan
 * @access private
 */
async function createSubscription(req, res) {
    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PRO_PLAN_ID,
            customer_notify: 1,
            total_count: 12, // auto-renews for 12 cycles, then needs recreation
        })

        const user = await userModel.findById(req.user.id)
        user.subscription.razorpaySubscriptionId = subscription.id
        user.subscription.status = 'created'
        await user.save()

        res.status(200).json({
            subscriptionId: subscription.id,
            keyId: process.env.RAZORPAY_KEY_ID,
        })
    } catch (err) {
        console.error("Razorpay subscription creation failed:", err.message)
        res.status(500).json({ message: "Could not create subscription. Please try again." })
    }
}

/**
 * @name getMySubscription
 * @description returns the logged-in user's current subscription details
 * @access private
 */
async function getMySubscription(req, res) {
    const user = await userModel.findById(req.user.id)
    res.status(200).json({ subscription: user.subscription })
}

/**
 * @name handleWebhook
 * @description Razorpay's server-to-server callback — the only trusted source
 * for actually activating/cancelling a user's Pro plan. The request body must
 * arrive as a raw buffer (not JSON-parsed) for the signature check to work.
 * @access public (verified via signature, not auth middleware)
 */
async function handleWebhook(req, res) {
    try {
        const signature = req.headers['x-razorpay-signature']
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(req.body)
            .digest('hex')

        if (signature !== expectedSignature) {
            return res.status(400).json({ message: "Invalid signature" })
        }

        const event = JSON.parse(req.body)

        if (event.event === 'subscription.charged') {
            const subEntity = event.payload.subscription.entity
            const user = await userModel.findOne({ 'subscription.razorpaySubscriptionId': subEntity.id })
            if (user) {
                user.subscription.plan = 'pro'
                user.subscription.status = 'active'
                user.subscription.currentPeriodEnd = new Date(subEntity.current_end * 1000)
                await user.save()
            }
        }

        if (event.event === 'subscription.cancelled' || event.event === 'subscription.completed') {
            const subEntity = event.payload.subscription.entity
            const user = await userModel.findOne({ 'subscription.razorpaySubscriptionId': subEntity.id })
            if (user) {
                user.subscription.plan = 'free'
                user.subscription.status = 'cancelled'
                await user.save()
            }
        }

        res.status(200).json({ status: 'ok' })
    } catch (err) {
        console.error("Webhook handling failed:", err.message)
        res.status(500).json({ status: 'error' })
    }
}

module.exports = { createSubscription, getMySubscription, handleWebhook }