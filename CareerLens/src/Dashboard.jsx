import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const REQUIRED_SKILLS = [
  "html",
  "css",
  "javascript",
  "react",
  "git",
  "api",
  "sql"
];

function calculateATS(resumeText) {
  if (!resumeText) {
    return {
      ats: 0,
      matched: [],
      missing: REQUIRED_SKILLS
    };
  }

  const text = resumeText.toLowerCase();

  const matched = REQUIRED_SKILLS.filter(skill =>
    text.includes(skill)
  );

  const missing = REQUIRED_SKILLS.filter(
    skill => !matched.includes(skill)
  );

  const ats = Math.round(
    (matched.length / REQUIRED_SKILLS.length) * 100
  );

  return { ats, matched, missing };
}

function getTodayDate() {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/"); // ⬅️ FORCE redirect to Home if logged out
    } else if (user.displayName) {
      setUserName(user.displayName);
    }
  });

  return () => unsubscribe();
}, [navigate]);



  const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

  return (
  <>
    <div className="layout">

      {/* MOBILE TOP BAR */}
      <div className="mobile-topbar">
        <span
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </span>
        <span className="logo">CareerLens</span>
      </div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="logo">CareerLens</div>

          <nav className="menu">
            <button
              className={`menu-item ${active === "dashboard" ? "active" : ""}`}
              onClick={() => {
                setActive("dashboard");
                setMenuOpen(false);
              }}
            >
              Dashboard
            </button>

            <button
              className={`menu-item ${active === "resume" ? "active" : ""}`}
              onClick={() => {
                setActive("resume");
                setMenuOpen(false);
              }}
            >
              Resume Analyzer
            </button>

            <button
              className={`menu-item ${active === "skills" ? "active" : ""}`}
              onClick={() => {
                setActive("skills");
                setMenuOpen(false);
              }}
            >
              Skill Insights
            </button>

            <button
              className={`menu-item ${active === "analytics" ? "active" : ""}`}
              onClick={() => {
                setActive("analytics");
                setMenuOpen(false);
              }}
            >
              Analytics
            </button>

            <button
              className={`menu-item ${active === "ai" ? "active" : ""}`}
              onClick={() => {
                setActive("ai");
                setMenuOpen(false);
              }}
            >
              AI Assistant
            </button>

            <button
              className={`menu-item ${active === "suggestions" ? "active" : ""}`}
              onClick={() => {
                setActive("suggestions");
                setMenuOpen(false);
              }}
            >
              Suggestions
            </button>

            <button
              className="menu-item logout"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          </nav>
        </div>

        {/* USER AT BOTTOM */}
        <div className="user-box">
          <div className="avatar">{userName.charAt(0)}</div>
          <div>
            <p className="name">{userName}</p>
            <span className="plan">Student</span>
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="content">
        {active === "dashboard" && (
          <DashboardContent
            userName={userName}
            resumeText={resumeText}
            analysis={analysis}
          />
        )}
        {active === "resume" && (
          <ResumeContent 
            setResumeText={setResumeText}
            setAnalysis={setAnalysis}
          />
        )}
        {active === "skills" && (
          <SkillsContent resumeText={resumeText} />
        )}
        {active === "analytics" && (
          <AnalyticsContent resumeText={resumeText} />
        )}
        {active === "ai" && <AIAssistant />}
        {active === "suggestions" && <Suggestions />}
      </main>

    </div>
  </>
);

}

/* ---------------- HEADER ---------------- */

