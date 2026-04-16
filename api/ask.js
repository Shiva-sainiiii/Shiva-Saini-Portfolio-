// ==============================
// 🤖 VERCEL SERVERLESS API
// ==============================

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🔐 API KEY (from Vercel ENV)
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    // ==============================
    // 🧠 AI CONTEXT (IMPORTANT)
    // ==============================
    const systemPrompt = `
You are Shiva Saini's personal portfolio AI assistant.

Answer ONLY based on Shiva's profile:

- Name: Shiva Saini
- Role: Full Stack Developer
- Skills: HTML, CSS, JavaScript, React, Node.js, MongoDB, Firebase, GSAP
- Tech Stack: MERN + AI integrations
- Projects: Web apps, AI tools, interactive UI
- Personality: Friendly, smart, helpful

Rules:
- Keep answers short and clear
- If question is unrelated, politely refuse
- Speak like a human, not a robot
`;

    // ==============================
    // 🚀 API CALL TO OPENROUTER
    // ==============================
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto", // free model auto चयन
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // Extract reply safely
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't understand that.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
