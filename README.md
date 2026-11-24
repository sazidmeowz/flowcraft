# FlowCraft

A blocky, survival-game-style planner for study and work. Tell **Flow** what you want to get done, by typing or speaking, and it turns that into quests you start with one tap. Finish quests to earn diamonds, copper and lapis, craft armor, and keep your streak. Miss them and your armor cracks.

## Features

- **Flow chat (tab 1).** Natural-language and voice task entry. It splits plans into timed tasks across the week and can drive the whole app.
- **Today.** Daily quests with Start / Pause / Stop timers, a how-to and a source for each quest, a quest report, and loot chests.
- **Chests.** A 7-day task manager, plus subject chests that oxidise when a subject is left untouched, and goals.
- **Planner.** Uses goal deadlines, weak marks, spaced repetition (1·3·7·14·30 days), your real best focus hours and your real time-per-task. Plans are built around your own tasks and your calendar.
- **Copper Helper.** An AI path designer for subjects and courses, plus a library of 39 checked courses, textbooks, past papers and official admission pages.
- **Command Block.** Notion Calendar read and write, a daily log saved to Notion, importing from Notion, and the Memory Book (academic and work memories, lessons from past mistakes).
- **Armory.** Leather → Copper → Iron → Gold → Diamond → Netherite, Protection and Fortune enchantments, a wandering trader, straw-bed rest days and cushion breaks.
- **Stats.** A focus heat-map by hour, a 14-day chart, time per subject, time-estimate accuracy and 20 advancements.
- **Seven biomes and a real-time sky.** Works on phones held upright or sideways.

Everything is one self-contained file: `index.html`. There's no build step. `api/ai.js` is the free AI proxy for Vercel; `worker.js` is a Cloudflare alternative.

## Deploy on Vercel (free)

1. Sign in at **vercel.com** with your GitHub account (Hobby plan, free).
2. Click **Add New… → Project** and import **flowcraft**.
3. Set Framework Preset to **Other**. Leave the build command and output directory empty. Click **Deploy**.
4. Your site is live at `https://flowcraft-<something>.vercel.app`. Every push to `main` redeploys it automatically.

## Running outside Claude

FlowCraft was built as a Claude artifact. Some features use services that only exist when it's opened inside claude.ai:

| Feature | Inside Claude | Standalone site |
|---|---|---|
| Quests, timers, planner, armor, stats, chests | ✅ | ✅ |
| Saving progress | Synced to your Claude account | Saved in this browser only (`localStorage`). Use *Settings → Copy backup* to move devices |
| Voice input | ✅ | ✅ in Chrome and Edge (browser speech recognition) |
| Flow AI, Copper Helper, Sage, lessons | ✅ (Claude) | ✅ free via Groq through `api/ai.js` on Vercel (setup below). Without it, the quick-add parser still works |
| Notion and Notion Calendar | ✅ | ❌ (needs a backend with Notion OAuth) |

### Free AI on Vercel (Groq)

`api/ai.js` is a Vercel Function that keeps your Groq key secret and forwards FlowCraft's AI requests to **Groq's free API**. Groq's free tier needs no card. When you hit the free limit it just pauses (error 429); it never charges you.

1. **Get a free Groq key.** Sign up at console.groq.com, open **API Keys**, click **Create API Key** and copy it.
2. **Add environment variables.** In Vercel, open your project → **Settings → Environment Variables** and add:
   - `GROQ_API_KEY`: your Groq key
   - `APP_PASSCODE`: any password you make up. This stops strangers who find your site from using your free quota.
   - (optional) `MODEL`: default `openai/gpt-oss-120b`
3. **Redeploy.** Go to **Deployments → ⋯ on the latest one → Redeploy**. Environment variables only apply to new deployments.
4. **Connect.** Open your site → **Settings → AI connection**. Leave the URL empty, type your passcode, click **Save**, then **Test connection**. You should see "✓ FlowCraft AI is online."

Never put the Groq key in `index.html`. It belongs only in Vercel's environment variables.

*Alternative:* `worker.js` does the same job as a Cloudflare Worker, if you host the site somewhere without functions (for example GitHub Pages). Paste the Worker URL into Settings → AI connection.

## Data and privacy

Progress lives in your browser (or your Claude account when opened inside Claude). The Memory Book stores only academic and work items, and every imported item is shown for review before it's saved.
