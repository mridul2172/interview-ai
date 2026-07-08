const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const tokenBlacklistModel = require("../models/blacklist.model")
const refreshTokenModel = require("../models/refreshToken.model")
const verificationTokenModel = require("../models/verificationToken.model")
const otpModel = require("../models/otp.model")
const { sendVerificationEmail, sendResetPasswordEmail, sendOtpEmail } = require("../services/email.service")

// Frontend and backend live on different domains in production (Vercel + Render),
// so cookies must be marked secure + sameSite: "none" or the browser silently drops them
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
}


/**
 * @name generateAccessToken
 * @description generates a short-lived JWT access token for the given user
 * @param {Object} user - mongoose user document
 * @returns {String} signed JWT access token, valid for 15 minutes
 */
function generateAccessToken(user) {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )
}


/**
 * @name generateRefreshToken
 * @description generates a long-lived JWT refresh token for the given user
 * @param {Object} user - mongoose user document
 * @returns {String} signed JWT refresh token, valid for 7 days
 */
function generateRefreshToken(user) {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
}


/**
 * @name sendOtpController
 * @description generates a 6-digit OTP for the given email and sends it, before the account exists
 * @access Public
 */
async function sendOtpController(req, res) {

    const { email } = req.body

    if (!email) {
        return res.status(400).json({
            message: "Email is required."
        })
    }

    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
        return res.status(400).json({
            message: "Account already exists with this email address."
        })
    }

    const otp = crypto.randomInt(100000, 999999).toString()

    // Clear any OTP previously issued for this email so only the latest code is valid
    await otpModel.deleteMany({ email })

    await otpModel.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    })

    await sendOtpEmail(email, otp)

    res.status(200).json({
        message: "Verification code sent to your email."
    })

}


/**
 * @name registerUserController
 * @description register a new user, expects username, email, password and otp in the request body. OTP must match a previously sent code — account is created already verified.
 * @access Public
 */
async function registerUserController(req, res) {

    const { username, email, password, otp } = req.body

    if (!username || !email || !password || !otp) {
        return res.status(400).json({
            message: "Please provide username, email, password and verification code"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { username }, { email } ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    const storedOtp = await otpModel.findOne({ email, otp })

    if (!storedOtp) {
        return res.status(400).json({
            message: "Invalid verification code."
        })
    }

    if (storedOtp.expiresAt < new Date()) {
        await otpModel.deleteOne({ _id: storedOtp._id })
        return res.status(400).json({
            message: "Verification code has expired. Please request a new one."
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
        isVerified: true
    })

    await otpModel.deleteOne({ _id: storedOtp._id })

    res.status(201).json({
        message: "Registration successful. Please login.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body. Blocks login if email is not verified.
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    if (!user.isVerified) {
        return res.status(403).json({
            message: "Please verify your email before logging in."
        })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    await refreshTokenModel.create({ token: refreshToken, user: user._id })

    res.cookie("token", accessToken, COOKIE_OPTIONS)
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)

    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token
    const refreshToken = req.cookies.refreshToken

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    if (refreshToken) {
        await refreshTokenModel.deleteOne({ token: refreshToken })
    }

    res.clearCookie("token", COOKIE_OPTIONS)
    res.clearCookie("refreshToken", COOKIE_OPTIONS)

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @name refreshTokenController
 * @description issues a new access token using a valid refresh token
 * @access Public
 */
async function refreshTokenController(req, res) {

    const oldRefreshToken = req.cookies.refreshToken

    if (!oldRefreshToken) {
        return res.status(401).json({
            message: "Refresh token not provided."
        })
    }

    const storedToken = await refreshTokenModel.findOne({ token: oldRefreshToken })

    if (!storedToken) {
        return res.status(401).json({
            message: "Invalid refresh token."
        })
    }

    try {
        const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET)

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )

        res.cookie("token", newAccessToken, COOKIE_OPTIONS)

        res.status(200).json({
            message: "Token refreshed successfully."
        })

    } catch (err) {
        // Token exists in DB but failed verification (expired/tampered) — remove it
        // so the client is forced to log in again instead of retrying indefinitely
        await refreshTokenModel.deleteOne({ token: oldRefreshToken })
        return res.status(401).json({
            message: "Refresh token expired, please login again."
        })
    }
}


/**
 * @name forgotPasswordController
 * @description sends a password reset link to the user's email
 * @access Public
 */
async function forgotPasswordController(req, res) {

    const { email } = req.body

    if (!email) {
        return res.status(400).json({
            message: "Email is required."
        })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(200).json({
            message: "If an account with that email exists, a reset link has been sent."
        })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    await verificationTokenModel.create({
        token: resetToken,
        user: user._id,
        type: "passwordReset",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    })

    await sendResetPasswordEmail(user.email, resetToken)

    res.status(200).json({
        message: "If an account with that email exists, a reset link has been sent."
    })
}


/**
 * @name resetPasswordController
 * @description resets a user's password using a valid reset token
 * @access Public
 */
async function resetPasswordController(req, res) {

    const { token, newPassword } = req.body

    if (!token || !newPassword) {
        return res.status(400).json({
            message: "Token and new password are required."
        })
    }

    const storedToken = await verificationTokenModel.findOne({ token, type: "passwordReset" })

    if (!storedToken) {
        return res.status(400).json({
            message: "Invalid or expired reset token."
        })
    }

    if (storedToken.expiresAt < new Date()) {
        await verificationTokenModel.deleteOne({ _id: storedToken._id })
        return res.status(400).json({
            message: "Reset token has expired. Please request a new one."
        })
    }

    const hash = await bcrypt.hash(newPassword, 10)

    await userModel.findByIdAndUpdate(storedToken.user, { password: hash })
    await verificationTokenModel.deleteOne({ _id: storedToken._id })

    res.status(200).json({
        message: "Password reset successfully. Please login with your new password."
    })
}

/**
 * @name changePasswordController
 * @description changes the password of the currently logged-in user
 * @access private
 */
async function changePasswordController(req, res) {

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            message: "Current password and new password are required."
        })
    }

    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({
            message: "User not found."
        })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Current password is incorrect."
        })
    }

    const hash = await bcrypt.hash(newPassword, 10)

    user.password = hash
    await user.save()

    res.status(200).json({
        message: "Password changed successfully."
    })

}


