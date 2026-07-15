const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already taken" ], // custom error message shown on duplicate key
        required: true,
    },

    email: {
        type: String,
        unique: [ true, "Account already exists with this email address" ],
        required: true,
    },

    // NOTE: expected to be stored as a bcrypt/argon2 hash, never plain text —
    // hashing should happen in a pre-save hook or in the auth service, not here
    password: {
        type: String,
        required: true
    },

    // flips to true once the user confirms their email/OTP
    isVerified: {
        type: Boolean,
        default: false
    },

    // Razorpay-driven subscription state — kept as a sub-document since it's
    // always accessed/updated together and doesn't need its own collection
    subscription: {
        plan: { type: String, enum: [ 'free', 'pro' ], default: 'free' },
        status: { type: String, enum: [ 'created', 'active', 'cancelled', 'past_due' ], default: 'created' },
        razorpaySubscriptionId: { type: String, default: null }, // maps to Razorpay's subscription id for webhook lookups
        currentPeriodEnd: { type: Date, default: null } // used to check access even if a cancellation webhook is delayed
    }
}, {
    timestamps: true // adds createdAt / updatedAt automatically — useful for analytics & debugging
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel