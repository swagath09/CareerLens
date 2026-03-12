const { getFirestore } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

/**
 * Firestore Collections:
 *   users/{uid}
 *   resumes/{resumeId}
 *   analyses/{analysisId}
 */

// ─── Users ────────────────────────────────────────────────────────────────────

const upsertUser = async (uid, data) => {
  const db = getFirestore();
  const userRef = db.collection('users').doc(uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    await userRef.set({
      uid,
      email: data.email || null,
      name: data.name || null,
      picture: data.picture || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else {
    await userRef.update({ updatedAt: new Date().toISOString() });
  }

  return (await userRef.get()).data();
};

const getUser = async (uid) => {
  const db = getFirestore();
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
};

// ─── Resumes ──────────────────────────────────────────────────────────────────

const saveResume = async (uid, { filename, mimetype, extractedText, fileSize }) => {
  const db = getFirestore();
  const resumeId = uuidv4();

  const resumeData = {
    resumeId,
    uid,
    filename,
    mimetype,
    fileSize,
    wordCount: extractedText.trim().split(/\s+/).length,
    extractedText,
    uploadedAt: new Date().toISOString(),
  };

  await db.collection('resumes').doc(resumeId).set(resumeData);

  // Update user's resume list
  await db.collection('users').doc(uid).update({
    latestResumeId: resumeId,
    updatedAt: new Date().toISOString(),
  });

  return resumeId;
};

const getResume = async (resumeId, uid) => {
  const db = getFirestore();
  const doc = await db.collection('resumes').doc(resumeId).get();
  if (!doc.exists) return null;
  const data = doc.data();
  if (data.uid !== uid) return null; // ownership check
  return data;
};

const getUserResumes = async (uid) => {
  const db = getFirestore();
  const snapshot = await db
    .collection('resumes')
    .where('uid', '==', uid)
    .orderBy('uploadedAt', 'desc')
    .limit(20)
    .get();

  return snapshot.docs.map((doc) => {
    const d = doc.data();
    // Don't return full text in list view
    const { extractedText, ...rest } = d;
    return rest;
  });
};

const deleteResume = async (resumeId, uid) => {
  const db = getFirestore();
  const doc = await db.collection('resumes').doc(resumeId).get();
  if (!doc.exists || doc.data().uid !== uid) return false;
  await db.collection('resumes').doc(resumeId).delete();
  // Also delete associated analyses
  const analyses = await db.collection('analyses').where('resumeId', '==', resumeId).get();
  const batch = db.batch();
  analyses.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return true;
};

// ─── Analyses ─────────────────────────────────────────────────────────────────

const saveAnalysis = async (uid, resumeId, analysisResult) => {
  const db = getFirestore();
  const analysisId = uuidv4();

  const data = {
    analysisId,
    uid,
    resumeId,
    ...analysisResult,
    createdAt: new Date().toISOString(),
  };

  await db.collection('analyses').doc(analysisId).set(data);

  // Update resume with latest analysis reference
  await db.collection('resumes').doc(resumeId).update({
    latestAnalysisId: analysisId,
  });

  return { analysisId, ...data };
};

const getAnalysis = async (analysisId, uid) => {
  const db = getFirestore();
  const doc = await db.collection('analyses').doc(analysisId).get();
  if (!doc.exists) return null;
  const data = doc.data();
  if (data.uid !== uid) return null;
  return data;
};

const getResumeAnalyses = async (resumeId, uid) => {
  const db = getFirestore();
  const snapshot = await db
    .collection('analyses')
    .where('resumeId', '==', resumeId)
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
  return snapshot.docs.map((d) => d.data());
};

const getUserAnalyses = async (uid) => {
  const db = getFirestore();
  const snapshot = await db
    .collection('analyses')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();
  return snapshot.docs.map((d) => d.data());
};

module.exports = {
  upsertUser,
  getUser,
  saveResume,
  getResume,
  getUserResumes,
  deleteResume,
  saveAnalysis,
  getAnalysis,
  getResumeAnalyses,
  getUserAnalyses,
};
