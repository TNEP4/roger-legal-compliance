# US Adult Content Compliance Dashboard - Project Specifications

## Executive Summary
Build a password-protected static web application to visualize US state-by-state age verification requirements for adult content websites, enabling data-driven decisions about market reach vs compliance costs for a gay male adult content platform.

---

## Phase 1: Data Collection & Structuring

### 1.1 Population Data Collection
**Source**: US Census Bureau 2024 estimates
- Collect current population for all 50 states + DC
- Calculate percentage of total US population per state
- Format: `{ state, population, populationPercent }`

### 1.2 LGBTQ+ Demographic Data
**Sources**: Williams Institute, Gallup polls, Census data
- Identify states with high LGBTQ+ population concentrations
- Use publicly available demographic studies
- Categorize as: `high | medium | low` based on:
  - % of population identifying as LGBTQ+
  - Major metropolitan areas with known gay communities (SF, NYC, LA, Seattle, Austin, etc.)
  - "Gayborhood" presence
- **Note**: General LGBTQ+ data acceptable as proxy for gay male population

### 1.3 Legal Requirements Data Structure

Based on analysis of `info.rtf` and `legal_matrix_data.rtf`, extract for each state:

```typescript
interface StateData {
  state: string;
  abbreviation: string;
  population: number;
  populationPercent: number;
  lgbtqDensity: "high" | "medium" | "low";
  
  legal: {
    tier: 0 | 1 | 2 | 3 | 4;
    idRequired: boolean;
    
    // EXACT QUOTES from legal_matrix_data.rtf - DO NOT PARAPHRASE
    applicabilityExact: string;  // Verbatim from "Applicability" column
    idRequirementsExact: string;  // Verbatim from "ID Requirements?" column
    penaltiesExact: string;  // Verbatim from "Penalties" column
    
    // Parsed/structured data for filtering and logic
    verificationMethods: {
      creditCard: boolean;
      digitizedId: boolean;
      governmentId: boolean;
      transactionalData: boolean;
      ial2Required: boolean;  // Arkansas, Georgia only
      photoMatching: boolean;  // Tennessee only
      anonymousOption: boolean;  // Florida only
      thirdPartyService: boolean;
      commercialDatabase: boolean;
    };
    
    penalties: {
      perViolation: string;
      perDay: string | null;
      ifMinorAccesses: string | null;
      privateRightOfAction: boolean;
      attorneyFees: boolean;
      civilOnly: boolean;
    };
    
    citation: string;
    effectiveDate: string | null;
    notes: string;  // Special circumstances
  };
  
  marketability: {
    tier: number;
    cumulativePopulation: number;  // Calculated later
    implementationCost: "none" | "low" | "medium" | "high" | "very-high";
    legalRisk: "none" | "low" | "medium" | "high" | "very-high";
  };
}
```

---

## Phase 2: State Tier Classification System

### Tier Classification (Based on Document Analysis)

**Tier 0: No Requirements** (23 states)
- **States**: Alaska, California*, Colorado, Connecticut, Hawaii, Illinois, Iowa, Maine, Maryland, Massachusetts, Michigan, Minnesota, Nevada, New Hampshire, New Jersey, New Mexico, New York, Ohio, Oregon, Pennsylvania, Rhode Island, Vermont, Washington, Wisconsin
- **Implementation**: None required
- **Risk**: Minimal to none
- **Market**: ~40% of US population
- **Notes**: 
  - *California AB 1043 (Jan 2027) targets OS/app stores, NOT websites
  - Some states have proposed bills pending

**Tier 1: Credit Card Verification Allowed** (3 states)
- **States**: South Dakota, Wyoming, Nebraska
- **Implementation**: Simple credit card age check (must require 18+)
- **Cost**: Low (standard payment processing)
- **Market**: ~2% of US population
- **Methods**: Credit cards, financial documents (Nebraska)

**Tier 2: Transactional Data Methods** (14 states)
- **States**: Arizona, Kansas, Kentucky, Louisiana, Mississippi, Missouri, Montana, North Carolina, North Dakota, Oklahoma, South Carolina, Tennessee, Texas, Utah, Virginia
- **Implementation**: Commercial age verification service with transactional data
- **Cost**: Medium (third-party service fees)
- **Penalties**: $5,000-$10,000 per violation typical; TX/AZ have $250k if minors access
- **Market**: ~25% of US population
- **Methods**: 
  - Digitized ID
  - Government-issued ID
  - Commercial databases
  - Public/private transactional data
  - Third-party verification services

