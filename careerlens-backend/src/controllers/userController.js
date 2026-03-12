const { upsertUser, getUser } = require('../services/firestoreService');

/**
 * GET /api/users/me
 * Returns the current authenticated user's profile.
 * Auto-creates user in Firestore if first login.
 */
const getMe = async (req, res) => {
  try {
    const user = await upsertUser(req.user.uid, req.user);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/users/profile
 * Returns extended user profile from Firestore.
 */
const getProfile = async (req, res) => {
  try {
    const user = await getUser(req.user.uid);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getMe, getProfile };
