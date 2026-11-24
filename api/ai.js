// FlowCraft free AI proxy - Vercel Function (Hobby plan is free).
// Keeps your Groq key secret and forwards chat requests from FlowCraft to Groq's free API.
//
// Vercel → Project → Settings → Environment Variables:
//   GROQ_API_KEY   your key from console.groq.com   (required)
//   APP_PASSCODE   any password you choose; type it into FlowCraft → Settings → AI connection (recommended,
//                  otherwise anyone who finds your site can use your free quota)
//   MODEL          optional, default openai/gpt-oss-120b

module.exports = async (req, res) => {
  const send = (status, obj) => { res.statusCode = status; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(obj)); };

  if (req.method !== 'POST') return send(405, { error: 'Use POST' });

  // Only accept calls from this same site
  const origin = req.headers.origin || '';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  if (origin && origin.replace(/^https?:\/\//, '') !== host) return send(403, { error: 'Cross-site requests are not allowed' });

  if (!process.env.GROQ_API_KEY) return send(500, { error: 'GROQ_API_KEY is not set in Vercel environment variables' });
  if (process.env.APP_PASSCODE && req.headers['x-flowcraft-pass'] !== process.env.APP_PASSCODE) return send(401, { error: 'Wrong passcode' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return send(400, { error: 'Bad JSON' }); } }
  if (!body || !Array.isArray(body.messages) || !body.messages.length) return send(400, { error: 'messages required' });

  const payload = {
    model: process.env.MODEL || 'openai/gpt-oss-120b',
    messages: body.messages.slice(-60),
    max_tokens: Math.min(Number(body.max_tokens) || 1500, 2000),
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.3,
  };
  if (Array.isArray(body.tools) && body.tools.length) { payload.tools = body.tools.slice(0, 24); payload.tool_choice = 'auto'; }

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + process.env.GROQ_API_KEY },
      body: JSON.stringify(payload),
    });
    res.statusCode = r.status;
    res.setHeader('content-type', 'application/json');
    res.end(await r.text());
  } catch (e) {
    send(502, { error: 'Could not reach Groq' });
  }
};
