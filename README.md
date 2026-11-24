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

Everything is one self-contained file: `index.html`. There's no build step. `worker.js` is the optional free AI proxy.

## Deploy

**GitHub Pages:** go to Settings → Pages, set Source to *Deploy from a branch*, then pick branch `main` and folder `/ (root)`. The site goes live at `https://<user>.github.io/flowcraft/`.

The same file works on Netlify, Vercel or Cloudflare Pages too. Drop in the repo; no build command is needed.

## Running outside Claude

FlowCraft was built as a Claude artifact. Some features use services that only exist when it's opened inside claude.ai:

| Feature | Inside Claude | Standalone site |
|---|---|---|
| Quests, timers, planner, armor, stats, chests | ✅ | ✅ |
| Saving progress | Synced to your Claude account | Saved in this browser only (`localStorage`). Use *Settings → Copy backup* to move devices |
| Voice input | ✅ | ✅ in Chrome and Edge (browser speech recognition) |
| Flow AI, Copper Helper, Sage, lessons | ✅ (Claude) | ✅ free via Groq + Cloudflare Worker (setup below). Without it, the quick-add parser still works |
| Notion and Notion Calendar | ✅ | ❌ (needs a backend with Notion OAuth) |

### Free AI on your own site (Groq + Cloudflare Worker)

The deployed site uses **Groq's free API** through a **free Cloudflare Worker** that keeps your key secret. Groq's free tier needs no card. When you hit the free limit it just pauses (error 429); it never charges you.

1. **Get a free Groq key.** Sign up at console.groq.com, open **API Keys**, click **Create API Key** and copy it.
2. **Create the Worker.** Sign up at cloudflare.com (free plan). Go to **Workers & Pages → Create → Create Worker**, name it `flowcraft-ai`, click **Deploy**, then **Edit code**. Replace everything with [`worker.js`](worker.js) from this repo and click **Deploy**.
3. **Add the secrets.** In the Worker, open **Settings → Variables and Secrets** and add:
   - `GROQ_API_KEY`, type **Secret**: your Groq key
   - `APP_PASSCODE`, type **Secret**: any password you make up
   - (optional) `ALLOWED_ORIGINS`, type Text: your site address, by default `https://sazidmeowz.github.io`
4. **Copy the Worker URL.** It looks like `https://flowcraft-ai.<your-subdomain>.workers.dev`.
5. **Connect FlowCraft.** Open your deployed site → **Settings → AI connection**. Paste the URL and passcode, click **Save**, then **Test connection**. You should see "✓ FlowCraft AI is online."

Flow chat, the Copper Helper, the Sage, lessons and the memory filter now run on Groq (`openai/gpt-oss-120b` by default; change it with a `MODEL` variable). Never put the Groq key in `index.html`. It belongs only in the Worker secret.

## Data and privacy

Progress lives in your browser (or your Claude account when opened inside Claude). The Memory Book stores only academic and work items, and every imported item is shown for review before it's saved.
