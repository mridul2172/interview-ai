const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const subscriptionRoutes = require('./routes/subscription.routes')

// Webhook needs the raw body for signature verification — this MUST be
// registered before express.json(), otherwise the body will already be
// parsed into an object and the signature check will fail.
app.use("/api/subscription/webhook", express.raw({ type: "application/json" }))

app.use(express.json())
app.use(cookieParser())

// credentials: true is needed so cookies (auth token) actually get sent/received
// cross-origin — keep FRONTEND_URL in env so prod origin isn't hardcoded here
app.use(cors({
    origin: [ "http://localhost:5173", process.env.FRONTEND_URL ],
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const contactRouter = require("./routes/contact.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/contact", contactRouter)
app.use('/api/subscription', subscriptionRoutes)

module.exports = app