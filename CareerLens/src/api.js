const API_BASE = "http://localhost:5000";

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};