function PageHeader({ title, action }) {
  return (
    <div className="page-header">
      <div>
        <p className="date">{getTodayDate()}</p>
        <h1>{title}</h1>
      </div>

      {action && (
        <button className="export-btn">
          {action}
        </button>
      )}
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function DashboardContent({ userName, analysis}) {
  const hasResume = !!analysis;

  const ats = analysis?.ats_score || 0;
  const matched = analysis?.detected_skills || [];

  const missing = hasResume
  ? REQUIRED_SKILLS.filter(skill => !matched.includes(skill))
  : [];

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-gradient">
        <div className="hero-text">
          <h1>Welcome back, {userName} 👋</h1>
          <p>Here’s your career overview for today</p>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <h2>{ats}%</h2>
            <span>ATS Score</span>
          </div>

          <div className="hero-stat">
            <h2>{matched.length}</h2>
            <span>Skills Detected</span>
          </div>

          <div className="hero-stat">
            <h2>{missing.length}</h2>
            <span>Skill Gaps</span>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="dashboard-grid">
        {/* LEFT CARD */}
        <div className="card">
          <h3>Resume Status</h3>

          <div className="resume-row">
            <div>
              {hasResume ? (
                <>
                  <p className="resume-title">Resume Uploaded</p>
                  <span className="resume-sub">
                    ATS analysis completed successfully
                  </span>
                </>
              ) : (
                <>
                  <p className="resume-title">No Resume Uploaded</p>
                  <span className="resume-sub">
                    Upload your resume to start analysis
                  </span>
                </>
              )}
            </div>

            <button className="link-btn">
              <span className="plus">+</span>
              Upload
            </button>

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="card">
          <h3>Quick Actions</h3>

          <div className="quick-actions">
            <div className="action-card blue">
              <h4>Resume Analyzer</h4>
              <p>Check ATS score & suggestions</p>
            </div>

            <div className="action-card green">
              <h4>Skill Insights</h4>
              <p>View strengths & missing skills</p>
            </div>

            <div className="action-card purple">
              <h4>AI Career Assistant</h4>
              <p>Ask career-related questions</p>
            </div>

            <div className="action-card orange">
              <h4>Analytics</h4>
              <p>Track career progress</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- RESUME ---------------- */

function ResumeContent({ setResumeText, setAnalysis }) {
  const [fileName, setFileName] = useState("");

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("resume", file);

      alert("⏳ Analyzing resume...");

      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("AI RESPONSE:", data);

      if (!data.detected_skills) {
        alert("❌ Analysis failed");
        return;
      }

      setAnalysis(data);   // ⭐ THIS MAKES BACKEND DRIVE UI
      setResumeText((data.detected_skills || []).join(" "));
      alert("✅ Resume analyzed successfully!");

    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="date">{getTodayDate()}</p>
          <h1>Resume Analyzer</h1>
        </div>
      </div>

      <div className="upload-wrapper">
        <div className="upload-box-large">
          <div className="upload-icon">📄</div>

          <h2>{fileName || "No resume uploaded"}</h2>

          <p>
            Upload your resume to analyze ATS score, skills, and career fit.
          </p>

          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            style={{ display: "none" }}
          />

          <label htmlFor="resumeUpload" className="primary-btn upload-btn">
            Upload Resume
          </label>

          <span className="upload-hint">
            Supported formats: PDF, DOCX (Max 2MB)
          </span>
        </div>
      </div>
    </>
  );
}


/* ---------------- SKILLS (Nutrition-like) ---------------- */

function SkillsContent({ resumeText }) {
  const hasResume = resumeText.trim().length > 0;
  const { matched, missing } = hasResume
    ? calculateATS(resumeText)
    : { matched: [], missing: [] };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="date">{getTodayDate()}</p>
          <h1>Skill Insights</h1>
        </div>
      </div>

      <section className="skill-categories">
        <div className="skill-card">
          <h3>Technical Skills</h3>
          <p>Programming, tools, frameworks</p>
          <span className="skill-count">
            {matched.length} skills detected
          </span>
        </div>

        <div className="skill-card">
          <h3>Missing Skills</h3>
          <p>Skills required for target roles</p>
          <span className="skill-count">
            {missing.length} skill gaps
          </span>
        </div>

        <div className="skill-card">
          <h3>Total Skills Checked</h3>
          <p>ATS keyword comparison</p>
          <span className="skill-count">
            {matched.length + missing.length}
          </span>
        </div>
      </section>

      <section className="readiness-card">
        <h2>Career Readiness</h2>

        <div className="progress-group">
          <Progress label="Technical Readiness" value={matched.length * 10} />
          <Progress label="Core Fundamentals" value={matched.length * 8} />
          <Progress label="Role Alignment" value={matched.length * 12} />
        </div>

        {!hasResume && (
          <p className="readiness-note">
            Upload your resume to calculate real readiness scores.
          </p>
        )}
      </section>
    </>
  );
}


/* PROGRESS COMPONENT */
function Progress({ label, value }) {
  return (
    <div className="progress-item">
      <div className="progress-header">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}



/* ---------------- REPORTS ---------------- */

function ReportsContent() {
  return (
    <>
      <PageHeader title="Reports Management" action="Upload New Report" />

      <div className="reports-toolbar">
        <input placeholder="Search reports by ID or type..." />
        <select>
          <option>All Status</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      <div className="table-card">
        <div className="table-header">
          <span>Report Details</span>
          <span>Upload Date</span>
          <span>Status</span>
          <span>Type</span>
          <span>Actions</span>
        </div>

        <div className="table-empty">No reports found</div>
      </div>
    </>
  );
}

/* ---------------- ANALYTICS ---------------- */

function AnalyticsContent({ resumeText }) {
  const hasResume = resumeText.trim().length > 0;
  const { ats, matched } = hasResume
    ? calculateATS(resumeText)
    : { ats: 0, matched: [] };

  return (
    <>
      <PageHeader title="Career Analytics" action="📤 Export Report" />

      <section className="card-grid">
        <InfoCard label="Career Score" value={`${ats}%`} />
        <InfoCard label="Avg Skill Match" value={`${matched.length * 10}%`} />
        <InfoCard label="Target Role Readiness" value={`${ats - 0}%`} />
        <InfoCard label="Total Reports" value="1" dark />
      </section>
 
      <section className="analytics-grid">
        <ResumeSuggestions />
        <SkillGap />
        <CareerRecommendations />
        <ActionPlan />
      </section>
    </>
  );
}


function InfoCard({ label, value, dark }) {
  return (
    <div className={`info-card ${dark ? "dark" : ""}`}>
      <span>{label}</span>
      <h2>{value}</h2>
    </div>
  );
}


function ResumeSuggestions() {
  return (
    <div className="card">
      <h3>Resume Improvement Suggestions</h3>
      <ul className="suggestion-list">
        <li>Add measurable achievements (numbers & impact)</li>
        <li>Projects section not detected</li>
        <li>Include more role-specific keywords</li>
        <li>Resume length below recommended range</li>
      </ul>
      <p className="hint">
        Suggestions are generated using ATS rule-based analysis.
      </p>
    </div>
  );
}


function SkillGap() {
  return (
    <div className="card">
      <h3>Skill Gap Breakdown</h3>

      <div className="skill-gap-grid">
        <div>
          <h4>✔ Skills Detected</h4>
          <ul>
            <li>Java</li>
            <li>HTML</li>
            <li>CSS</li>
            <li>Git</li>
          </ul>
        </div>

        <div>
          <h4>❌ Skills Missing</h4>
          <ul>
            <li>React</li>
            <li>SQL</li>
            <li>REST APIs</li>
            <li>Data Structures</li>
          </ul>
        </div>
      </div>

      <p className="hint">
        Skill gaps are identified by comparing resume skills with target role requirements.
      </p>
    </div>
  );
}

function CareerRecommendations() {
  return (
    <div className="card">
      <h3>Recommended Career Roles</h3>

      <div className="role-list">
        <div className="role-item">
          <strong>Frontend Developer</strong>
          <span>72% match</span>
          <p>Based on HTML, CSS, JavaScript skills</p>
        </div>

        <div className="role-item">
          <strong>Java Backend Intern</strong>
          <span>65% match</span>
          <p>Based on Java and problem-solving keywords</p>
        </div>

        <div className="role-item">
          <strong>Software Engineer Trainee</strong>
          <span>58% match</span>
          <p>Entry-level role aligned with current skill set</p>
        </div>
      </div>
    </div>
  );
}

function ActionPlan() {
  return (
    <div className="card">
      <h3>Next 30-Day Career Action Plan</h3>

      <ul className="action-plan">
        <li>Week 1: Improve resume formatting & add projects</li>
        <li>Week 2: Learn React fundamentals</li>
        <li>Week 3: Practice SQL & APIs</li>
        <li>Week 4: Re-upload resume & recheck ATS score</li>
      </ul>

      <p className="hint">
        Plan is generated based on missing skills and readiness level.
      </p>
    </div>
  );
}


function DownloadCard({ title, desc }) {
  return (
    <div className="download-card">
      <h3>{title}</h3>
      <p>{desc}</p>
      <button className="download-btn">Download</button>
    </div>
  );
}

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Hi 👋 I’m your Career AI Assistant. Ask me anything about resumes, skills, or interviews."
    }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setChat([...chat, { role: "user", text: message }]);
    setMessage("");
  };

  return (
    <>
      <PageHeader title="AI Career Assistant" />

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className={`chat ${msg.role}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          placeholder="Ask about resume, skills, or interviews..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="suggested-questions">
        <span onClick={() => setMessage("How can I improve my ATS score?")}>
          Improve ATS score
        </span>
        <span onClick={() => setMessage("What skills are required for frontend developer?")}>
          Frontend skills
        </span>
        <span onClick={() => setMessage("Give common interview questions")}>
          Interview questions
        </span>
      </div>

      <div className="disclaimer">
        ⚠️ This AI provides general career guidance only.
      </div>
    </>
  );
}

function Suggestions() {
  const [tab, setTab] = useState("channels");

  return (
    <>
      <PageHeader title="Career Suggestions" />

      <div className="tabs">
        <button onClick={() => setTab("channels")} className={tab==="channels" ? "active" : ""}>
          Channels
        </button>
        <button onClick={() => setTab("websites")} className={tab==="websites" ? "active" : ""}>
          Learning Websites
        </button>
        <button onClick={() => setTab("practice")} className={tab==="practice" ? "active" : ""}>
          Interview Preparation
        </button>
      </div>

      {tab === "channels" && <Channels />}
      {tab === "websites" && <Websites />}
      {tab === "practice" && <Practice />}
    </>
  );
}

function Channels() {
  return (
    <div className="card-grid grid-4">
      {channels.map((c, i) => (
        <Resource key={i} c={c} />
      ))}
    </div>
  );
}


const channels = [
  {
    title: "Apna College",
    desc: "DSA + Web",
    img: "https://yt3.googleusercontent.com/ytc/APkrFKY7K4bQ=s176-c-k-c0x00ffffff-no-rj",
    rating: 4.8,
    link: "https://www.youtube.com/@ApnaCollegeOfficial"
  },
  {
    title: "CodeWithHarry",
    desc: "Web + Java",
    img: "https://yt3.googleusercontent.com/ytc/APkrFKbS=s176-c-k-c0x00ffffff-no-rj",
    rating: 4.7,
    link: "https://www.youtube.com/@CodeWithHarry"
  },
  {
    title: "Kunal Kushwaha",
    desc: "DSA + Career",
    img: "https://yt3.googleusercontent.com/ytc/APkrFKZ=s176-c-k-c0x00ffffff-no-rj",
    rating: 4.9,
    link: "https://www.youtube.com/@KunalKushwaha"
  },
  {
    title: "FreeCodeCamp",
    desc: "Full Stack",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/39/FreeCodeCamp_logo.png",
    rating: 4.8,
    link: "https://www.youtube.com/@freecodecamp"
  },
  {
    title: "Striver",
    desc: "DSA Sheets",
    img: "https://avatars.githubusercontent.com/u/70623425?v=4",
    rating: 4.9,
    link: "https://www.youtube.com/@takeUforward"
  },
  {
    title: "Java Brains",
    desc: "Java Backend",
    img: "https://yt3.googleusercontent.com/ytc/APkrFKJ=s176-c-k-c0x00ffffff-no-rj",
    rating: 4.6,
    link: "https://www.youtube.com/@JavaBrainsChannel"
  },
  {
    title: "Traversy Media",
    desc: "Frontend & MERN",
    img: "https://yt3.googleusercontent.com/ytc/APkrFKT=s176-c-k-c0x00ffffff-no-rj",
    rating: 4.7,
    link: "https://www.youtube.com/@TraversyMedia"
  },
  {
    title: "Telusko",
    desc: "Java + CS",
    img: "https://yt3.googleusercontent.com/ytc/APkrFKX=s176-c-k-c0x00ffffff-no-rj",
    rating: 4.5,
    link: "https://www.youtube.com/@Telusko"
  },
  {
    title: "Academind",
    desc: "React & JS",
    img: "https://yt3.googleusercontent.com/ytc/APkrFKM=s176-c-k-c0x00ffffff-no-rj",
    rating: 4.6,
    link: "https://www.youtube.com/@academind"
  },
  {
    title: "Coding Ninjas",
    desc: "Placement Prep",
    img: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Coding_Ninjas_logo.png",
    rating: 4.4,
    link: "https://www.youtube.com/@CodingNinjasIndia"
  }
];

const websites = [
  {
    title: "GeeksforGeeks",
    desc: "DSA & Core CS",
    rating: 4.6,
    img: "https://media.geeksforgeeks.org/wp-content/uploads/20210101144014/gfglogo.png",
    link: "https://www.geeksforgeeks.org"
  },
  {
    title: "LeetCode",
    desc: "Interview Coding",
    rating: 4.8,
    img: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    link: "https://leetcode.com"
  },
  {
    title: "HackerRank",
    desc: "Skill Tests",
    rating: 4.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png",
    link: "https://hackerrank.com"
  },
  {
    title: "Codeforces",
    desc: "Competitive Coding",
    rating: 4.7,
    img: "https://codeforces.org/s/0/images/codeforces-sponsored-by-ton.png",
    link: "https://codeforces.com"
  },
  {
    title: "MDN Docs",
    desc: "Web Standards",
    rating: 4.7,
    img: "https://developer.mozilla.org/static/img/favicon144.png",
    link: "https://developer.mozilla.org"
  },
  {
  title: "IndiaBix",
  desc: "Aptitude, Reasoning & Verbal Prep",
  rating: 4.7,
  img: "https://www.indiabix.com/favicon.ico",
  link: "https://www.indiabix.com"
  }
];

function Websites() {
  return (
    <div className="card-grid">
      {websites.map((c, i) => (
        <Resource key={i} c={c} />
      ))}
    </div>
  );
}


const practice = [
  {
    title: "Striver Sheet",
    desc: "Top DSA Questions",
    rating: 4.9,
    img: "https://takeuforward.org/wp-content/uploads/2021/09/striver.png",
    link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
  },
  {
    title: "Blind 75",
    desc: "FAANG Questions",
    rating: 4.8,
    img: "https://leetcode.com/favicon.ico",
    link: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions"
  },
  {
    title: "Tech Interview Handbook",
    desc: "System + Coding",
    rating: 4.8,
    img: "https://www.techinterviewhandbook.org/favicon.ico",
    link: "https://www.techinterviewhandbook.org"
  },
  {
  title: "PrepInsta",
  desc: "Aptitude + Placement Preparation",
  rating: 4.6,
  img: "https://prepinsta.com/favicon.ico",
  link: "https://prepinsta.com"
  },
  {
    title: "FreshersNow",
    desc: "Aptitude, Reasoning & Company Prep",
    rating: 4.5,
    img: "https://www.freshersnow.com/favicon.ico",
    link: "https://www.freshersnow.com"
  },
  {
    title: "FacePrep",
    desc: "Aptitude & Interview Readiness",
    rating: 4.4,
    img: "https://www.faceprep.in/favicon.ico",
    link: "https://www.faceprep.in"
  }

];

function Practice() {
  return (
    <div className="card-grid">
      {practice.map((c, i) => (
        <Resource key={i} c={c} />
      ))}
    </div>
  );
}

function Resource({ c }) {
  return (
    <div className="card">
      <img
        src={c.img}
        alt={c.title}
        className="card-img"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/80?text=Logo";
        }}
      />

      <h3>{c.title}</h3>
      <p>{c.desc}</p>

      <div className="rating">⭐ {c.rating}</div>

      <a href={c.link} target="_blank" rel="noreferrer">
        <button className="primary-btn">Open</button>
      </a>
    </div>
  );
}

