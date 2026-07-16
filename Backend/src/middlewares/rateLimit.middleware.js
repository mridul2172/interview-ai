const rateLimit = require("express-rate-limit")
const { ipKeyGenerator } = require("express-rate-limit")

// Rate limiter for the AI report generation endpoint.
// Free users get a limited number of reports per day; Pro users are exempt.
const aiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // reset window: 24 hours

    max: 4, // free tier gets 4 reports/day — keep in sync with pricing page if this ever changes

    // Prefer logged-in user id as the key so limits follow the account,
    // not the device/network. Fall back to IP for unauthenticated requests
    // (ipKeyGenerator handles IPv6 normalization properly, so don't just use req.ip directly).
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),

    // Pro subscribers skip rate limiting entirely — unlimited reports is the whole
    // point of upgrading, so don't even count their requests against the limiter.
    skip: (req) => req.user?.subscription?.plan === 'pro',

    // Returned when a free user hits the cap — nudge towards upgrade instead of a generic 429
    message: {
        message: "You've used your 4 free reports for today. Upgrade to Pro for unlimited reports."
    }
})

module.exports = { aiLimiter }