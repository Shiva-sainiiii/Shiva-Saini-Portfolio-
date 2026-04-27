/* ============================================================
   SHIVA SAINI PORTFOLIO — api/ask.js  v3.0
   Vercel Serverless Function — OpenRouter AI Chat
   Supports: text, images (base64), PDFs (base64)
   Model: google/gemini-flash-1.5 (multimodal, fast, free-tier)
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { message, file } = req.body || {};

  // Validate: must have at least message or a file
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
    console.error('[ask.js] OPENROUTER_API_KEY is not set.');
    return res.status(500).json({ error: 'AI service not configured. Please contact Shiva.' });
  }

  try {
    // ── Build user message content (multimodal) ──────────────────
    let userContent;

    if (hasFile) {
      const isImage = file.type.startsWith('image/');
      const isPDF   = file.type === 'application/pdf';

      if (isImage) {
        // Vision message: image + optional text
        userContent = [
          ...(hasMessage ? [{ type: 'text', text: message.trim() }] : [{ type: 'text', text: 'Please analyze this image and describe what you see in detail.' }]),
          {
            type: 'image_url',
            image_url: {
              url: `data:${file.type};base64,${file.data}`
            }
          }
        ];
      } else if (isPDF) {
        // Gemini Flash supports PDF as base64 document
        userContent = [
          {
            type: 'text',
            text: hasMessage
              ? message.trim()
              : 'Please analyze this PDF document and summarize its contents.'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:application/pdf;base64,${file.data}`
            }
          }
        ];
      } else {
        // Unsupported file type — text-only fallback
        userContent = message.trim() || 'Please help me with this file.';
      }
    } else {
      // Plain text message
      userContent = message.trim();
    }

    // ── Call OpenRouter API ──────────────────────────────────────
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
        'HTTP-Referer':  'https://shivasainiportfolio.vercel.app',
        'X-Title':       'Shiva Saini Portfolio — AI Assistant'
      },
      body: JSON.stringify({
        model:       'nvidia/nemotron-3-super-120b-a12b:free',  // Fast, multimodal, generous context
        max_tokens:  1500,
        temperature: 0.72,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: userContent   }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[ask.js] OpenRouter error:', response.status, errText);

      // Try fallback model if primary fails
      const fallback = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type':  'application/json',
          'HTTP-Referer':  'https://shivasainiportfolio.vercel.app',
          'X-Title':       'Shiva Saini Portfolio — AI Assistant'
        },
        body: JSON.stringify({
          model:      'nvidia/nemotron-3-super-120b-a12b:free',
          max_tokens: 1000,
          temperature: 0.72,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user',   content: typeof userContent === 'string' ? userContent : (message || 'Hello') }
          ]
        })
      });

      if (!fallback.ok) {
        return res.status(502).json({
          error: `AI service error (${response.status}). Please try again.`
        });
      }

      const fallbackData  = await fallback.json();
      const fallbackReply = fallbackData?.choices?.[0]?.message?.content?.trim();
      if (!fallbackReply) return res.status(502).json({ error: 'No response from AI. Please try again.' });
      return res.status(200).json({ reply: fallbackReply });
    }

    const data  = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) return res.status(502).json({ error: 'Empty response from AI. Please try again.' });

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('[ask.js] Fetch error:', err.message);
    return res.status(500).json({
      error: 'Failed to reach AI service. Check your connection and try again.'
    });
  }
                                               }
