const { analyzeResume } = require('../services/analysisEngine');
const { getResume, saveAnalysis, getAnalysis, getResumeAnalyses, getUserAnalyses } = require('../services/firestoreService');

/**
 * POST /api/analyses/analyze/:resumeId
 * Runs ATS analysis on a saved resume.
 * Body: { targetRole?: string }
 */
const runAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { targetRole = '' } = req.body;

    // Fetch the resume
    const resume = await getResume(resumeId, req.user.uid);
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    // Run analysis engine
    const result = analyzeResume(resume.extractedText, targetRole);

    // Persist result to Firestore
    const saved = await saveAnalysis(req.user.uid, resumeId, result);

    res.status(201).json({
      success: true,
      message: 'Analysis complete',
      analysis: saved,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/analyses/analyze-upload
 * Upload + analyze in one step (no separate resume save).
 * Accepts multipart/form-data with file + optional targetRole.
 */
const analyzeUpload = async (req, res) => {
  const { extractText } = require('../utils/textExtractor');
  const { saveResume } = require('../services/firestoreService');

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { buffer, mimetype, originalname, size } = req.file;
    const targetRole = req.body.targetRole || '';

    // Extract text
    const extractedText = await extractText(buffer, mimetype);
    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract enough text. Ensure the file is not a scanned image.',
      });
    }

    // Save resume
    const resumeId = await saveResume(req.user.uid, {
      filename: originalname,
      mimetype,
      extractedText,
      fileSize: size,
    });

    // Analyze
    const result = analyzeResume(extractedText, targetRole);
    const saved = await saveAnalysis(req.user.uid, resumeId, result);

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      resumeId,
      analysis: saved,
    });
  } catch (error) {
    console.error('Analyze-upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/analyses/:analysisId
 * Returns a specific analysis result.
 */
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await getAnalysis(req.params.analysisId, req.user.uid);
    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found' });
    }
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/analyses/resume/:resumeId
 * Returns all analyses for a specific resume.
 */
const getAnalysesForResume = async (req, res) => {
  try {
    const analyses = await getResumeAnalyses(req.params.resumeId, req.user.uid);
    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/analyses
 * Returns all analyses for the logged-in user.
 */
const getAllUserAnalyses = async (req, res) => {
  try {
    const analyses = await getUserAnalyses(req.user.uid);
    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  runAnalysis,
  analyzeUpload,
  getAnalysisById,
  getAnalysesForResume,
  getAllUserAnalyses,
};
