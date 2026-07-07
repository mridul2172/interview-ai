import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
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