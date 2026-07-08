import axios from "axios"


// withCredentials so the auth cookie (session/JWT) is sent with every request
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export async function sendOtp(email) {

    try {
        const response = await api.post('/api/auth/send-otp', { email })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}

export async function register({ username, email, password, otp }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password, otp
        })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}

export async function login({ email, password }) {

    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }
}

// Unlike the other calls, errors here are swallowed instead of thrown —
// this runs on app load to silently check for an existing session, so a
// failure just means "not logged in", not something that should bubble up as an error
export async function getMe() {

    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (err) {
        console.log(err)
    }

}

export async function forgotPassword(email) {

    try {
        const response = await api.post('/api/auth/forgot-password', { email })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}

export async function changePassword({ currentPassword, newPassword }) {

    try {
        const response = await api.post('/api/auth/change-password', { currentPassword, newPassword })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}

export async function updateProfile(username) {

    try {
        const response = await api.patch('/api/auth/update-profile', { username })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}

export async function changeEmail({ newEmail, otp }) {

    try {
        const response = await api.patch('/api/auth/change-email', { newEmail, otp })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}

export async function deleteAccount(password) {

    try {
        const response = await api.delete('/api/auth/delete-account', { data: { password } })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}

export async function resetPassword({ token, newPassword }) {

    try {
        const response = await api.post('/api/auth/reset-password', { token, newPassword })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}