/* ============================================================
   SHIVA SAINI PORTFOLIO — api/ask.js  v2.0
   Vercel Serverless Function — OpenRouter AI Chat
   ============================================================ */

/**
 * POST /api/ask
 * Body:  { message: string }
 * Returns: { reply: string } | { error: string }
 */

// System prompt that gives the AI context about Shiva
const SYSTEM_PROMPT = `You are an AI assistant embedded in Shiva Saini's personal portfolio website.
Your role is to represent Shiva in a professional, friendly, and enthusiastic manner.

About Shiva Saini:
- He is a passionate web developer and self-learner
- Tech stack: HTML, CSS, JavaScript, React, Node.js, Python, Firebase, Vercel
- He has 10+ completed projects including portfolio websites, AI chat apps, and dashboards
- He has 5+ certifications in web development, JavaScript, Firebase, and Python
- He has received 3+ internship offer letters
- His portfolio is at: https://shivasainiportfolio.vercel.app/
- His GitHub: https://github.com/Shiva-sainiiii
- He is passionate about AI integrations, modern UI/UX, and clean code
- He is open to internships, freelance projects, and collaboration opportunities
- He is currently learning and improving his skills every day

Your behavior:
- Be concise, helpful, and friendly
- Answer questions about Shiva's skills, projects, experience, and availability
- For general tech questions, answer helpfully and relate back to Shiva's expertise when relevant
- Keep responses under 150 words unless the question requires more detail
- Always be positive and encouraging about Shiva's work
- If asked something you don't know about Shiva specifically, say so honestly and suggest contacting him directly`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // Validate request body
  const { message } = req.body || {};

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (message.trim().length > 600) {
    return res.status(400).json({ error: 'Message is too long. Please keep it under 600 characters.' });
  }

  // Check API key
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('[ask.js] OPENROUTER_API_KEY is not set.');
    return res.status(500).json({ error: 'AI service is not configured. Please contact Shiva.' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization':    `Bearer ${apiKey}`,
        'Content-Type':     'application/json',
        'HTTP-Referer':     'https://shivasainiportfolio.vercel.app',
        'X-Title':          'Shiva Saini Portfolio'
      },
      body: JSON.stringify({
        model:       'nvidia/nemotron-3-super-120b-a12b:free',   // fast & free-tier friendly
        max_tokens:  350,
        temperature: 0.75,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: message.trim() }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[ask.js] OpenRouter error:', response.status, errText);
      return res.status(502).json({
        error: `AI service returned an error (${response.status}). Please try again.`
      });
    }

    const data  = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'No response from AI. Please try again.' });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('[ask.js] Fetch error:', err.message);
    return res.status(500).json({
      error: 'Failed to reach AI service. Check your connection and try again.'
    });
  }
}
