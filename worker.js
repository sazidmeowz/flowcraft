// FlowCraft AI proxy - Cloudflare Worker (free plan)
// Keeps your Groq API key secret and forwards chat requests from your site to Groq's free API.
//
// Secrets/variables to set in Cloudflare (Worker → Settings → Variables and Secrets):
//   GROQ_API_KEY     (Secret)  your key from console.groq.com
//   APP_PASSCODE     (Secret)  any password you choose; type the same one into FlowCraft Settings
//   ALLOWED_ORIGINS  (Text, optional) comma-separated sites allowed to use this proxy
//                    default: https://sazidmeowz.github.io
//   MODEL            (Text, optional) default: openai/gpt-oss-120b

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || 'https://sazidmeowz.github.io').split(',').map(s => s.trim()).filter(Boolean);
    const originOk = allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': originOk ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type, x-flowcraft-pass',
      'Vary': 'Origin',
    };
    const reply = (status, msg) => new Response(JSON.stringify({ error: msg }), { status, headers: { ...cors, 'content-type': 'application/json' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return reply(405, 'Use POST');
    if (!originOk) return reply(403, 'This site is not allowed to use this proxy');
    if (!env.GROQ_API_KEY) return reply(500, 'GROQ_API_KEY secret is missing');
    if (env.APP_PASSCODE && req.headers.get('x-flowcraft-pass') !== env.APP_PASSCODE) return reply(401, 'Wrong passcode');

    let body;
    try { body = await req.json(); } catch { return reply(400, 'Bad JSON'); }
    if (!Array.isArray(body.messages) || !body.messages.length) return reply(400, 'messages required');

    const payload = {
      model: env.MODEL || 'openai/gpt-oss-120b',
      messages: body.messages.slice(-60),
      max_tokens: Math.min(Number(body.max_tokens) || 1500, 2000),
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.3,
    };
    if (Array.isArray(body.tools) && body.tools.length) {
      payload.tools = body.tools.slice(0, 24);
      payload.tool_choice = 'auto';
    }

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + env.GROQ_API_KEY },
      body: JSON.stringify(payload),
    });
    return new Response(r.body, { status: r.status, headers: { ...cors, 'content-type': 'application/json' } });
  },
};
