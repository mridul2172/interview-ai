import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, regenerateReportSection } from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


/**
 * Central hook for everything interview-report related: generating a new
 * report, fetching a single report or the full list, downloading the
 * tailored resume PDF, and regenerating individual report sections.
 * Must be used inside an InterviewProvider since it relies on InterviewContext.
 */
export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const [ error, setError ] = useState("")
    // Tracks which specific section (e.g. "skillGaps") is currently being
    // regenerated, so the UI can show a loading state on just that section
    const [ regenerating, setRegenerating ] = useState(null)

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError("")
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (err) {
            // 429 means the AI generation rate limit was hit — show a clearer
            // message than the generic fallback so users know it's not a bug
            if (err.response?.status === 429) {
                setError("Daily limit reached for AI report generation. Please try again tomorrow.")
            } else {
                setError(err.response?.data?.message || "Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError("")
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        setError("")
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }

    // Downloads the generated resume PDF by turning the raw response into a
    // Blob URL and simulating a click on a hidden <a> tag — the standard
    // trick for triggering a file download from an API response
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        setError("")
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (err) {
            if (err.response?.status === 429) {
                setError("Daily limit reached for resume generation. Please try again tomorrow.")
            } else {
                setError(err.response?.data?.message || "Something went wrong.")
            }
        } finally {
            setLoading(false)
        }
    }

    const regenerateSection = async ({ interviewId, section }) => {
        setRegenerating(section)
        setError("")
        try {
            const response = await regenerateReportSection({ interviewId, section })
            // Merge just the regenerated section into the existing report
            // instead of replacing the whole report object
            setReport(prev => ({ ...prev, [ section ]: response[ section ] }))
            return true
        } catch (err) {
            if (err.response?.status === 429) {
                setError("Daily limit reached for AI regeneration. Please try again tomorrow.")
            } else {
                setError(err.response?.data?.message || "Failed to regenerate. Try again.")
            }
            return false
        } finally {
            setRegenerating(null)
        }
    }

    // If a specific interviewId is in the URL, load that one report;
    // otherwise load the full list (e.g. on a "My Reports" page)
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, error, regenerating, report, reports, generateReport, getReportById, getReports, getResumePdf, regenerateSection }

}