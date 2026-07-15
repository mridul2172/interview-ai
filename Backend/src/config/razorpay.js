const Razorpay = require('razorpay')

/**
 * @name razorpay
 * @description shared Razorpay client instance, initialized once and reused
 * across the app wherever subscription/payment operations are needed
 */
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

module.exports = razorpay