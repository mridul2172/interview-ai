const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


/**
 * Defines the shape of the AI-generated interview report.
 * Used as the responseSchema for Gemini so it returns structured JSON
 * instead of free-form text that we'd have to parse manually.
 */
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

/**
 * Generates a full interview-prep report (match score, likely questions,
 * skill gaps, and a day-wise prep plan) by feeding the candidate's resume,
 * self description, and target job description to Gemini.
 *
 * @param {Object} params
 * @param {string} params.resume - Candidate's resume text
 * @param {string} params.selfDescription - Candidate's own summary of themselves
 * @param {string} params.jobDescription - The job they're preparing for
 * @returns {Promise<Object>} Parsed report matching interviewReportSchema
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })
    console.log('RAW AI RESPONSE:', response.text)
    return JSON.parse(response.text)


}


/**
 * Converts a raw HTML string into a PDF buffer using a headless browser.
 * Kept generic (takes plain HTML) so it can be reused for anything that
 * needs HTML-to-PDF conversion, not just resumes.
 *
 * @param {string} htmlContent - Fully-formed HTML to render into the PDF
 * @returns {Promise<Buffer>} The generated PDF as a buffer
 */
async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

/**
 * Generates a tailored, ATS-friendly resume for the candidate based on their
 * existing resume, self description, and the target job description, then
 * renders it straight to a PDF buffer.
 *
 * The AI is asked to return HTML (not the PDF itself) so we control the
 * PDF rendering step ourselves via generatePdfFromHtml.
 *
 * @param {Object} params
 * @param {string} params.resume - Candidate's existing resume text
 * @param {string} params.selfDescription - Candidate's own summary of themselves
 * @param {string} params.jobDescription - Job the resume should be tailored for
 * @returns {Promise<Buffer>} The generated resume as a PDF buffer
 */
async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}


/**
 * Regenerates a single section of an existing interview report (e.g. just
 * the skillGaps or just the preparationPlan) instead of regenerating the
 * whole report — used when the user wants a fresh variation of one part
 * without redoing everything.
 *
 * @param {Object} params
 * @param {string} params.resume - Candidate's resume text
 * @param {string} params.selfDescription - Candidate's own summary of themselves
 * @param {string} params.jobDescription - The job they're preparing for
 * @param {"technicalQuestions"|"behavioralQuestions"|"skillGaps"|"preparationPlan"} params.section
 *        Name of the report section to regenerate
 * @returns {Promise<*>} The regenerated section, shaped according to its schema
 * @throws {Error} If an unsupported section name is passed
 */
async function regenerateSection({ resume, selfDescription, jobDescription, section }) {

    // Only these sections have a matching schema — matchScore and title
    // aren't meant to be regenerated individually.
    const sectionSchemas = {
        technicalQuestions: z.array(z.object({
            question: z.string().describe("The technical question can be asked in the interview"),
            intention: z.string().describe("The intention of interviewer behind asking this question"),
            answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
        })),
        behavioralQuestions: z.array(z.object({
            question: z.string().describe("The behavioral question can be asked in the interview"),
            intention: z.string().describe("The intention of interviewer behind asking this question"),
            answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
        })),
        skillGaps: z.array(z.object({
            skill: z.string().describe("The skill which the candidate is lacking"),
            severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap")
        })),
        preparationPlan: z.array(z.object({
            day: z.number().describe("The day number in the preparation plan, starting from 1"),
            focus: z.string().describe("The main focus of this day in the preparation plan"),
            tasks: z.array(z.string()).describe("List of tasks to be done on this day")
        }))
    }

    const schema = sectionSchemas[ section ]

    if (!schema) {
        throw new Error("Invalid section name")
    }

    // Explicitly told to give a "fresh, different variation" so the model
    // doesn't just repeat the same content it gave the first time around.
    const prompt = `Based on the following candidate details, regenerate ONLY the "${section}" for their interview report — provide a fresh, different variation than before:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // Wrap the single section schema under its own key so the model's
            // JSON response matches { [section]: [...] } exactly.
            responseSchema: zodToJsonSchema(z.object({ [ section ]: schema })),
        }
    })

    return JSON.parse(response.text)[ section ]

}



module.exports = { generateInterviewReport, generateResumePdf, regenerateSection }