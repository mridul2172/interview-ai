const mongoose = require("mongoose")

const verificationTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    type: {
        type: String,
        enum: [ "emailVerification", "passwordReset" ],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const verificationTokenModel = mongoose.model("VerificationToken", verificationTokenSchema)

module.exports = verificationTokenModel
