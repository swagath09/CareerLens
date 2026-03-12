const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  runAnalysis,
  analyzeUpload,
  getAnalysisById,
  getAnalysesForResume,
  getAllUserAnalyses,
} = require('../controllers/analysisController');

// POST /api/analyses/analyze-upload - Upload & analyze in one step (most common)
router.post('/analyze-upload', verifyToken, upload.single('resume'), analyzeUpload);

// POST /api/analyses/analyze/:resumeId - Analyze an already-uploaded resume
router.post('/analyze/:resumeId', verifyToken, runAnalysis);

// GET /api/analyses - Get all analyses for current user
router.get('/', verifyToken, getAllUserAnalyses);

// GET /api/analyses/resume/:resumeId - Get all analyses for a specific resume
router.get('/resume/:resumeId', verifyToken, getAnalysesForResume);

// GET /api/analyses/:analysisId - Get a specific analysis
router.get('/:analysisId', verifyToken, getAnalysisById);

module.exports = router;
