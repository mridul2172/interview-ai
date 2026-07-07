const rateLimit = require("express-rate-limit")
const { ipKeyGenerator } = require("express-rate-limit")

const aiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5, // 5 requests per user per day
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
    message: {
        message: "Daily limit reached for AI report generation. Try again tomorrow."
    }
})

module.exports = { aiLimiter }