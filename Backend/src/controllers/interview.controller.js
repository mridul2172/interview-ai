const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, regenerateSection } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @name generateInterViewReportController
 * @description parses the uploaded resume PDF, sends it along with the job description and self
 * description to the AI service, and persists the generated report against the logged-in user
 * @access private
 */
async function generateInterViewReportController(req, res) {

    // multer gives us the file as an in-memory buffer, PDFParse needs a Uint8Array to extract text from it
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @name getInterviewReportByIdController
 * @description fetches a single interview report, scoped to the logged-in user so one user can never read another user's report by guessing an id
 * @access private
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/**
 * @name getAllInterviewReportsController
 * @description returns a lightweight list of all reports belonging to the logged-in user, newest first
 * @access private
 */
async function getAllInterviewReportsController(req, res) {
    // Excluding the heavy fields here since this powers the reports list view —
    // full question/answer content is only needed when a single report is opened
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @name generateResumePdfController
 * @description generates an AI-tailored resume as a PDF for a given interview report and streams it back as a downloadable file
 * @access private
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}


/**
 * @name regenerateSectionController
 * @description regenerates a single section (technical questions, behavioral questions, skill gaps, or the prep roadmap) of an existing report without touching the rest of it
 * @access private
 */
async function regenerateSectionController(req, res) {

    const { interviewId } = req.params
    const { section } = req.body

    const allowedSections = [ "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan" ]

    if (!allowedSections.includes(section)) {
        return res.status(400).json({
            message: "Invalid section. Allowed sections: " + allowedSections.join(", ")
        })
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const newSectionData = await regenerateSection({
        resume: interviewReport.resume,
        selfDescription: interviewReport.selfDescription,
        jobDescription: interviewReport.jobDescription,
        section
    })

    interviewReport[ section ] = newSectionData
    await interviewReport.save()

    res.status(200).json({
        message: "Section regenerated successfully.",
        [ section ]: newSectionData
    })

}


module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, regenerateSectionController }