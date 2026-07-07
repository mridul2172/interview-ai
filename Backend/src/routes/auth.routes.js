const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()

/**
 * @route POST /api/auth/send-otp
 * @description sends a 6-digit verification code to the given email before registration
 * @access Public
 */
authRouter.post("/send-otp", authController.sendOtpController)

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)


/**
 * @route POST /api/auth/refresh
 * @description issues a new access token using a valid refresh token
 * @access Public
 */
authRouter.post("/refresh", authController.refreshTokenController)


/**
 * @route POST /api/auth/forgot-password
 * @description sends a password reset link to the user's email
 * @access Public
 */
authRouter.post("/forgot-password", authController.forgotPasswordController)


/**
 * @route POST /api/auth/reset-password
 * @description resets a user's password using a valid reset token
 * @access Public
 */
authRouter.post("/reset-password", authController.resetPasswordController)


/**
 * @route POST /api/auth/change-password
 * @description changes password for the currently logged-in user
 * @access private
 */
authRouter.post("/change-password", authMiddleware.authUser, authController.changePasswordController)

/**
 * @route PATCH /api/auth/update-profile
 * @description updates the username of the currently logged-in user
 * @access private
 */
authRouter.patch("/update-profile", authMiddleware.authUser, authController.updateProfileController)

/**
 * @route PATCH /api/auth/change-email
 * @description changes the email of the currently logged-in user after OTP verification
 * @access private
 */
authRouter.patch("/change-email", authMiddleware.authUser, authController.changeEmailController)

/**
 * @route DELETE /api/auth/delete-account
 * @description permanently deletes the currently logged-in user's account
 * @access private
 */
authRouter.delete("/delete-account", authMiddleware.authUser, authController.deleteAccountController)


/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


module.exports = authRouter