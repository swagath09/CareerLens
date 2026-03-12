/**
 * CareerLens AI - Resume Analysis Engine
 * Performs ATS-style evaluation, skill extraction, gap detection, and scoring.
 */

// ─── Skill Library ──────────────────────────────────────────────────────────

const SKILL_CATEGORIES = {
  programming: [
    'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'ruby', 'go', 'rust',
    'kotlin', 'swift', 'php', 'scala', 'r', 'matlab', 'dart', 'bash', 'shell',
  ],
  web: [
    'html', 'css', 'react', 'angular', 'vue', 'next.js', 'node.js', 'express',
    'django', 'flask', 'spring', 'laravel', 'tailwind', 'bootstrap', 'graphql',
    'rest api', 'restful', 'webpack', 'vite',
  ],
  data: [
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'dynamodb',
    'elasticsearch', 'cassandra', 'sqlite', 'oracle', 'nosql',
  ],
  cloud: [
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform',
    'ci/cd', 'jenkins', 'github actions', 'heroku', 'netlify', 'vercel',
  ],
  ai_ml: [
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow',
    'pytorch', 'scikit-learn', 'keras', 'pandas', 'numpy', 'data science',
    'neural network', 'llm', 'openai', 'langchain',
  ],
  tools: [
    'git', 'github', 'jira', 'confluence', 'linux', 'unix', 'agile', 'scrum',
    'figma', 'postman', 'vs code', 'intellij', 'xcode',
  ],
  soft_skills: [
    'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'collaboration', 'adaptability', 'creativity', 'project management',
  ],
};

// Role-based expected skill sets
const ROLE_SKILL_REQUIREMENTS = {
  'software engineer': {
    required: ['git', 'data structures', 'algorithms', 'rest api'],
    preferred: ['docker', 'ci/cd', 'testing', 'agile'],
    languages: ['javascript', 'python', 'java', 'typescript'],
  },
  'frontend developer': {
    required: ['html', 'css', 'javascript', 'react'],
    preferred: ['typescript', 'testing', 'webpack', 'figma'],
    languages: ['javascript', 'typescript'],
  },
  'backend developer': {
    required: ['rest api', 'sql', 'authentication', 'git'],
    preferred: ['docker', 'ci/cd', 'caching', 'message queues'],
    languages: ['python', 'java', 'node.js', 'go'],
  },
  'data scientist': {
    required: ['python', 'machine learning', 'statistics', 'sql'],
    preferred: ['tensorflow', 'pytorch', 'data visualization', 'big data'],
    languages: ['python', 'r', 'scala'],
  },
  'devops engineer': {
    required: ['docker', 'kubernetes', 'ci/cd', 'linux'],
    preferred: ['terraform', 'ansible', 'monitoring', 'cloud'],
    languages: ['bash', 'python', 'yaml'],
  },
};

// ─── ATS Keywords ───────────────────────────────────────────────────────────