**Tier 3: Standard Strict Verification** (9 states)
- **States**: Alabama, Florida, Georgia, Idaho, Indiana, Arkansas
- **Implementation**: Professional age verification with multiple options
- **Cost**: Medium-High
- **Penalties**: $5,000-$50,000 per violation
- **Special Requirements**:
  - Florida: Must offer both anonymous AND standard methods
  - Arkansas/Georgia: IAL2 (Identity Assurance Level 2) certification required
- **Market**: ~12% of US population

**Tier 4: Highest Risk / Unclear** (2 states)
- **States**: Delaware, Tennessee
- **Why Tier 4**:
  - **Delaware**: Law language unclear if applies to websites
  - **Tennessee**: Requires photo matching of active user + 7-year data retention
- **Implementation**: Very complex or risky
- **Cost**: High
- **Recommendation**: Avoid or geo-block

### Cumulative Market Analysis

| Tier | States | Est. Pop % | Cumulative % | Implementation | Cost Level |
|------|---------|-----------|--------------|----------------|------------|
| 0 | 23 | ~40% | 40% | None | $0 |
| 0+1 | 26 | ~42% | 42% | Credit card | $-$$|
| 0+1+2 | 40 | ~67% | 67% | +Commercial service | $$-$$$ |
| 0+1+2+3 | 46 | ~79% | 79% | +IAL2/Anonymous | $$$-$$$$ |

---

## Phase 3: Technology Stack (Simplified)

### Core Stack - Vanilla JavaScript (No Framework)
**Selected**: Pure HTML + CSS + JavaScript (ES6+)
- **Why**: 
  - Zero build step needed
  - Instant deployment
  - No dependencies to maintain
  - Faster load times
  - Easier to understand and modify
  - Works everywhere
- **No React/Vue/framework overhead**

### Styling
**Selected**: Tailwind CSS via CDN
- **Why**: Fast development, no build step, just add CDN link
- **CDN**: `<script src="https://cdn.tailwindcss.com"></script>`
- **Alternative**: Simple custom CSS (even simpler)

### Interactive Map
**Selected**: Leaflet.js (vanilla) via CDN
- **Why**: 
  - No framework wrapper needed
  - Just 42kb
  - Works with plain JavaScript
  - Free, open source
  - US states GeoJSON loaded from local file
- **CDN**: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`

### Data Storage
**Selected**: Single `states-data.json` file
- Loaded via `fetch()` in JavaScript
- No build step, just edit JSON file
- Easy updates via GitHub

### Authentication
**Selected**: GitHub Pages with simple password gate
- **Implementation**: 
  - Simple HTML password form
  - Check password against hash in localStorage
  - Use `crypto.subtle.digest()` for SHA-256 hashing (built-in browser API)
  - Session stored in localStorage
- **Why**: 
  - Zero backend
  - Built-in with GitHub Pages
  - Good enough for internal tool

### Hosting & Deployment
**Selected**: GitHub Pages (FREE)
- **Why**:
  - Completely free
  - Auto-deploys on push to main branch
  - Custom domain support (free)
  - HTTPS by default
  - No configuration needed
  - Perfect for static sites
- **Setup**: Just enable GitHub Pages in repo settings → Deploy from main branch
- **URL**: `https://[username].github.io/[repo-name]`
- **Build**: Not needed! Just push HTML/CSS/JS files

### File Structure (Simple)
```
/repo-root
  index.html           (main page)
  login.html           (password gate)
  /css
    styles.css         (custom styles if needed)
  /js
    app.js             (main application)
    auth.js            (password handling)
    map.js             (map logic)
  /data
    states-data.json   (all state data)
    us-states.json     (GeoJSON boundaries)
  README.md
```

### Total Dependencies: 2 CDN links
1. Tailwind CSS (optional - can use plain CSS)
2. Leaflet.js (for maps)

### Deployment Process
1. Commit changes to `main` branch
2. Push to GitHub
3. **Done** - GitHub Pages auto-deploys in ~30 seconds

### Build Process
**NONE** - Just edit files and push

---

## Phase 4: Website Features

### 4.1 Interactive Map View (Primary Interface)

