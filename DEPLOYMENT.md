# Deployment Guide: Glitch & Render

## Overview
The HK Vista: Atlas App is ready for free hosting on **Glitch** or **Render**. Both support Node.js apps and allow you to deploy directly from GitHub.

---

## Option 1: Deploy to Glitch (Easiest)

### Prerequisites
- GitHub account (for easy syncing, or use Glitch's built-in editor)
- No credit card required

### Steps

1. **Visit Glitch**
   - Go to [glitch.com](https://glitch.com)
   - Sign in with GitHub (or email)

2. **Create New Project**
   - Click **"New Project"** → **"Import from GitHub"**
   - Enter repository: `<your-github-username>/Atlas`
   - Click **"Import"**

3. **Glitch Auto-Setup**
   - Glitch will:
     - Read `package.json`
     - Install dependencies (`npm install`)
     - Start your app automatically
   - Watch the **logs** tab for startup confirmation

4. **Access Your App**
   - Glitch assigns a URL like: `https://your-app-name.glitch.me`
   - Click **"Share"** → **"Live Site"** to open it
   - Share this URL freely — it's your public app!

5. **(Optional) Keep App Awake**
   - Free Glitch apps sleep after 5 mins of inactivity
   - Use an uptime bot (e.g., [Uptimerobot.com](https://uptimerobot.com), free tier) to ping your app every 5 mins to keep it awake
   - Ping URL: `https://your-app-name.glitch.me/health`

### Redeploy After Changes
- Push code changes to GitHub → Glitch auto-pulls and restarts
- Or edit directly in Glitch's web editor (changes auto-save)

---

## Option 2: Deploy to Render (More Stable)

### Prerequisites
- GitHub account
- Render account ([render.com](https://render.com)) — free tier includes credit

### Steps

1. **Push Code to GitHub**
   - Ensure your `Atlas` repo is on GitHub with:
     - `package.json`
     - `server.js`
     - `routes/mtr.js`
     - `data/mtr_lines.json`
     - `public/index.html`
     - `render.yaml` (included in this setup)

2. **Visit Render Dashboard**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub

3. **Create New Service**
   - Click **"New+"** → **"Web Service"**
   - Select your GitHub repository (`Atlas`)
   - Choose branch: `main` (or your default branch)

4. **Configure Render Service**
   - **Name**: `hk-vista-atlas` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install` (auto-detected from `package.json`)
   - **Start Command**: `npm start` (auto-detected)
   - **Plan**: Select **Free** tier (default)
   - Click **"Create Web Service"**

5. **Auto-Deployment**
   - Render reads `render.yaml` and uses those settings
   - Service deploys automatically; watch the **Logs** tab
   - Once status is **"Live"**, your app is live!

6. **Access Your App**
   - Render assigns a URL like: `https://hk-vista-atlas.onrender.com`
   - Share freely!

7. **Keep App Awake (Optional)**
   - Free Render apps may sleep after 15 mins of inactivity
   - Use [Uptimerobot.com](https://uptimerobot.com) (free tier) to ping every 10 mins
   - Ping URL: `https://hk-vista-atlas.onrender.com/health`

### Redeploy After Changes
- Push to GitHub → Render auto-pulls and redeploys
- Or manually trigger **"Deploy latest commit"** in Render dashboard

---

## Comparison Table

| Feature | Glitch | Render |
|---------|--------|--------|
| **Free Tier** | Yes, no credit card | Yes, ~$5/mo credit (usually free for light use) |
| **Sleep Time** | 5 mins inactivity | 15 mins inactivity |
| **GitHub Integration** | Yes | Yes |
| **Custom Domain** | Paid upgrade | Paid upgrade |
| **Ease of Setup** | Very easy | Easy |
| **Performance** | Good for demos | Better for production |
| **Build Time** | ~30 sec | ~1-2 min |

---

## How to Set Up GitHub (if you don't have it there yet)

### 1. Initialize Git Locally
```bash
cd c:\Bittu\Atlas
git init
git add .
git commit -m "Initial commit: HK Vista Atlas App"
```

### 2. Create GitHub Repository
- Go to [github.com/new](https://github.com/new)
- Name: `Atlas`
- Description: `Hong Kong Tourism App — MTR Schedule Module`
- Select **Public** (so Glitch/Render can access)
- Click **"Create repository"**

### 3. Connect Local Repo to GitHub
```bash
git remote add origin https://github.com/<your-username>/Atlas.git
git branch -M main
git push -u origin main
```

### 4. Verify on GitHub
- Visit [github.com/your-username/Atlas](https://github.com/your-username/Atlas)
- All files should appear there

---

## Testing Your Deployment

Once live, test these URLs:

1. **Home Page**: `https://your-app.glitch.me/` (or `.onrender.com`)
   - Should load the UI with Line/Station dropdowns

2. **Health Check**: `https://your-app.glitch.me/health`
   - Should return `{ "status": "ok" }`

3. **Get Lines**: `https://your-app.glitch.me/api/mtr/lines`
   - Should return JSON with MTR line data

4. **Get Schedule** (example):
   ```
   https://your-app.glitch.me/api/mtr/schedule?line=TKL&sta=TKO&lang=en
   ```
   - Should return MTR schedule for Tseung Kwan O Line, Tseung Kwan O station

---

## Troubleshooting

### App Crashes or Won't Start
- Check **Logs** tab in Glitch/Render dashboard
- Common issues:
  - Missing `package.json` dependencies → run `npm install`
  - PORT not set → `server.js` defaults to 3000, should be fine
  - Missing routes file → ensure `routes/mtr.js` exists

### Upstream API Unreachable
- The CSDI API (https://rt.data.gov.hk/...) requires internet access
- If it's blocked: contact host support or try VPN from your region
- To test locally: `curl https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=TKO`

### App Goes to Sleep
- Expected on free tiers (Glitch: 5 mins, Render: 15 mins)
- Use Uptimerobot to keep it awake (ping `/health` endpoint every 5–10 mins)
- Or upgrade to a paid plan

---

## Next Steps

- **Add Traditional Chinese station names** to `data/mtr_lines.json` and update frontend to show TC text
- **Add more transport modules** (bus, tram, ferry) using additional CSDI APIs
- **Add a database** (e.g., MongoDB Atlas free tier) for user preferences or favorites
- **Deploy a mobile app** wrapper or PWA for better mobile UX

---

## Quick Links

- **Glitch**: https://glitch.com
- **Render**: https://render.com
- **Uptimerobot**: https://uptimerobot.com
- **CSDI API Docs**: https://data.gov.hk/en/
- **Hong Kong Open Data**: https://data.gov.hk/

---

**Happy deploying! 🚀**
