const express = require("express");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

/* ---------------- MOCK AI ONLY (NO FILE PARSING) ---------------- */

async function analyzeWithAI() {
  console.log("Mock AI analyzing resume...");

  return {
    ats_score: 72,
    detected_skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    strengths: [
      "Good frontend development knowledge",
      "Relevant modern technologies detected",
      "Resume structure looks clean"
    ],
    weaknesses: [
      "No SQL skills detected",
      "No backend technologies mentioned",
      "Projects lack measurable metrics"
    ]
  };
}

/* ---------------- API ROUTE ---------------- */

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ⭐ SKIP ALL PDF/DOCX PROCESSING
    const analysis = await analyzeWithAI();

    res.json(analysis);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

/* ---------------- SERVER ---------------- */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});