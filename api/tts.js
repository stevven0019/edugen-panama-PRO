export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no está configurada en las variables de entorno de Vercel.' });
  }

  try {
    const { promptText, speechConfig, model } = req.body;

    if (!promptText) {
      return res.status(400).json({ error: 'Falta el parámetro promptText.' });
    }

    const payload = {
      contents: [{
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: speechConfig || {}
      },
      model: model || "gemini-2.5-flash-preview-tts"
    };

    const targetModel = model || "gemini-2.5-flash-preview-tts";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini TTS upstream error:', response.status, errText);
      return res.status(response.status).json({ 
        error: `Gemini TTS API returned status ${response.status}`, 
        details: errText 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in tts proxy handler:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
