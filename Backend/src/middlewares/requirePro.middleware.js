/**
 * @name requirePro
 * @description blocks access to a route unless the logged-in user has an active Pro subscription
 */
module.exports = (req, res, next) => {
    if (req.user?.subscription?.plan !== 'pro') {
        return res.status(403).json({
            message: "This feature requires a Pro subscription."
        })
    }
    next()
}