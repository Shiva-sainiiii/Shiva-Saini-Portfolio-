// 🔥 /api/ask.js  (Vercel Serverless Function)

export default async function handler(req, res) {

// ❌ Only allow POST
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const { message } = req.body;

if (!message) {
  return res.status(400).json({ error: "Message is required" });
}

// 🔐 Call OpenRouter API
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://your-site.vercel.app", // optional but recommended
    "X-Title": "Shiva Portfolio AI"
  },
  body: JSON.stringify({
    model: "mistralai/mistral-7b-instruct:free",
    messages: [
      {
        role: "system",
        content: "You are Shiva's AI assistant. Answer in a friendly, slightly cool Gen-Z tone."
      },
      {
        role: "user",
        content: message
      }
    ]
  })
});

const data = await response.json();

// ❌ Error handling
if (!response.ok) {
  return res.status(500).json({
    error: "AI API Error",
    details: data
  });
}

// ✅ Send only needed response
res.status(200).json({
  choices: data.choices
});

} catch (error) {
console.error("❌ Server Error:", error);

res.status(500).json({
  error: "Internal Server Error"
});

}
}