import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import LoadingScreen from '../../../components/LoadingScreen'
import { Link } from 'react-router'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ALLOWED_EXTENSIONS = ['.pdf', '.docx']

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const Home = () => {

    const { loading, error: hookError, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ uploadProgress, setUploadProgress ] = useState(0)
    const [ isUploading, setIsUploading ] = useState(false)
    const [ fileError, setFileError ] = useState("")
    const [ isGenerating, setIsGenerating ] = useState(false)
    const [ generateError, setGenerateError ] = useState("")
    const resumeInputRef = useRef()
    const progressIntervalRef = useRef()

    const navigate = useNavigate()

    // At least a job description plus either a resume or a self-description is required
    const canGenerate = jobDescription.trim().length > 0 && (selectedFile || selfDescription.trim().length > 0)

    // Fake progress bar animation for the file upload — the actual file read
    // is instant client-side, this is purely to give the user visual feedback
    // that something is happening before they hit "Generate"
    const simulateUploadProgress = () => {
        setUploadProgress(0)
        setIsUploading(true)
        clearInterval(progressIntervalRef.current)

        progressIntervalRef.current = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressIntervalRef.current)
                    setIsUploading(false)
                    return 100
                }
                return prev + 10
            })
        }, 80)
    }

    // Checks extension AND mime type (when available) since some browsers/OSes
    // don't reliably set file.type for .docx uploads
    const validateFile = (file) => {
        const nameLower = file.name.toLowerCase()
        const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => nameLower.endsWith(ext))

        if (!hasValidExtension || (file.type && !ALLOWED_TYPES.includes(file.type))) {
            return "Only PDF or DOCX files are allowed."
        }
        if (file.size > MAX_FILE_SIZE) {
            return `File is too large (${formatFileSize(file.size)}). Max size is 5MB.`
        }
        return ""
    }

    const handleFileChange = (e) => {
        const file = e.target.files[ 0 ]
        if (!file) return

        const error = validateFile(file)
        if (error) {
            setFileError(error)
            setSelectedFile(null)
            if (resumeInputRef.current) resumeInputRef.current.value = ""
            return
        }

        setFileError("")
        setSelectedFile(file)
        simulateUploadProgress()
    }

    const handleRemoveFile = () => {
        clearInterval(progressIntervalRef.current)
        setSelectedFile(null)
        setUploadProgress(0)
        setIsUploading(false)
        setFileError("")
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleReplaceFile = () => {
        resumeInputRef.current.click()
    }

    const handleGenerateReport = async () => {
        if (!canGenerate || isGenerating) return

        setGenerateError("")
        setIsGenerating(true)

        const resumeFile = resumeInputRef.current.files[ 0 ]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })

        if (data) {
            navigate(`/interview/${data._id}`)
        } else {
            setGenerateError(hookError || "Something went wrong while generating your plan. Please try again.")
        }

        setIsGenerating(false)
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className='home-page'>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>

                            <input
                                ref={resumeInputRef}
                                hidden
                                type='file'
                                id='resume'
                                name='resume'
                                accept='.pdf,.docx'
                                onChange={handleFileChange}
                            />

                            {!selectedFile ? (
                                <label className='dropzone' htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                    <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                </label>
                            ) : (
                                <div className='file-confirmation'>
                                    <div className='file-confirmation__row'>
                                        <span className='file-confirmation__icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        </span>

                                        <div className='file-confirmation__info'>
                                            <p className='file-confirmation__name' title={selectedFile.name}>
                                                {selectedFile.name}
                                            </p>
                                            <p className='file-confirmation__size'>
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>

                                        {!isUploading && (
                                            <button
                                                type='button'
                                                className='file-confirmation__remove'
                                                onClick={handleRemoveFile}
                                                aria-label='Remove file'
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        )}
                                    </div>

                                    {isUploading ? (
                                        <div className='upload-progress'>
                                            <div className='upload-progress__bar'>
                                                <div
                                                    className='upload-progress__fill'
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                            <span className='upload-progress__label'>{uploadProgress}%</span>
                                        </div>
                                    ) : (
                                        <div className='file-confirmation__actions'>
                                            <span className='file-confirmation__status'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                Uploaded
                                            </span>
                                            <button
                                                type='button'
                                                className='file-confirmation__replace'
                                                onClick={handleReplaceFile}
                                            >
                                                Replace
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {fileError && (
                                <p className='field-error'>{fileError}</p>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <div className='footer-left'>
                        <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                        {generateError && <p className='field-error'>{generateError}</p>}
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={!canGenerate || isGenerating}
                        className='generate-btn'>
                        {isGenerating ? (
                            <>
                                <span className='spinner' />
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                                Generate My Interview Strategy
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            <section className='recent-reports'>
                <h2>My Recent Interview Plans</h2>

                {reports.length > 0 ? (
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className='empty-state'>
                        <span className='empty-state__icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></svg>
                        </span>
                        <p className='empty-state__title'>No interview plans yet</p>
                        <p className='empty-state__subtitle'>Fill in the job description above and generate your first plan.</p>
                    </div>
                )}
            </section>

           <footer className='page-footer'>
    <Link to='/privacy'>Privacy Policy</Link>
    <Link to='/terms'>Terms of Service</Link>
    <Link to='/contact'>Help Center</Link>
</footer>
        </div>
    )
}

export default Home