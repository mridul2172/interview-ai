import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export async function createSubscription() {
    try {
        const response = await api.post('/api/subscription/create-subscription')
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }
}