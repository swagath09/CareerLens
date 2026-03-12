# CareerLens Backend API 🚀

Node.js + Express + Firebase Firestore backend for CareerLens AI.

---

## 🛠 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Fill in your Firebase Admin SDK credentials (see below).

### 3. Get Firebase Admin SDK credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Project Settings** → **Service Accounts**
3. Click **Generate new private key**
4. Copy values into your `.env` file

### 4. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 📡 API Endpoints

All protected routes require:
```
Authorization: Bearer <Firebase ID Token>
```

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Server health check |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | ✅ | Get/create current user profile |
| GET | `/api/users/profile` | ✅ | Get detailed profile from Firestore |

### Resumes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/resumes/upload` | ✅ | Upload a PDF/DOCX resume |
| GET | `/api/resumes` | ✅ | List all user resumes |
| GET | `/api/resumes/:resumeId` | ✅ | Get a specific resume |
| DELETE | `/api/resumes/:resumeId` | ✅ | Delete a resume + its analyses |

### Analyses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/analyses/analyze-upload` | ✅ | **Upload + Analyze in one step** |
| POST | `/api/analyses/analyze/:resumeId` | ✅ | Analyze an already-uploaded resume |
| GET | `/api/analyses` | ✅ | Get all analyses for current user |
| GET | `/api/analyses/resume/:resumeId` | ✅ | Get analyses for a specific resume |
| GET | `/api/analyses/:analysisId` | ✅ | Get a specific analysis result |

---

## 📤 Request Examples

### Upload & Analyze (recommended flow)
```javascript
const formData = new FormData();
formData.append('resume', file); // PDF or DOCX
formData.append('targetRole', 'software engineer');

const token = await firebase.auth().currentUser.getIdToken();

const res = await fetch('http://localhost:5000/api/analyses/analyze-upload', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
const data = await res.json();
```

### Analyze Existing Resume
```javascript
const res = await fetch(`http://localhost:5000/api/analyses/analyze/${resumeId}`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ targetRole: 'frontend developer' }),
});
```

---

## 📊 Analysis Response Shape

```json
{
  "success": true,
  "analysis": {
    "analysisId": "uuid",
    "resumeId": "uuid",
    "uid": "firebase-uid",
    "atsScore": {
      "total": 78,
      "max": 100,
      "grade": "B",
      "breakdown": {
        "sections": { "score": 20, "max": 25, "found": ["experience", "skills", "education", "projects", "summary"] },
        "skills":   { "score": 22, "max": 25, "totalFound": 11 },
        "impact":   { "score": 16, "max": 20, "keywords": ["built", "improved", "led", "developed"] },
        "metrics":  { "score": 15, "max": 15, "hasQuantifiedAchievements": true },
        "length":   { "score": 15, "max": 15, "wordCount": 520 }
      }
    },
    "sections": ["experience", "education", "skills", "projects"],
    "foundSkills": {
      "programming": ["javascript", "python"],
      "web": ["react", "node.js", "html", "css"],
      "data": ["mongodb", "sql"],
      "cloud": ["aws", "docker"],
      "tools": ["git", "agile"]
    },
    "skillGaps": {
      "targetRole": "software engineer",
      "missingRequired": ["data structures", "rest api"],
      "missingPreferred": ["ci/cd", "testing"]
    },
    "strengths": [
      "Good use of action verbs to describe experience",
      "Strong technical skill set with broad coverage"
    ],
    "suggestions": [
      "Add quantified achievements (e.g., 'Reduced load time by 40%')",
      "For software engineer roles, consider adding: data structures, rest api"
    ],
    "wordCount": 520,
    "targetRole": "software engineer",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

## 🗄 Firestore Collections

```
users/
  {uid}/
    uid, email, name, picture, createdAt, updatedAt, latestResumeId

resumes/
  {resumeId}/
    resumeId, uid, filename, mimetype, fileSize, wordCount,
    extractedText, uploadedAt, latestAnalysisId

analyses/
  {analysisId}/
    analysisId, uid, resumeId, atsScore, sections, foundSkills,
    skillGaps, strengths, suggestions, wordCount, targetRole, createdAt
```

---

## 🧱 Project Structure

```
careerlens-backend/
├── src/
│   ├── index.js               # Express app entry point
│   ├── config/
│   │   └── firebase.js        # Firebase Admin SDK init
│   ├── middleware/
│   │   ├── auth.js            # Token verification
│   │   ├── upload.js          # Multer file upload config
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   ├── users.js
│   │   ├── resumes.js
│   │   └── analyses.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── resumeController.js
│   │   └── analysisController.js
│   ├── services/
│   │   ├── analysisEngine.js  # ATS scoring + skill gap detection
│   │   └── firestoreService.js # All Firestore operations
│   └── utils/
│       └── textExtractor.js   # PDF + DOCX text extraction
├── .env.example
├── .gitignore
└── package.json
```