/**
 * @name updateProfileController
 * @description updates the username of the currently logged-in user
 * @access private
 */
async function updateProfileController(req, res) {

    const { username } = req.body

    if (!username) {
        return res.status(400).json({
            message: "Username is required."
        })
    }

    const existingUser = await userModel.findOne({ username, _id: { $ne: req.user.id } })

    if (existingUser) {
        return res.status(400).json({
            message: "This username is already taken."
        })
    }

    const user = await userModel.findByIdAndUpdate(
        req.user.id,
        { username },
        { new: true }
    )

    res.status(200).json({
        message: "Profile updated successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name changeEmailController
 * @description changes the email of the currently logged-in user after verifying a 6-digit OTP sent to the new email
 * @access private
 */
async function changeEmailController(req, res) {

    const { newEmail, otp } = req.body

    if (!newEmail || !otp) {
        return res.status(400).json({
            message: "New email and verification code are required."
        })
    }

    const existingUser = await userModel.findOne({ email: newEmail })

    if (existingUser) {
        return res.status(400).json({
            message: "This email is already in use."
        })
    }

    const storedOtp = await otpModel.findOne({ email: newEmail, otp })

    if (!storedOtp) {
        return res.status(400).json({
            message: "Invalid verification code."
        })
    }

    if (storedOtp.expiresAt < new Date()) {
        await otpModel.deleteOne({ _id: storedOtp._id })
        return res.status(400).json({
            message: "Verification code has expired. Please request a new one."
        })
    }

    const user = await userModel.findByIdAndUpdate(
        req.user.id,
        { email: newEmail },
        { new: true }
    )

    await otpModel.deleteOne({ _id: storedOtp._id })

    res.status(200).json({
        message: "Email updated successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name deleteAccountController
 * @description permanently deletes the currently logged-in user's account, requires password confirmation
 * @access private
 */
async function deleteAccountController(req, res) {

    const { password } = req.body

    if (!password) {
        return res.status(400).json({
            message: "Password is required to delete your account."
        })
    }

    const user = await userModel.findById(req.user.id)

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Incorrect password."
        })
    }

    const token = req.cookies.token
    const refreshToken = req.cookies.refreshToken

    // Blacklist the current session token immediately, then remove all refresh
    // tokens for this user so no other logged-in device can silently obtain a new one
    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    await refreshTokenModel.deleteMany({ user: user._id })
    await userModel.findByIdAndDelete(user._id)

    res.clearCookie("token", COOKIE_OPTIONS)
    res.clearCookie("refreshToken", COOKIE_OPTIONS)

    res.status(200).json({
        message: "Account deleted successfully."
    })

}


module.exports = {
    sendOtpController,
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    refreshTokenController,
    forgotPasswordController,
    resetPasswordController,
    changePasswordController,
    updateProfileController,
    changeEmailController,
    deleteAccountController
}