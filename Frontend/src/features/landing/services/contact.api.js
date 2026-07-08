import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export async function submitContactForm({ name, email, message }) {

    try {
        const response = await api.post('/api/contact', { name, email, message })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: "Something went wrong" }
    }

}