**Features**:
- US map with state boundaries
- Color-coded by tier:
  - Tier 0: Green (#10b981)
  - Tier 1: Light Blue (#3b82f6)
  - Tier 2: Yellow (#eab308)
  - Tier 3: Orange (#f97316)
  - Tier 4: Red (#ef4444)
- **Hover state**: Tooltip showing:
  - State name
  - Tier
  - Population %
  - LGBTQ+ density
  - ID required (Y/N)
- **Click state**: Opens detailed side panel
- **Legend**: Color key + market % for each tier
- **Toggle layers**:
  - LGBTQ+ density overlay (heatmap style)
  - Population size (state size proportional)

### 4.2 State Detail Panel

**Triggered by**: Clicking state on map or selecting from dropdown

**Contents**:
- State name + flag emoji
- Population & % of US
- LGBTQ+ density indicator
- **Legal Summary**:
  - Tier badge (color-coded)
  - ID Required: Yes/No
  - Effective date
  
- **Exact Legal Language** (Primary - in expandable sections):
  - **Applicability** (verbatim quote from legal_matrix_data.rtf)
  - **ID Requirements** (verbatim quote from legal_matrix_data.rtf)
  - **Penalties** (verbatim quote from legal_matrix_data.rtf)
  - **Citation**: Statute reference
  
- **Quick Reference** (Parsed for convenience):
  - **Verification Methods Accepted**:
    - Checkbox list of allowed methods
    - Highlight easiest method
  - **Penalties Summary**:
    - Per violation amount
    - Per day (if applicable)
    - If minor accesses
    - Private right of action?
    - Attorney fees?
    
- **Implementation Guidance**:
  - What you need to do to comply
  - Recommended third-party services
  - Estimated cost range
  - Risk Assessment: Visual indicator (Low/Med/High)
  
- **Notes**: Special circumstances or clarifications

### 4.3 Market Strategy Dashboard

**Purpose**: Help decide which tiers to support

**Features**:
- **Scenario Builder**:
  - Checkboxes for each tier
  - Real-time updates showing:
    - Total addressable market (% + absolute population)
    - Number of states covered
    - Estimated implementation cost
    - Combined legal risk score
- **Tier Comparison Table**:
  - Side-by-side comparison of all 5 tiers
  - Columns: States, Pop %, Methods, Avg Penalty, Cost, Risk
- **Recommended Strategies** (pre-calculated):
  - "Low-hanging fruit": Tier 0+1 (42%, minimal cost)
  - "Balanced approach": Tier 0+1+2 (67%, moderate cost)
  - "Maximum reach": All tiers (79%, high cost)
- **Cost Estimator**:
  - Input: Expected monthly users
  - Output: Estimated verification service costs per tier
- **LGBTQ+ Market Focus**:
  - Filter to show only high/medium LGBTQ+ density states
  - Recalculate market % for target demographic

### 4.4 Data Table View

**Features**:
- Sortable table (all 50 states + DC)
- Columns (show/hide toggles):
  - State
  - Tier
  - Population %
  - LGBTQ+ Density
  - ID Required
  - Credit Card OK
  - Max Penalty
  - Legal Risk
- **Filters**:
  - By tier (multi-select)
  - By LGBTQ+ density
  - ID required (yes/no/either)
  - Credit card allowed
  - By penalty range
- **Search**: Free text state name search
- **Export**: Download filtered results as CSV
- **Bulk actions**: Select multiple states to see combined market %

### 4.5 Resources & Context

**Content**:
- **Glossary**:
  - What is "material harmful to minors"?
  - What is IAL2?
  - What is "transactional data"?
  - What is "commercially reasonable"?
- **Verification Service Directory**:
  - List of third-party age verification providers
  - Cost estimates
  - Tier compatibility
- **Legal Disclaimer**:
  - "This is not legal advice"
  - "Consult attorney before launching"
  - Last updated date
- **Data Sources**:
  - Links to original statutes
  - Census data source
  - LGBTQ+ demographic sources
  - Document provenance

### 4.6 Password Protection

**Implementation**:
- Landing page with single password field
- Password stored as env variable during build
- Cloudflare Pages Access for edge-level protection
- Session persists in localStorage (24hr expiry)
- No user registration/accounts needed
- Single shared password for team access

---

## Phase 5: Detailed Data Requirements

### 5.1 State Legal Data Extraction

**CRITICAL: For each state, extract EXACT QUOTES from `legal_matrix_data.rtf`**:

**Primary Data (Verbatim Extraction - DO NOT PARAPHRASE)**:
1. **ID Required**: Boolean (from "ID Req?" column: Yes/No)
2. **applicabilityExact**: Copy ENTIRE text from "Applicability" column verbatim
   - Include all line breaks and formatting
   - If column shows "-", store as "-"
   - Do not summarize or interpret
3. **idRequirementsExact**: Copy ENTIRE text from "ID Requirements?" column verbatim
   - Include all bullet points and sub-items
   - Preserve exact legal language
   - If column shows "-", store as "-"
4. **penaltiesExact**: Copy ENTIRE text from "Penalties" column verbatim
   - Include all dollar amounts exactly as written
   - Include all "AND" clauses
   - Preserve line breaks
   - If column shows "-", store as "-"
5. **Citation**: Exact statute reference (e.g., "HB 164", "18-701", "A.C.A. § 4-88-1305")

**Secondary Data (Parsed for UI Logic)**:
6. **Verification Methods** (Boolean flags parsed from idRequirementsExact):
   - creditCard: true if mentions "credit card" or "debit card"
   - digitizedId: true if mentions "digitized ID" or "digitized identification"
   - governmentId: true if mentions "government-issued ID"
   - transactionalData: true if mentions "transactional data"
   - ial2Required: true if mentions "IAL2" or "Identity Assurance Level 2"
   - photoMatching: true if mentions "photograph" or "photo matching"
   - anonymousOption: true if mentions "anonymous"
   - thirdPartyService: true if mentions "third-party" or "independent third-party"
   - commercialDatabase: true if mentions "commercial database"
7. **Penalties** (Parsed structure from penaltiesExact):
   - perViolation: Dollar amount (e.g., "$10,000 per violation")
   - perDay: Dollar amount if mentions "per day"
   - ifMinorAccesses: Dollar amount if mentions "if minor" or "minors access"
   - privateRightOfAction: true if mentions "private" or "individual may"
   - attorneyFees: true if mentions "attorney fees" or "attorney's fees"
   - civilOnly: true if only civil penalties (no criminal)
8. **Notes**: Special circumstances, caveats, or clarifications from document

**Data Quality Rules**:
- NEVER paraphrase legal language
- NEVER "clean up" or simplify quotes
- NEVER merge multiple sentences
- ALWAYS preserve exact punctuation and capitalization
- If unsure about column boundaries, include full text

### 5.2 Population Data Sources

**Primary Source**: US Census Bureau
- URL: https://www.census.gov/data/tables/time-series/demo/popest/2020s-state-total.html
- Use 2024 estimates (latest available)
- Include DC as separate entity
- Calculate percentages based on total US population

### 5.3 LGBTQ+ Demographic Data Sources

**Sources**:
1. Williams Institute UCLA - LGBTQ demographic studies
2. Gallup Daily Tracking Poll - LGBT identification by state
3. US Census Bureau - Same-sex couple household data
4. Movement Advancement Project (MAP)

**Classification criteria**:
- **High**: >5% LGBTQ+ population OR major gay neighborhoods (SF, NYC, LA, Seattle, Austin, Portland, Denver, Chicago, etc.)
- **Medium**: 3.5-5% OR medium-sized cities with visible communities
- **Low**: <3.5% OR primarily rural

### 5.4 Data Quality Assurance

**Validation steps**:
1. All 50 states + DC accounted for
2. Population percentages sum to 100%
3. Every state has tier assignment (0-4)
4. States marked "ID Required: Yes" must have verification methods
5. States with penalties must have tier ≥1
6. Cross-reference info.rtf lists against legal_matrix_data.rtf
7. Manual legal review of high-penalty states (AZ, TX, FL, KS)

---

## Phase 6: Visual Design Specifications

### Color Palette

**Tier Colors**:
- Tier 0: `#10b981` (green-500) - Go
- Tier 1: `#3b82f6` (blue-500) - Easy
- Tier 2: `#eab308` (yellow-500) - Moderate
- Tier 3: `#f97316` (orange-500) - Complex
- Tier 4: `#ef4444` (red-500) - Avoid

**UI Colors**:
- Background: `#f9fafb` (gray-50)
- Cards: `#ffffff` (white)
- Text primary: `#111827` (gray-900)
- Text secondary: `#6b7280` (gray-500)
- Borders: `#e5e7eb` (gray-200)
- Accent: `#8b5cf6` (violet-500)

**LGBTQ+ Density Overlay**:
- High: Rainbow gradient or `#ec4899` (pink-500)
- Medium: `#f9a8d4` (pink-300)
- Low: `#fce7f3` (pink-100)

### Typography
- **Headers**: Inter font family, 600-700 weight
- **Body**: Inter font family, 400 weight
- **Mono/Code**: JetBrains Mono for citations/legal codes

### Layout
- **Responsive breakpoints**: Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Map**: Full height on desktop, 60vh on mobile
- **Side panel**: 400px width, slide-in on mobile
- **Max content width**: 1400px

### Accessibility
- WCAG 2.1 AA compliance
- Color contrast ratios ≥4.5:1 for text
- Keyboard navigation for all interactive elements
- ARIA labels on map states
- Focus indicators visible
- Screen reader friendly

---

## Phase 7: Implementation Steps

### Step 1: Project Setup (30 minutes)
1. Create GitHub repository
2. Enable GitHub Pages in repo settings (Settings → Pages → Deploy from main branch)
3. Create basic file structure:
   ```
   /repo-root
     index.html
     login.html
     /css
       styles.css (optional)
     /js
       app.js
       auth.js
       map.js
     /data
       states-data.json (empty for now)
       us-states.json (download US GeoJSON)
     README.md
   ```
4. Create basic `index.html` with CDN links:
   - Leaflet CSS + JS
   - Tailwind CSS
5. Test deploy: push to main, verify site loads at GitHub Pages URL

### Step 2: Data Collection & Structuring (2-3 days)
1. Define JSON schema (no TypeScript interfaces needed)
2. **CRITICAL**: Parse legal_matrix_data.rtf extracting VERBATIM quotes:
   - Convert RTF to clean text format
   - Extract each state's row
   - Copy exact text from Applicability, ID Requirements, and Penalties columns
   - DO NOT paraphrase or summarize
   - Preserve all formatting, line breaks, bullet points
3. Parse extracted quotes to set boolean flags for filtering
4. Fetch population data from Census Bureau
5. Research LGBTQ+ demographic data
6. Manually classify all 51 entities (50 states + DC) into tiers
7. Validate data completeness:
   - All 51 entities present
   - All verbatim quotes captured
   - All parsed flags match verbatim text
8. Save as `data/states-data.json`

### Step 3: Password Gate (30 minutes)
1. Create `login.html` with simple password form
2. Create `js/auth.js`:
   - Hash password with SHA-256
   - Compare with hardcoded hash
   - Store session in localStorage
3. Add auth check to `index.html` on page load

### Step 4: Map Component (1 day)
1. Download US states GeoJSON → `data/us-states.json`
2. Initialize Leaflet map in `js/map.js`
3. Color states by tier (getColor function)
4. Implement hover tooltips (Leaflet popup)
5. Implement click → show state detail
6. Add legend (Leaflet control)
7. Test mobile responsiveness

### Step 5: State Detail Panel (1 day)
1. Create sliding panel HTML in `index.html`
2. Add show/hide functions in `js/app.js`
3. Display state data from JSON
4. Format verbatim quotes in expandable sections
5. Display parsed data (methods, penalties)
6. Add close button

### Step 6: Market Strategy Dashboard (1 day)
1. Add dashboard HTML section
2. Create tier checkboxes
3. Calculate market reach in real-time (vanilla JS)
4. Display tier comparison table
5. Show recommended strategies
6. Add simple cost calculator

### Step 7: Data Table View (1 day)
1. Add table HTML with all states
2. Implement sort functions (vanilla JS)
3. Add search input with filter
4. Add CSV export button (generate CSV client-side)
5. Show selected market % calculation

### Step 8: Resources Page (30 minutes)
1. Add glossary section to `index.html`
2. Add legal disclaimer
3. Add data sources
4. Add last updated date

### Step 9: Deployment (AUTOMATIC)
1. Commit all files to main branch
2. Push to GitHub
3. **Done** - GitHub Pages auto-deploys

### Step 10: Testing & Refinement (1 day)
1. Test on Chrome, Firefox, Safari
2. Test on mobile devices
3. Check all links and interactions
4. Verify data accuracy (spot check)
5. Test password protection

**Total Estimated Timeline**: 7-9 days (almost half the original!)

---

## Phase 8: Maintenance & Updates

### Regular Updates Needed
1. **Legal changes**: Monitor state legislatures for new laws (quarterly)
2. **Population data**: Update annually with Census releases
3. **Verification services**: Keep provider directory current
4. **Effective dates**: Mark when laws go into effect

### Update Process
1. Edit `data/states-data.json` directly (or any HTML/JS file)
2. Git commit with change description
3. Push to main branch
4. **GitHub Pages auto-deploys in ~30 seconds**

### Data Versioning
- Track last updated date in app
- Maintain changelog.md
- Consider data schema versioning

---

## Technical Specifications Summary

### Performance Targets
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Lighthouse Score**: >90
- **Bundle size**: <200kb (gzipped)

### Browser Support
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions (12+)
- Mobile Safari/Chrome: Last 2 versions
- All modern browsers with ES6+ support

### Security
- **HTTPS**: Automatic with GitHub Pages
- **Password protection**: SHA-256 hashing (browser crypto API)
- **No backend**: No server vulnerabilities
- **Static files only**: No code execution on server
- **Note**: This is basic security suitable for internal tool, not financial data

### SEO
- Not applicable (password protected, internal tool)
- Add `<meta name="robots" content="noindex">` to prevent indexing

---

## Success Metrics

### Business Goals
1. Identify optimal tier for market/cost tradeoff
2. Understand exact legal requirements per state
3. Estimate implementation costs accurately
4. Prioritize states by LGBTQ+ market potential

### Technical Goals
1. Fast, responsive interface
2. Accurate, up-to-date data
3. Easy to update/maintain
4. Accessible to non-technical stakeholders

---

## Open Questions & Decisions Needed

### Resolved Based on Document Analysis
1. ✅ **Data structure**: Comprehensive structure with verbatim quotes defined
2. ✅ **Tier system**: 5-tier system (0-4) based on actual legal requirements
3. ✅ **Tech stack**: Vanilla JS + Leaflet + Tailwind (CDN) + GitHub Pages (FREE, auto-deploy)
4. ✅ **Features**: All features clearly defined
5. ✅ **Timeline priority**: Data collection first, then map, then dashboard
6. ✅ **Deployment**: GitHub Pages - free, automatic on push to main branch

### Remaining Questions
6. **Hotspot data**: General LGBTQ+ population data acceptable, or need specific gay male data? 
   - **Recommendation**: Use general LGBTQ+ as proxy (more data available)
7. **Password protection**: Simple shared password acceptable, or need user accounts?
   - **Recommendation**: Shared password (simpler, adequate for internal tool)
8. **Custom domain**: Do you have a domain, or use `github.io` subdomain?
   - **GitHub Pages supports custom domains for free**
9. **Cost estimator**: What third-party verification services should we price out?
10. **Legal review**: Should we have attorney review final data before launch?
11. **GitHub repo**: Should this be public or private repository?
   - **GitHub Pages works with both, but private repos require GitHub Pro (or make repo public)**

---

## Risk Mitigation

### Legal Risks
- Include prominent disclaimer: "Not legal advice"
- Source all data with citations
- Recommend attorney consultation before launch
- Keep data updated with legislative changes

### Technical Risks
- **Static site** = no backend vulnerabilities
- **Password protection** = basic security, suitable for internal tool
- **GitHub Pages** = reliable, 99.9%+ uptime, backed by Microsoft
- **Vanilla JS** = works everywhere, no framework dependencies to break
- **CDN resources** = using unpkg.com and Tailwind CDN (both highly reliable)

### Data Accuracy Risks
- Manual review of high-impact states (TX, FL, CA, NY)
- Cross-reference multiple sources
- Highlight uncertain interpretations (e.g., Delaware)
- Include last-updated timestamp
- Document data sources transparently

---

## Next Steps

1. **Review & approve** these specifications
2. **Answer remaining questions** (items 6-10 above)
3. **Prioritize features** (MVP vs nice-to-have)
4. **Begin data extraction** from legal documents
5. **Set up development environment**

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-05  
**Status**: Awaiting approval
