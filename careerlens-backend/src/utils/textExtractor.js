const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw text from a resume file buffer.
 * Supports PDF and DOCX.
 */
const extractText = async (buffer, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    }

    if (
      mimetype === 'application/msword' ||
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    throw new Error('Unsupported file type for text extraction');
  } catch (error) {
    throw new Error(`Text extraction failed: ${error.message}`);
  }
};

module.exports = { extractText };
