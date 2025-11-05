# US Adult Content Compliance Dashboard

🗺️ Interactive dashboard for visualizing US state-by-state age verification requirements for adult content websites.

## 🎯 Project Overview

This tool helps answer critical business questions:
- Which states require age verification?
- What verification methods are acceptable per state?
- What are the penalties for non-compliance?
- What is the market reach vs compliance cost tradeoff?

## ✨ Features

- **Interactive US Map**: Color-coded by compliance tier, clickable states
- **Detailed State Pages**: Exact legal language (verbatim from statutes)
- **Market Strategy Builder**: Calculate addressable market by tier selection
- **Data Table**: Sortable, searchable table of all 50 states + DC
- **Password Protection**: Simple authentication for internal use

## 🚀 Quick Start

### Local Development
```bash
# No build process needed! Just serve the files:
python3 -m http.server 8000
# Or use any other static file server

# Then open: http://localhost:8000/login.html
```

**Default Password**: `roger2025`

### Deploy to GitHub Pages

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: US Compliance Dashboard"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from `main` branch
   - Save
   - Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

3. **Access Your Site**
   - Navigate to `https://YOUR-USERNAME.github.io/YOUR-REPO/login.html`
   - Enter password: `roger2025`

### Change Password

Edit `login.html` line 61, replace the hash with your own:

```javascript
// Generate new password hash in browser console:
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
await hashPassword('your-new-password');
```

## 📊 Data Sources

- **Legal Requirements**: Original research documents (info.rtf, legal_matrix_data.rtf)
- **Population Data**: US Census Bureau 2025 estimates (343M total)
- **LGBTQ+ Demographics**: Williams Institute, Gallup polls, MAP
- **Last Updated**: November 2025

## 🏗️ Tech Stack

- **Pure HTML/CSS/JavaScript** (no framework, no build step!)
- **Leaflet.js** for interactive maps (42kb)
- **Tailwind CSS** via CDN for styling
- **GitHub Pages** for hosting (free, auto-deploy)

**Total Dependencies**: 2 CDN links  
**Build Process**: None  
**Cost**: $0

## 📁 Project Structure

```
/roger_legal/
├── index.html                 # Main dashboard (auth-protected)
├── login.html                 # Password gate
├── js/
│   └── app.js                 # Application logic (400 lines)
├── data/
│   └── states-data.json       # All 51 jurisdictions with exact legal quotes
├── PROJECT_SPECS.md           # Comprehensive specifications
├── README.md                  # This file
└── .gitignore                 # Excludes .rtf source files

Excluded from repo (via .gitignore):
├── legal_matrix_data.rtf      # Original legal research
└── info.rtf                   # Legal summary notes
```

## 🎨 Tier System

- **Tier 0** (26 states): No ID requirements - 🟢 Green
- **Tier 1** (2 states): Credit cards allowed - 🔵 Blue  
- **Tier 2** (17 states): Transactional data methods - 🟡 Yellow
- **Tier 3** (4 states): Strict (IAL2, anonymous) - 🟠 Orange
- **Tier 4** (2 states): Very strict/unclear - 🔴 Red

## 📈 Key Insights

- **42% of US** (28 states) = Tier 0+1 (minimal compliance)
- **67% of US** (45 states) = Tier 0+1+2 (moderate compliance)
- **79% of US** (49 states) = All tiers except Tier 4
- **High LGBTQ+ states**: CA, NY, MA, NV, OR, VT, WA, DC

## 🔄 Updating Data

### Update Legal Information
1. Edit `data/states-data.json`
2. Update the `applicabilityExact`, `idRequirementsExact`, or `penaltiesExact` fields
3. Commit and push to `main` branch
4. GitHub Pages will auto-deploy in ~30 seconds

### Update Population
1. Edit the population numbers in `data/states-data.json`
2. Recalculate `populationPercent` (population / 343358059 * 100)
3. Commit and push

## ⚠️ Legal Disclaimer

This tool is for informational purposes only and does NOT constitute legal advice. Laws change, interpretations vary, and enforcement is unpredictable. Consult with a qualified attorney before making business decisions.

## 📝 Development Notes

- All state legal text is copied **verbatim** from source documents
- No paraphrasing or simplification in the data
- Population data from 2025 estimates
- Authentication is client-side (adequate for internal tool, not bank-grade security)

## 🤝 Contributing

Internal project. To suggest updates:
1. Fork the repository
2. Make changes to `data/states-data.json`
3. Submit pull request with source citations

## 📧 Contact

Internal tool for roger_legal project team.

---

**Last Updated**: November 2025  
**Data Version**: 1.0  
**Status**: ✅ Production Ready
