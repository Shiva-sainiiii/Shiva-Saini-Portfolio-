/* ============================================================
   SHIVA SAINI PORTFOLIO — api/ask.js  v3.1
   Vercel Serverless Function — OpenRouter AI Chat
   Fix: replaced unavailable model with confirmed free-tier models
   Primary:  meta-llama/llama-3.2-11b-vision-instruct:free  (vision + text)
   Fallback: meta-llama/llama-3.1-8b-instruct:free           (text only)
   ============================================================ */

const SYSTEM_PROMPT = `You are an elite AI assistant embedded in Shiva Saini's personal developer portfolio.
You have two roles — seamlessly combined:

━━━ ROLE 1: Shiva's Portfolio Representative ━━━
About Shiva Saini:
- Passionate full-stack web developer and self-learner based in India
- Core tech stack: HTML5, CSS3, JavaScript (ES6+), React, Node.js, Python, Express.js
- Platforms & Tools: Firebase, Vercel, Git/GitHub, VS Code, Figma
- AI expertise: OpenRouter API, Prompt Engineering, multimodal AI integrations
- Completed 10+ real-world projects including:
  • Restaurant Menu AI (OpenRouter + Firebase + Vercel serverless)
  • Code Editor AI (browser-based, multi-language, AI suggestions)
  • Shanu AI Chatbot (real-time conversational AI)
  • AI Mind Trap (logic puzzle game with AI)
  • AI Teaching Assistant (PDF/image Q&A for students)
  • Portfolio Website (this site — GSAP, Particles.js, Firebase)
  • Weather App, Tic Tac Toe, and more
- Certifications: Web Dev Internship (Octanet), AI for Beginners (Microsoft), ADCA, Data Entry Operator, CRM (IT/ITeS), Web Dev Internship (CodSoft)
- Offer letters from: PAYTM, WISHFIN, CITYMALL, PAISABAZAR
- Portfolio: https://shivasainiportfolio.vercel.app
- GitHub: https://github.com/Shiva-sainiiii
- Open to: internships, freelance, full-time roles, collaborations
- Strengths: clean code, modern UI/UX, AI integrations, problem-solving, fast learner

━━━ ROLE 2: Versatile Developer Assistant ━━━
You can handle ANY technical question a recruiter or developer might ask:
- Write, explain, debug, and review code in any language (JS, Python, HTML, CSS, React, Node, SQL, etc.)
- Explain computer science concepts, algorithms, data structures
- Answer system design, architecture, and API design questions
- Provide career advice, resume tips, interview prep
- Analyze images, PDFs, documents, code screenshots when provided
- Solve logic puzzles, math problems, and technical challenges

━━━ Response Style ━━━
- Use markdown formatting: **bold**, \`inline code\`, \`\`\`code blocks\`\`\`, lists, tables, headers
- Always use fenced code blocks with the correct language identifier (e.g. \`\`\`javascript)
- Be concise for simple questions, thorough for complex ones
- For code: always include comments explaining the logic
- For Shiva-related questions: be enthusiastic and professional
- Never say "I don't know" — give your best answer or ask a clarifying question
- If given a file/image: analyze it thoroughly and provide detailed, actionable feedback`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed.' });

  const { message, file } = req.body || {};

  const hasMessage = message && typeof message === 'string' && message.trim().length > 0;
  const hasFile    = file && file.data && file.type;

  if (!hasMessage && !hasFile) {
    return res.status(400).json({ error: 'Message or file attachment is required.' });
  }

  if (hasMessage && message.trim().length > 2000) {
    return res.status(400).json({ error: 'Message too long. Keep it under 2000 characters.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('[ask.js] OPENROUTER_API_KEY is not set in environment variables.');
    return res.status(500).json({ error: 'AI service not configured. Please contact Shiva.' });
  }

  // ── Determine if this needs a vision-capable model ──────
  const needsVision = hasFile && (
    file.type.startsWith('image/') ||
    file.type === 'application/pdf'
  );

  // ── Build user content (multimodal or plain text) ────────
  let userContent;

  if (needsVision) {
    const textPart = hasMessage
      ? message.trim()
      : (file.type === 'application/pdf'
          ? 'Please analyze this PDF and summarize its key contents.'
          : 'Please analyze this image and describe what you see in detail.');

    userContent = [
      { type: 'text', text: textPart },
      {
        type: 'image_url',
        image_url: {
          url: `data:${file.type};base64,${file.data}`
        }
      }
    ];
  } else {
    userContent = hasMessage ? message.trim() : 'Hello!';
  }

  // ── Model selection ──────────────────────────────────────
  // These are confirmed free-tier models on OpenRouter (April 2025)
  // Vision model: supports image + PDF base64
  // Text model:   fast, reliable, free
  const PRIMARY_MODEL  = needsVision
    ? 'meta-llama/llama-3.2-11b-vision-instruct:free'
    : 'meta-llama/llama-3.1-8b-instruct:free';

  const FALLBACK_MODEL = 'mistralai/mistral-7b-instruct:free';

  // ── Call OpenRouter ──────────────────────────────────────
  async function callOpenRouter(model, content) {
    const body = {
      model,
      max_tokens:  1200,
      temperature: 0.72,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content }
      ]
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
        'HTTP-Referer':  'https://shivasainiportfolio.vercel.app',
        'X-Title':       'Shiva Saini Portfolio'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[ask.js] Model ${model} error ${response.status}:`, errText);
      return null;
    }

    const data  = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return reply || null;
  }

  try {
    // Try primary model first
    let reply = await callOpenRouter(PRIMARY_MODEL, userContent);

    // If primary failed and it was a vision request, try fallback with text only
    if (!reply) {
      console.warn('[ask.js] Primary model failed, trying fallback...');
      const fallbackContent = hasMessage
        ? message.trim()
        : 'Please describe what was in the uploaded file (file content unavailable in fallback mode).';
      reply = await callOpenRouter(FALLBACK_MODEL, fallbackContent);
    }

    if (!reply) {
      return res.status(502).json({
        error: 'AI models are currently unavailable. Please try again in a moment.'
      });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    // Log the REAL error for debugging in Vercel logs
    console.error('[ask.js] Unexpected error:', err.message, err.stack);
    return res.status(500).json({
      error: `Server error: ${err.message}. Please try again.`
    });
  }
}
