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
    return res.status(500).json({ error: 'Gemini API Key is not configured on Vercel.' });
  }

  try {
    const { contents, systemInstruction, generationConfig } = req.body;

    const body = { contents };
    if (systemInstruction) body.systemInstruction = systemInstruction;
    if (generationConfig) body.generationConfig = generationConfig;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Gemini API returned status ${response.status}`, details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in gemini proxy:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
