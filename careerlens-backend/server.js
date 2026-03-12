const fs = require("fs");
const pdf = require("pdf-parse");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });


app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerLens API is running 🚀"
  });
});


/* ---------------- MOCK AI ONLY (NO FILE PARSING) ---------------- */

async function analyzeWithAI(filePath) {

  const REQUIRED_SKILLS = [
    "html",
    "css",
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "sql",
    "git",
    "github",
    "rest api",
    "json",
    "bootstrap",
    "tailwind",
    "typescript",
    "docker",
    "aws"
  ];

  const RESUME_KEYWORDS = [
    "education",
    "experience",
    "skills",
    "projects",
    "internship",
    "objective"
  ];

  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);

  const text = data.text.toLowerCase();

  const isResume = RESUME_KEYWORDS.some(word => text.includes(word));

  if (!isResume) {
    throw new Error("Uploaded file does not appear to be a resume.");
  }

  const detected_skills = REQUIRED_SKILLS.filter(skill =>
    text.includes(skill)
  );

  const missing_skills = REQUIRED_SKILLS.filter(
    skill => !detected_skills.includes(skill)
  );

  const ats_score = Math.round(
    (detected_skills.length / REQUIRED_SKILLS.length) * 100
  );

  return {
    ats_score,
    detected_skills,
    missing_skills
  };
}

/* ---------------- API ROUTE ---------------- */

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.file.mimetype.includes("pdf")) {
      return res.status(400).json({
        error: "Only PDF resumes are supported"
      });
    }

    const analysis = await analyzeWithAI(req.file.path);

    fs.unlinkSync(req.file.path);

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