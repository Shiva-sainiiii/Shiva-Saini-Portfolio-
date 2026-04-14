// OpenRouter FREE API Key (Get from openrouter.ai)
const OPENROUTER_API_KEY = 'YOUR_OPENROUTER_API_KEY_HERE'; // Add in Vercel Env

// Get AI Response
window.getAIResponse = async function(message) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Portfolio AI Chat'
            },
            body: JSON.stringify({
                model: 'google/gemini-flash-exp:free', // FREE MODEL
                messages: [
                    {
                        role: 'system',
                        content: 'You are a friendly AI assistant for a developer portfolio. Answer shortly and professionally. Keep responses under 100 words.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('AI API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('AI Error:', error);
        return "🤖 Sorry bhai, AI thoda busy hai! Try again in a sec! 😅";
    }
};