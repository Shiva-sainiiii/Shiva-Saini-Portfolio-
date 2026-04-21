/* ============================================================
   SHIVA SAINI PORTFOLIO — api/ask.js
   Vercel Serverless Function — Production Ready
   ============================================================ */

/* ─────────────────────────────────────────
   CONFIG
───────────────────────────────────────── */
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://shivasainiportfolio.vercel.app";
const MAX_MSG_LENGTH = 500;
const MODEL          = "nvidia/nemotron-super-49b-v1:free"; // free OpenRouter model

/* ─────────────────────────────────────────
   SYSTEM PROMPT
───────────────────────────────────────── */
const SYSTEM_PROMPT = `
You are Shiva Saini's personal AI assistant on his portfolio website.

== About Shiva ==
- Full Name    : Shiva Saini
- Role         : Full Stack Developer & AI Enthusiast
- Experience   : 6+ months of real-world development
- Tech Stack   : HTML, CSS, JavaScript, React, Node.js, MongoDB, Firebase, GSAP, Three.js, Tailwind CSS
- Specialties  : MERN stack, AI integrations, animated UIs, REST APIs
- Deployment   : Vercel, GitHub Pages

== Projects ==
1. AI Teaching Assistant  — AI-powered educational platform
2. Shanu AI (ChatBot)     — Custom conversational AI chatbot
3. Code Editor AI         — Real-time AI-assisted coding tool
4. Weather Info           — Dynamic real-time weather app
5. Tic-Tac-Toe            — Classic game with modern UI
6. City Cafe              — Restaurant menu web concept

== Work Experience ==
- Paytm, Paisabazar, CityMall, Wishfin (offer letters available)

== Contact ==
- GitHub    : github.com/Shiva-sainiiii
- LinkedIn  : linkedin.com/in/shiva-sainiiii
- Instagram : @shiva_sainiiii
- Email     : shivasaini.5666@gmail.com

== Rules ==
- Answer ONLY questions related to Shiva's profile, skills, projects, or tech in general
- Keep answers concise, helpful, and friendly (2–4 sentences max)
- If asked something completely unrelated, politely say you can only answer portfolio-related questions
- Never make up false credentials or fake projects
- Speak like a knowledgeable, friendly human — not a robot
`.trim();

/* ─────────────────────────────────────────
   CORS HEADERS
───────────────────────────────────────── */
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin",  ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/* ─────────────────────────────────────────
   MAIN HANDLER
───────────────────────────────────────── */
export default async function handler(req, res) {
  setCORSHeaders(res);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ─── INPUT VALIDATION ───
  const { message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message field is required and must be a string." });
  }

  const cleanMessage = message.trim().slice(0, MAX_MSG_LENGTH);

  if (cleanMessage.length === 0) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  // ─── API KEY CHECK ───
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server configuration error." });
  }

  // ─── CALL OPENROUTER ───
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization":  `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type":   "application/json",
        "HTTP-Referer":   ALLOWED_ORIGIN,
        "X-Title":        "Shiva Saini Portfolio"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: cleanMessage  }
        ]
      })
    });

    // ─── HANDLE API ERRORS ───
    if (!response.ok) {
      const errText = await response.text();
      console.error(`OpenRouter ${response.status}:`, errText);
      return res.status(502).json({
        error: "AI service unavailable. Please try again shortly."
      });
    }

    const data  = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(200).json({ reply: "I'm not sure how to answer that. Try asking something about Shiva's skills or projects!" });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("ask.js error:", err.message);
    return res.status(500).json({
      error: "Something went wrong on our end. Please try again."
    });
  }
}
