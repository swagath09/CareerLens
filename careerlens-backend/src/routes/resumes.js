const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadResume,
  listResumes,
  getResumeById,
  deleteResumeById,
} = require('../controllers/resumeController');

// POST /api/resumes/upload - Upload a resume file
router.post('/upload', verifyToken, upload.single('resume'), uploadResume);

// GET /api/resumes - List all resumes for current user
router.get('/', verifyToken, listResumes);

// GET /api/resumes/:resumeId - Get a specific resume
router.get('/:resumeId', verifyToken, getResumeById);

// DELETE /api/resumes/:resumeId - Delete a resume
router.delete('/:resumeId', verifyToken, deleteResumeById);

module.exports = router;
