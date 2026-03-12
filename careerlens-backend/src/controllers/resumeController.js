const { extractText } = require('../utils/textExtractor');
const { saveResume, getResume, getUserResumes, deleteResume } = require('../services/firestoreService');

/**
 * POST /api/resumes/upload
 * Accepts a PDF or DOCX file, extracts text, saves to Firestore.
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { buffer, mimetype, originalname, size } = req.file;

    // Extract raw text
    const extractedText = await extractText(buffer, mimetype);

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract enough text from the resume. Please ensure the file is not scanned/image-only.',
      });
    }

    // Save to Firestore
    const resumeId = await saveResume(req.user.uid, {
      filename: originalname,
      mimetype,
      extractedText,
      fileSize: size,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeId,
      filename: originalname,
      wordCount: extractedText.trim().split(/\s+/).length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/resumes
 * Returns list of user's uploaded resumes (no full text).
 */
const listResumes = async (req, res) => {
  try {
    const resumes = await getUserResumes(req.user.uid);
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/resumes/:resumeId
 * Returns a specific resume (owned by the user).
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await getResume(req.params.resumeId, req.user.uid);
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }
    // Don't expose full extracted text
    const { extractedText, ...resumeData } = resume;
    res.json({ success: true, resume: resumeData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/resumes/:resumeId
 * Deletes a resume and its analyses.
 */
const deleteResumeById = async (req, res) => {
  try {
    const deleted = await deleteResume(req.params.resumeId, req.user.uid);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Resume not found or not owned by you' });
    }
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { uploadResume, listResumes, getResumeById, deleteResumeById };
