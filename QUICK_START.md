# ⚡ Quick Start Guide

## 🎯 Goal
Get your dashboard live on the internet in 5 minutes.

## 📋 Prerequisites
- GitHub account (free)
- Git installed on your computer

## 🚀 Steps

### 1️⃣ Create GitHub Repo (2 min)
```bash
cd /Users/nictouron/roger_legal
git init
git add .
git commit -m "Initial commit: US Compliance Dashboard"
```

Go to https://github.com/new
- Name: `us-compliance-dashboard`
- Public or Private
- Click "Create repository"

```bash
git remote add origin https://github.com/YOUR-USERNAME/us-compliance-dashboard.git
git push -u origin main
```

### 2️⃣ Enable GitHub Pages (1 min)
1. Go to repo **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Click **Save**

### 3️⃣ Access Your Site (1 min)
Wait 30-60 seconds, then visit:
```
https://YOUR-USERNAME.github.io/us-compliance-dashboard/login.html
```

**Password**: `roger2025`

## ✅ Done\!

Your dashboard is now live on the internet.

---

## 📱 Features Overview

### Map View
- Click any state to see details
- Colors show compliance difficulty
- Green = easy, Red = avoid

### Market Strategy
- Check boxes to select tiers
- See your addressable market %
- Calculate implementation cost

### Data Table
- Search any state
- Sort by any column
- View detailed breakdown

### Resources
- Legal glossary
- Data sources
- Disclaimer

---

## 🔄 Update Data

Edit `data/states-data.json`:
```bash
git add data/states-data.json
git commit -m "Update legal data"
git push origin main
```

Changes live in 30 seconds\!

---

## 🔐 Change Password

1. Open browser console (F12)
2. Run:
```javascript
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
await hashPassword('YourNewPassword');
```
3. Copy the hash
4. Edit `login.html` line 61 with new hash
5. Commit and push

---

## 💡 Pro Tips

- **Bookmark**: `https://YOUR-USERNAME.github.io/REPO-NAME/login.html`
- **Mobile**: Works great on phones
- **Sharing**: Just send the URL + password
- **Updates**: Push to main → live in 30s
- **Backup**: Clone repo = instant backup

---

## ❓ Troubleshooting

**Can't login?**
- Check if JavaScript is enabled
- Try incognito mode
- Clear browser cache

**Site not loading?**
- Wait 2-3 minutes after first deploy
- Check GitHub Pages is enabled
- Verify URL includes `/login.html`

**Map not showing?**
- Check browser console (F12)
- Refresh the page
- Try different browser

---

## 📚 More Info

- **README.md** - Full project overview
- **DEPLOYMENT.md** - Detailed deployment guide
- **PROJECT_SPECS.md** - Technical specifications
- **SUMMARY.md** - Project completion summary

---

**Need help?** Check browser console (F12) for errors.

**Ready to deploy?** Follow Step 1 above\! 🚀
