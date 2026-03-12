const aiController = async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const { OpenAI } = require("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = [
      {
        role: "system",
        content: `You are CareerLens AI, a helpful career assistant for students and job seekers in India. 
You help with: resume improvement, ATS optimization, skill gap advice, interview preparation, 
career path guidance, and job search strategies. 
Keep answers concise, practical, and encouraging.`,
      },
      ...chatHistory.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { aiController };