const ATS_KEYWORDS = {
  impact: ['achieved', 'improved', 'reduced', 'increased', 'delivered', 'built', 'launched',
           'optimized', 'saved', 'generated', 'led', 'managed', 'designed', 'developed',
           'implemented', 'automated', 'streamlined'],
  metrics: ['%', 'percent', 'million', 'thousand', 'k users', 'x faster', 'revenue'],
  sections: ['experience', 'education', 'skills', 'projects', 'summary', 'objective',
             'certifications', 'achievements', 'work experience'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizeText = (text) => text.toLowerCase().replace(/[^\w\s.]/g, ' ');

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

const hasQuantifiedMetrics = (text) =>
  ATS_KEYWORDS.metrics.some((m) => text.toLowerCase().includes(m));

const detectSections = (text) => {
  const lower = normalizeText(text);
  return ATS_KEYWORDS.sections.filter((section) => lower.includes(section));
};

// ─── Core Analysis Functions ─────────────────────────────────────────────────

/**
 * Extracts skills found in the resume text.
 */
const extractSkills = (text) => {
  const lower = normalizeText(text);
  const found = {};

  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    found[category] = skills.filter((skill) => lower.includes(skill.toLowerCase()));
  }

  return found;
};

/**
 * Detects skill gaps based on target role.
 */
const detectSkillGaps = (foundSkills, targetRole) => {
  const allFound = Object.values(foundSkills).flat().map((s) => s.toLowerCase());
  const roleKey = Object.keys(ROLE_SKILL_REQUIREMENTS).find((r) =>
    targetRole?.toLowerCase().includes(r)
  );

  if (!roleKey) return { missingRequired: [], missingPreferred: [], targetRole: null };

  const requirements = ROLE_SKILL_REQUIREMENTS[roleKey];

  const missingRequired = requirements.required.filter(
    (skill) => !allFound.some((f) => f.includes(skill.toLowerCase()))
  );
  const missingPreferred = requirements.preferred.filter(
    (skill) => !allFound.some((f) => f.includes(skill.toLowerCase()))
  );

  return { missingRequired, missingPreferred, targetRole: roleKey };
};

/**
 * ATS scoring: evaluates resume structure, keywords, and content quality.
 */
const calculateATSScore = (text, foundSkills, sections) => {
  let score = 0;
  const breakdown = {};

  // 1. Section completeness (25 pts)
  const sectionScore = Math.min(25, sections.length * 4);
  breakdown.sections = { score: sectionScore, max: 25, found: sections };
  score += sectionScore;

  // 2. Skills breadth (25 pts)
  const totalSkills = Object.values(foundSkills).flat().length;
  const skillScore = Math.min(25, totalSkills * 2);
  breakdown.skills = { score: skillScore, max: 25, totalFound: totalSkills };
  score += skillScore;

  // 3. Action verbs / impact keywords (20 pts)
  const lower = text.toLowerCase();
  const impactWordsFound = ATS_KEYWORDS.impact.filter((w) => lower.includes(w));
  const impactScore = Math.min(20, impactWordsFound.length * 2);
  breakdown.impact = { score: impactScore, max: 20, keywords: impactWordsFound.slice(0, 10) };
  score += impactScore;

  // 4. Quantified achievements (15 pts)
  const hasMetrics = hasQuantifiedMetrics(text);
  const metricsScore = hasMetrics ? 15 : 0;
  breakdown.metrics = { score: metricsScore, max: 15, hasQuantifiedAchievements: hasMetrics };
  score += metricsScore;

  // 5. Content length / detail (15 pts)
  const wordCount = countWords(text);
  const lengthScore = wordCount < 200 ? 5 : wordCount < 400 ? 10 : 15;
  breakdown.length = { score: lengthScore, max: 15, wordCount };
  score += lengthScore;

  return { total: score, max: 100, grade: getGrade(score), breakdown };
};

const getGrade = (score) => {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
};

/**
 * Generates actionable improvement suggestions.
 */
const generateInsights = (text, foundSkills, skillGaps, atsScore, sections) => {
  const suggestions = [];
  const strengths = [];

  // Strengths
  if (atsScore.breakdown.impact.keywords.length >= 5) {
    strengths.push('Good use of action verbs to describe experience');
  }
  if (atsScore.breakdown.metrics.hasQuantifiedAchievements) {
    strengths.push('Resume includes quantified achievements — this stands out to recruiters');
  }
  if (Object.values(foundSkills).flat().length >= 10) {
    strengths.push('Strong technical skill set with broad coverage');
  }
  if (sections.length >= 4) {
    strengths.push('Well-structured resume with key sections present');
  }

  // Suggestions based on score breakdown
  if (atsScore.breakdown.sections.score < 16) {
    const missing = ATS_KEYWORDS.sections.filter((s) => !sections.includes(s));
    suggestions.push(`Add missing resume sections: ${missing.slice(0, 3).join(', ')}`);
  }
  if (!atsScore.breakdown.metrics.hasQuantifiedAchievements) {
    suggestions.push('Add quantified achievements (e.g., "Reduced load time by 40%" or "Served 10K users")');
  }
  if (atsScore.breakdown.impact.score < 10) {
    suggestions.push('Use more action verbs: achieved, built, led, optimized, delivered, improved');
  }
  if (atsScore.breakdown.length.wordCount < 300) {
    suggestions.push('Resume seems brief. Expand experience descriptions with more detail');
  }
  if (skillGaps.missingRequired?.length > 0) {
    suggestions.push(
      `For ${skillGaps.targetRole} roles, consider adding: ${skillGaps.missingRequired.join(', ')}`
    );
  }
  if (skillGaps.missingPreferred?.length > 0) {
    suggestions.push(
      `Bonus skills that would strengthen your profile: ${skillGaps.missingPreferred.join(', ')}`
    );
  }
  if (!text.toLowerCase().includes('github') && !text.toLowerCase().includes('portfolio')) {
    suggestions.push('Include links to GitHub, portfolio, or live projects');
  }

  return { strengths, suggestions };
};

// ─── Main Analyzer ────────────────────────────────────────────────────────────

/**
 * Full resume analysis pipeline.
 */
const analyzeResume = (text, targetRole = '') => {
  const sections = detectSections(text);
  const foundSkills = extractSkills(text);
  const skillGaps = detectSkillGaps(foundSkills, targetRole);
  const atsScore = calculateATSScore(text, foundSkills, sections);
  const { strengths, suggestions } = generateInsights(text, foundSkills, skillGaps, atsScore, sections);

  return {
    atsScore,
    sections,
    foundSkills,
    skillGaps,
    strengths,
    suggestions,
    wordCount: countWords(text),
    targetRole: skillGaps.targetRole || targetRole || null,
    analyzedAt: new Date().toISOString(),
  };
};

module.exports = { analyzeResume };
