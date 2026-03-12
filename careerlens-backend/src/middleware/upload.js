const multer = require('multer');

const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '5');

const storage = multer.memoryStorage(); // store file in memory (no disk writes)

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents (.pdf, .doc, .docx) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024,
  },
});

module.exports = upload;
