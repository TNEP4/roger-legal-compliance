// US Adult Content Compliance Dashboard
// Main application JavaScript

let statesData = [];
let map = null;
let geojsonLayer = null;

// Legal glossary data
const legalGlossary = {
  'IAL2': {
    term: 'IAL2 (Identity Assurance Level 2)',
    simple: 'Strong ID verification using government documents plus a selfie. Required by Arkansas and Georgia.',
    intermediate: 'A federal government standard (NIST) for proving someone\'s identity online with "high confidence." Requires multiple types of proof including photo ID and biometric verification (like face matching).',
    detailed: `<strong>Official Standard:</strong> NIST Special Publication 800-63A<br>
<strong>Evidence Required:</strong> One STRONG + one FAIR piece of evidence, OR one SUPERIOR piece<br>
<strong>Typical Process:</strong><br>
• Personal information (name, DOB, address)<br>
• Government-issued photo ID (driver's license, passport)<br>
• Biometric verification (live selfie matched to ID photo)<br>
• Background database checks<br><br>
<strong>Why it's strict:</strong> Designed to prevent impersonation attacks and identity fraud at government-level security. More rigorous than typical e-commerce verification.<br><br>
<strong>Cost implication:</strong> Requires specialized third-party services ($1-5 per verification). Cannot be done with simple credit card checks.`
  },
  'Transactional Data': {
    term: 'Transactional Data',
    simple: 'Records from business transactions and databases that can prove someone\'s age. Examples: mortgage records, employment history, education records.',
    intermediate: '"A sequence of information that documents an exchange, agreement, or transfer between an individual, commercial entity, or third party." Used by third-party age verification companies that access commercial databases containing adult records.',
    detailed: `<strong>Legal Definition (from statutes):</strong> "Public or private transactional data" means records documenting exchanges, agreements, or transfers that can verify age.<br><br>
<strong>Specific Examples from State Laws:</strong><br>
• Mortgage/property records (must be 18+ to sign)<br>
• Employment records (W-2s, payroll data)<br>
• Educational records (college enrollment)<br>
• Utility bills, insurance policies<br>
• Commercial database entries<br><br>
<strong>How it works:</strong> Third-party services (like Yoti, Veriff, ID.me) check if your name/DOB appears in these adult-only databases.<br><br>
<strong>The Credit Card Question:</strong> Most statutes say "public or private transactional data" but DON'T explicitly say if credit cards count. Only South Dakota, Wyoming, and Nebraska explicitly allow credit cards. Other states remain unclear.<br><br>
<strong>Implementation:</strong> Typically costs $0.05-0.25 per verification through specialized vendors.`
  },
  'Credit Card': {
    term: 'Credit Card Verification',
    simple: 'Using credit card information to verify age, based on the assumption that only adults can obtain credit cards.',
    intermediate: 'Age verification by checking credit card ownership. Only 3 states (South Dakota, Wyoming, Nebraska) explicitly allow this method.',
    detailed: `<strong>How it works:</strong> Verifies that a user possesses a valid credit card, which theoretically requires being 18+.<br><br>
<strong>Legal Status:</strong> Most states with age verification laws do NOT explicitly mention credit cards as acceptable. Only South Dakota, Wyoming, and Nebraska clearly allow them.<br><br>
<strong>The Problem:</strong> Unclear if this counts as "transactional data" or "commercially reasonable method" in other states.<br><br>
<strong>Risk:</strong> May not be compliant in most jurisdictions with age verification requirements.`
  },
  'Photo ID': {
    term: 'Photo ID Matching',
    simple: 'Comparing a live photo or selfie to a government-issued photo ID to verify identity and age.',
    intermediate: 'Biometric verification that matches a live selfie to a photo ID. Often required alongside other verification methods for strict compliance.',
    detailed: `<strong>Process:</strong> User takes a photo of their government ID, then takes a live selfie. Software compares the two using facial recognition technology.<br><br>
<strong>When Required:</strong> Essential for IAL2 compliance (Arkansas, Georgia). Often part of strict verification in Tier 3-4 states.<br><br>
<strong>Technology:</strong> Uses AI/ML for facial matching, liveness detection (to prevent photo of a photo), and document authentication.<br><br>
<strong>Accuracy:</strong> Modern systems can achieve 95%+ accuracy but may have bias issues across demographics.<br><br>
<strong>Privacy Concerns:</strong> Requires collection of biometric data, which some states regulate separately.`
  },
  'Digital ID': {
    term: 'Digital ID / Digitized ID',
    simple: 'A digital version of your driver\'s license or ID card, often in a mobile app.',
    intermediate: 'A verified digital credential (like Apple Wallet ID or state-specific apps) that proves your identity and age without sharing your actual ID document.',
    detailed: `<strong>Types:</strong><br>
• <em>State-issued mobile IDs</em>: Official digital versions of driver's licenses (e.g., Arizona, Colorado, Maryland apps)<br>
• <em>Third-party digital IDs</em>: Verified credentials from services like Clear, ID.me<br>
• <em>Scanned/photo IDs</em>: Pictures of physical IDs (least secure, often not accepted)<br><br>
<strong>Arizona's specific requirement:</strong> Digital ID that "does not cause information to be transmitted to a governmental entity" - meaning privacy-preserving verification.<br><br>
<strong>How they work:</strong> Use cryptographic signatures to prove authenticity without exposing your full ID. Some use zero-knowledge proofs (only share "over 18" boolean, not your exact age).<br><br>
<strong>Adoption:</strong> Still emerging technology. Not all states have digital ID programs yet.`
  },
  'Material Harmful to Minors': {
    term: 'Material Harmful to Minors',
    simple: 'Sexual content that\'s inappropriate for people under 18.',
    intermediate: 'Content depicting sexual acts that\'s offensive by community standards and has no serious value for minors. Based on the "Miller test" but modified for minors.',
    detailed: `A three-part legal test (modified Miller test) where ALL three must be true:<br>
1. The average person, using contemporary community standards, would find it appeals to minors' prurient (shameful/morbid) interest in sex<br>
2. It depicts sexual conduct in a patently offensive way for minors<br>
3. It lacks serious literary, artistic, political, or scientific value <em>for minors</em><br><br>
<strong>Key difference from adult obscenity:</strong> Each prong adds "for minors" - so material can be legal for adults but "harmful to minors."`
  },
  'Bank Account': {
    term: 'Bank Account Verification',
    simple: 'Using bank account ownership to verify age, as you typically must be 18+ to open a bank account.',
    intermediate: 'Age verification by confirming ownership of a bank account. Only South Dakota explicitly allows this method.',
    detailed: `<strong>How it works:</strong> Verifies ownership of an active bank account, which typically requires being 18 or older.<br><br>
<strong>Legal Status:</strong> Only South Dakota explicitly mentions bank account information as an acceptable verification method.<br><br>
<strong>Process:</strong> User may need to provide bank account details or complete a micro-deposit verification.<br><br>
<strong>Privacy Concerns:</strong> Requires sharing financial information, which some users may be reluctant to provide.`
  },
  'Financial Document': {
    term: 'Financial Document Verification',
    simple: 'Documents that prove you\'re an adult, like mortgage papers or tax forms.',
    intermediate: 'Using financial records as proof of age. Documents that typically only adults possess can serve as age proxies.',
    detailed: `<strong>Nebraska's Specific Language:</strong> "Financial document or other document that is a reliable proxy for age"<br><br>
<strong>Examples:</strong><br>
• Mortgage or property deed (must be 18+ to sign)<br>
• Tax returns (W-2, 1099)<br>
• Insurance policies<br>
• Loan agreements<br><br>
<strong>How it works:</strong> User uploads or shares proof of possessing adult-only financial documents.<br><br>
<strong>Legal Status:</strong> Only Nebraska explicitly allows "financial documents" as a verification method.<br><br>
<strong>Reliability:</strong> Very high - these documents require legal capacity (18+) to obtain.`
  },
  'Punitive Damages': {
    term: 'Punitive Damages',
    simple: 'Extra money awarded to punish bad behavior, not just compensate for harm.',
    intermediate: 'Damages awarded to punish wrongdoing and deter future violations, beyond just making the victim whole. Higher than actual damages.',
    detailed: `<strong>Purpose:</strong> To punish egregious conduct and deter similar behavior by others.<br><br>
<strong>When Awarded:</strong> For willful, malicious, or reckless violations. Not just accidents or negligence.<br><br>
<strong>States Allowing:</strong> Florida, North Carolina, South Carolina<br><br>
<strong>Florida:</strong> "Consistent pattern of conduct may lead to punitive damages"<br>
<strong>North Carolina:</strong> Explicitly includes punitive damages in remedies<br>
<strong>South Carolina:</strong> "Liability for punitive damages when a minor is affected"<br><br>
<strong>Financial Impact:</strong> Can be substantial - often multiple times actual damages. No caps specified in these states' age verification laws.`
  },
  'Injunctive Relief': {
    term: 'Injunctive Relief',
    simple: 'A court order forcing you to do something (or stop doing something).',
    intermediate: 'A court-ordered remedy requiring a party to perform or refrain from specific actions. Can shut down non-compliant services.',
    detailed: `<strong>Types:</strong><br>
• <em>Preliminary Injunction:</em> Temporary order while case is pending<br>
• <em>Permanent Injunction:</em> Final order after judgment<br><br>
<strong>States Allowing:</strong> North Carolina, North Dakota, Oklahoma, South Carolina<br><br>
<strong>What it Means:</strong> Attorney General or affected parties can ask a court to:<br>
• Stop operations until compliance is achieved<br>
• Require implementation of specific verification measures<br>
• Block access to the service in the state<br><br>
<strong>Risk:</strong> Can force immediate service shutdown or geo-blocking, even before trial. Often faster than waiting for monetary damages.<br><br>
<strong>Standard:</strong> Usually requires showing "irreparable harm" (ongoing minors' access) and likelihood of success on merits.`
  },
  'Statutory Damages': {
    term: 'Statutory Damages',
    simple: 'A fixed dollar amount set by law, without needing to prove actual harm.',
    intermediate: 'Pre-determined damage amounts specified in the statute. Don\'t need to prove actual financial loss to recover.',
    detailed: `<strong>Advantage for Plaintiffs:</strong> Don't need to prove actual damages - just the violation. Makes lawsuits easier to win.<br><br>
<strong>Idaho:</strong> "$10,000 in statutory damages plus court costs and attorney fees"<br>
• Per violation or per instance<br>
• Plus actual damages if proven<br>
• Plus attorney fees<br><br>
<strong>Kansas:</strong> "$50,000 or more in statutory damages"<br>
• Applies to private right of action<br>
• "Or more" suggests no cap<br>
• Plus actual damages<br>
• Plus attorney fees<br><br>
<strong>Why It Matters:</strong> Even if a business can show no one was actually harmed, they still owe the statutory amount. Makes compliance failures very expensive.<br><br>
<strong>Comparison:</strong> Most states only allow "actual damages" (proving real financial harm), which is harder.`
  },
  'Commercially Reasonable Software': {
    term: 'Commercially Reasonable Software',
    simple: 'Any reasonable age verification software, app, or method that confirms someone is 18+.',
    intermediate: 'Catch-all term in many state laws for age verification technology that is "commercially reasonable" - meaning widely available, reliable, and standard in the industry.',
    detailed: `<strong>Legal Language:</strong> "Any commercially available software, application, program, or methodology that, when enabled, provides reasonable assurances that any individual accessing certain published material is 18 years of age or older."<br><br>
<strong>What qualifies as "commercially reasonable":</strong><br>
• Widely available verification services (Yoti, Veriff, ID.me, AgeChecker.net)<br>
• Uses standard verification methods (transactional data, ID verification)<br>
• Provides "reasonable assurances" of age (doesn't need to be 100% perfect)<br>
• Cost-effective and practical for businesses to implement<br><br>
<strong>States using this language:</strong> 20+ states including Alabama, Arizona, Arkansas, Florida, Georgia, Kansas, Kentucky, Louisiana, Mississippi, Missouri, Montana, Nebraska, North Carolina, North Dakota, Oklahoma, South Carolina, Tennessee, Texas, Utah, Virginia<br><br>
<strong>Why it's broad:</strong> Gives flexibility for evolving technology and doesn't mandate one specific vendor or method.<br><br>
<strong>Typical implementation:</strong> Third-party age verification services that check multiple data sources ($0.05-2.00 per verification).`
  },
  'Third-Party Service': {
    term: 'Third-Party Age Verification Service',
    simple: 'An outside company that specializes in age verification (like Yoti, Veriff, or ID.me).',
    intermediate: 'Independent verification companies that check age using multiple methods: government databases, transactional records, ID verification, biometrics.',
    detailed: `<strong>How they work:</strong> User provides information to a third-party service (not directly to your website), which verifies age and returns only a yes/no result.<br><br>
<strong>Common providers:</strong><br>
• <em>Yoti</em> - Digital ID and age estimation<br>
• <em>Veriff</em> - Document verification and biometrics<br>
• <em>ID.me</em> - Government-grade identity verification<br>
• <em>AgeChecker.net</em> - Database-driven verification<br>
• <em>Clear</em> - Biometric verification platform<br><br>
<strong>Privacy advantage:</strong> The website never sees your ID or personal data - only gets confirmation you're 18+. Called "anonymous age verification" in some states.<br><br>
<strong>Methods used:</strong> These services combine multiple approaches:<br>
• Government ID scanning and validation<br>
• Commercial database lookups<br>
• Facial recognition and biometrics<br>
• Transactional data checks<br><br>
<strong>Cost:</strong> Typically $0.05 to $5.00 per verification depending on method and provider.<br><br>
<strong>Legal standing:</strong> Many state laws explicitly allow third-party services, and some states (like Florida) strongly prefer them for privacy reasons.`
  },
  'Commercial Database': {
    term: 'Commercial Database Verification',
    simple: 'Using existing databases of adult records (like credit bureaus) to verify someone is 18+.',
    intermediate: 'Third-party age verification services that check your information against commercial databases containing adult-only records.',
    detailed: `<strong>What databases are used:</strong><br>
• <em>Credit bureaus</em> (Equifax, Experian, TransUnion) - must be 18+ to have credit history<br>
• <em>Public records</em> - property ownership, voter registration, court records<br>
• <em>Commercial aggregators</em> - LexisNexis, Acxiom, etc. compile adult data<br>
• <em>Employment/education records</em> - HR databases, college enrollment<br><br>
<strong>How it works:</strong><br>
1. User provides basic info (name, DOB, address)<br>
2. Service queries multiple databases<br>
3. Checks if your identity appears in adult-only databases<br>
4. Returns "verified 18+" or "not verified"<br><br>
<strong>Accuracy:</strong> High for adults with established records (credit, employment, property). Lower for young adults (18-21) who may not have extensive records yet.<br><br>
<strong>States explicitly allowing:</strong> Multiple states mention "commercially available database" in their laws, including Kansas, Nebraska, North Carolina, Oklahoma, Texas, Virginia.<br><br>
<strong>Privacy:</strong> Less invasive than uploading ID photos - just checks existing records. No biometric data collected.<br><br>
<strong>Cost:</strong> Very affordable - typically $0.05-0.25 per verification since it's just a database lookup.`
  },
  'Anonymous Option': {
    term: 'Anonymous Age Verification',
    simple: 'Age verification without sharing your name or personal information with the website.',
    intermediate: 'Privacy-preserving verification where you prove you\'re 18+ without revealing your identity. Only Florida currently requires this option.',
    detailed: `<strong>Florida's Requirement:</strong> "Anonymous age verification which does not require user to disclose personal information (PI)"<br><br>
<strong>How it works:</strong><br>
• User verifies age through a third-party service<br>
• Service confirms "18 or older" to the website<br>
• Website never receives your name, address, DOB, or ID<br>
• Uses cryptographic tokens or zero-knowledge proofs<br><br>
<strong>Technologies enabling this:</strong><br>
• <em>Zero-knowledge proofs:</em> Mathematical way to prove "I'm over 18" without revealing your exact age<br>
• <em>Anonymous credentials:</em> Digital tokens that prove age without identity<br>
• <em>Privacy-preserving third parties:</em> Services like Yoti that verify but don't share data<br><br>
<strong>Why Florida requires it:</strong> Balances age verification with First Amendment concerns about anonymous access to legal content.<br><br>
<strong>Advantage:</strong> Protects user privacy - the website can't track who accessed what content.<br><br>
<strong>Challenge:</strong> More complex to implement than simple ID upload. Requires sophisticated third-party services.<br><br>
<strong>Current status:</strong> Only Florida explicitly requires this option (as of 2024). Other states allow but don't mandate it.`
  }
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  // Load states data
  await loadStatesData();
  
  // Initialize map
  initMap();
  
  // Initialize UI
  initTabs();
  initTierFilters();
  initTable();
  initSearch();
  
  // Update market coverage stats
  updateMarketStats();
  
  // Initialize legal term tooltips
  initLegalTermTooltips();
  
  // Close panel handler
  document.getElementById('close-panel').addEventListener('click', () => {
    document.getElementById('state-panel').classList.remove('open');
  });
});

// Load states data from JSON
async function loadStatesData() {
  try {
    const response = await fetch('data/states-data.json');
    statesData = await response.json();
    console.log(`Loaded ${statesData.length} states`);
  } catch (error) {
    console.error('Error loading states data:', error);
    alert('Error loading data. Please refresh the page.');
  }
}

// Initialize Leaflet map
async function initMap() {
  // Create map
  map = L.map('map').setView([37.8, -102], 4.5);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);
  
  // Load US states GeoJSON
  try {
    const response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
    const geojson = await response.json();
    
    // Add GeoJSON layer
    geojsonLayer = L.geoJSON(geojson, {
      style: styleState,
      onEachFeature: onEachFeature
    }).addTo(map);
    
  } catch (error) {
    console.error('Error loading GeoJSON:', error);
  }
}

// Create dynamic SVG patterns
function createDynamicPatterns() {
  const defs = document.querySelector('#pattern-defs defs');
  defs.innerHTML = ''; // Clear existing patterns
  
  const colors = {
    0: '#10b981',  // green
    1: '#3b82f6',  // blue
    2: '#eab308',  // yellow
    3: '#f97316',  // orange
    4: '#ef4444',  // red
    'gray': '#e5e7eb',  // light gray
    'unselected': '#d1d5db'  // gray for unselected
  };
  
  const densitySettings = {
    high: { spacing: 6, radius: 2.2, opacity: 0.6 },
    medium: { spacing: 11, radius: 1.8, opacity: 0.45 },
    low: { spacing: 18, radius: 1.4, opacity: 0.3 }
  };
  
  // Create patterns for each color-density combination
  Object.entries(colors).forEach(([tier, color]) => {
    Object.entries(densitySettings).forEach(([density, settings]) => {
      const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
      pattern.setAttribute('id', `dots-${tier}-${density}`);
      pattern.setAttribute('width', settings.spacing);
      pattern.setAttribute('height', settings.spacing);
      pattern.setAttribute('patternUnits', 'userSpaceOnUse');
      
      // Background rect with the tier color
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', settings.spacing);
      rect.setAttribute('height', settings.spacing);
      rect.setAttribute('fill', color);
      pattern.appendChild(rect);
      
      // Dot overlay
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', settings.spacing / 2);
      circle.setAttribute('cy', settings.spacing / 2);
      circle.setAttribute('r', settings.radius);
      circle.setAttribute('fill', `rgba(0,0,0,${settings.opacity})`);
      pattern.appendChild(circle);
      
      defs.appendChild(pattern);
    });
  });
}

// Style each state based on tier and filter
function styleState(feature) {
  const stateName = feature.properties.name;
  const stateData = statesData.find(s => s.state === stateName);
  
  if (!stateData) {
    return {
      fillColor: '#999',
      weight: 1,
      opacity: 1,
      color: '#666',
      fillOpacity: 0.5
    };
  }
  
  // Check visualization toggles
  const showTiers = document.getElementById('show-tiers')?.checked ?? true;
  const showLgbtq = document.getElementById('show-lgbtq')?.checked ?? true;
  
  // Check if this tier is selected in filters
  const selectedTiers = getSelectedTiers();
  const isSelected = selectedTiers.includes(stateData.legal.tier);
  
  const colors = {
    0: '#10b981',  // green
    1: '#3b82f6',  // blue
    2: '#eab308',  // yellow
    3: '#f97316',  // orange
    4: '#ef4444'   // red
  };
  
  // Determine fill color or pattern
  let fillValue;
  
  if (isSelected && showLgbtq && stateData.lgbtqDensity && ['high', 'medium', 'low'].includes(stateData.lgbtqDensity)) {
    // Use pattern that includes both color and dots
    if (showTiers) {
      fillValue = `url(#dots-${stateData.legal.tier}-${stateData.lgbtqDensity})`;
    } else {
      fillValue = `url(#dots-gray-${stateData.lgbtqDensity})`;
    }
  } else {
    // Use solid color
    if (showTiers && isSelected) {
      fillValue = colors[stateData.legal.tier] || '#999';
    } else if (isSelected) {
      fillValue = '#e5e7eb';  // Light gray when tiers hidden but selected
    } else {
      fillValue = '#d1d5db';  // Gray for unselected
    }
  }
  
  return {
    fillColor: fillValue,
    weight: 2,
    opacity: 1,
    color: '#ffffff',
    fillOpacity: isSelected ? 0.7 : 0.3
  };
}

// Get currently selected tiers from buttons
function getSelectedTiers() {
  const activeButtons = document.querySelectorAll('.tier-filter-btn.active');
  return Array.from(activeButtons).map(btn => parseInt(btn.dataset.tier));
}

// Add interactivity to each state
function onEachFeature(feature, layer) {
  const stateName = feature.properties.name;
  const stateData = statesData.find(s => s.state === stateName);
  
  if (!stateData) return;
  
  // Tooltip
  layer.bindTooltip(`
    <strong>${stateName}</strong><br>
    Tier ${stateData.legal.tier}<br>
    Pop: ${stateData.populationPercent}%<br>
    LGBTQ+: ${stateData.lgbtqDensity}
  `, { sticky: true });
  
  // Click to show detail panel
  layer.on('click', () => {
    showStateDetail(stateData);
  });
  
  // Hover effects
  layer.on('mouseover', function() {
    this.setStyle({
      weight: 3,
      fillOpacity: 0.9
    });
  });
  
  layer.on('mouseout', function() {
    geojsonLayer.resetStyle(this);
  });
}

// Show state detail panel
function showStateDetail(state) {
  const panel = document.getElementById('state-panel');
  
  // Basic info
  document.getElementById('panel-state-name').textContent = state.state;
  document.getElementById('panel-tier-badge').textContent = `Tier ${state.legal.tier}`;
  document.getElementById('panel-tier-badge').className = `tier-badge tier-${state.legal.tier}`;
  document.getElementById('panel-lgbtq').textContent = `LGBTQ+ Density: ${state.lgbtqDensity}`;
  document.getElementById('panel-population').textContent = state.population.toLocaleString();
  document.getElementById('panel-pop-percent').textContent = `${state.populationPercent}% of US`;
  document.getElementById('panel-id-required').textContent = state.legal.idRequired ? 'Yes' : 'No';
  document.getElementById('panel-id-required').className = state.legal.idRequired ? 'text-lg text-red-600 font-semibold' : 'text-lg text-green-600 font-semibold';
  
  // Exact legal language
  document.getElementById('panel-applicability').textContent = state.legal.applicabilityExact;
  document.getElementById('panel-id-requirements').textContent = state.legal.idRequirementsExact;
  document.getElementById('panel-penalties').textContent = state.legal.penaltiesExact;
  document.getElementById('panel-citation').textContent = state.legal.citation;
  
  // Verification methods
  const methodsEl = document.getElementById('panel-methods');
  methodsEl.innerHTML = '';
  const methods = state.legal.verificationMethods;
  const methodLabels = {
    creditCard: '💳 Credit/Debit Cards',
    digitizedId: '📱 Digitized ID',
    governmentId: '🪪 Government-Issued ID',
    transactionalData: '💼 Transactional Data',
    ial2Required: '🔐 IAL2 Certification Required',
    photoMatching: '📸 Photo Matching Required',
    anonymousOption: '🕶️ Anonymous Option Available',
    thirdPartyService: '🏢 Third-Party Service',
    commercialDatabase: '🗄️ Commercial Database',
    commerciallySoftware: '💻 Commercially Reasonable Software',
    bankAccount: '🏦 Bank Account Information',
    financialDocument: '📄 Financial Documents'
  };
  
  let hasAnyMethod = false;
  for (const [key, label] of Object.entries(methodLabels)) {
    if (methods[key]) {
      methodsEl.innerHTML += `<div class="flex items-center text-green-600"><span class="mr-2">✓</span>${label}</div>`;
      hasAnyMethod = true;
    }
  }
  
  if (!hasAnyMethod) {
    methodsEl.innerHTML = '<div class="text-gray-500">No specific methods listed or not applicable</div>';
  }
  
  // Notes
  if (state.legal.notes && state.legal.notes.trim()) {
    document.getElementById('panel-notes-section').classList.remove('hidden');
    document.getElementById('panel-notes').textContent = state.legal.notes;
  } else {
    document.getElementById('panel-notes-section').classList.add('hidden');
  }
  
  // Show panel
  panel.classList.add('open');
}

// Update market coverage statistics
function updateMarketStats() {
  const selectedTiers = getSelectedTiers();
  const selectedStates = statesData.filter(state => selectedTiers.includes(state.legal.tier));
  
  const totalStates = selectedStates.length;
  const totalPopPercent = selectedStates.reduce((sum, state) => sum + state.populationPercent, 0);
  const totalPopulation = selectedStates.reduce((sum, state) => sum + state.population, 0);
  
  // Update UI
  document.getElementById('selected-states-count').textContent = totalStates;
  document.getElementById('selected-population-percent').textContent = `${totalPopPercent.toFixed(1)}%`;
  document.getElementById('selected-population-count').textContent = `${(totalPopulation / 1000000).toFixed(0)}M`;
  
  // Determine verification methods needed based on actual data
  const methodsEl = document.getElementById('verification-methods');

  // If no states selected, show all methods
  if (selectedStates.length === 0) {
    methodsEl.innerHTML = '<div class="text-gray-500 italic">Select tiers to see verification methods</div>';
    return;
  }

  // Aggregate verification methods from selected states
  const methodUsage = {
    creditCard: false,
    digitizedId: false,
    governmentId: false,
    transactionalData: false,
    ial2Required: false,
    photoMatching: false,
    anonymousOption: false,
    thirdPartyService: false,
    commercialDatabase: false,
    commerciallySoftware: false,
    bankAccount: false,
    financialDocument: false
  };

  // Check which methods are used in selected states
  selectedStates.forEach(state => {
    Object.keys(methodUsage).forEach(method => {
      if (state.legal.verificationMethods[method]) {
        methodUsage[method] = true;
      }
    });
  });

  // Map methods to display labels with tooltips
  const methodLabels = {
    creditCard: { label: 'Credit card', term: 'Credit Card' },
    digitizedId: { label: 'Digitized ID', term: 'Digital ID' },
    governmentId: { label: 'Government-issued ID', term: 'Photo ID' },
    transactionalData: { label: 'Transactional data', term: 'Transactional Data' },
    ial2Required: { label: 'IAL2 certification', term: 'IAL2' },
    photoMatching: { label: 'Photo matching', term: 'Photo ID' },
    anonymousOption: { label: 'Anonymous option available', term: 'Anonymous Option' },
    thirdPartyService: { label: 'Third-party service', term: 'Third-Party Service' },
    commercialDatabase: { label: 'Commercial database', term: 'Commercial Database' },
    commerciallySoftware: { label: 'Commercially reasonable software', term: 'Commercially Reasonable Software' },
    bankAccount: { label: 'Bank account information', term: 'Bank Account' },
    financialDocument: { label: 'Financial documents', term: 'Financial Document' }
  };

  // Build the list
  const methods = [];

  // Special case: if only Tier 0 states are selected
  const allTier0 = selectedStates.every(state => state.legal.tier === 0);
  if (allTier0) {
    methods.push('• No verification required');
  } else {
    // Show all methods that are used in selected states
    Object.entries(methodUsage).forEach(([method, isUsed]) => {
      if (isUsed) {
        const config = methodLabels[method];
        if (config.term) {
          // With tooltip
          methods.push(`• <span class="legal-term" data-term="${config.term}">${config.label}</span>`);
        } else {
          // Without tooltip
          methods.push(`• ${config.label}`);
        }
      }
    });

    // If no methods found (shouldn't happen), show message
    if (methods.length === 0) {
      methods.push('• No specific methods defined');
    }
  }

  methodsEl.innerHTML = methods.map(m => `<div>${m}</div>`).join('');

  // Reinitialize tooltips for new elements
  initLegalTermTooltips();
}

// Initialize tabs
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const overlayContents = document.querySelectorAll('.tab-content-overlay');
  const slider = document.querySelector('.tab-switch-slider');
  const floatingCards = [
    document.getElementById('stats-card')
  ];
  
  // Function to update slider position
  function updateSlider(activeBtn) {
    const btnRect = activeBtn.getBoundingClientRect();
    const containerRect = activeBtn.parentElement.getBoundingClientRect();
    const offsetLeft = btnRect.left - containerRect.left - 2; // Adjust for container padding
    
    slider.style.width = `${btnRect.width}px`;
    slider.style.transform = `translateX(${offsetLeft}px)`;
  }
  
  // Initialize slider position
  const activeBtn = document.querySelector('.tab-btn.active');
  if (activeBtn && slider) {
    updateSlider(activeBtn);
  }
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      // Update button states
      tabBtns.forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      
      // Update slider
      updateSlider(btn);
      
      // Handle map view
      if (tabName === 'map') {
        // Hide all overlay content
        overlayContents.forEach(content => content.classList.add('hidden'));
        // Show floating cards
        floatingCards.forEach(card => card.style.display = 'block');
      } else {
        // Hide floating cards
        floatingCards.forEach(card => card.style.display = 'none');
        // Hide all overlays first
        overlayContents.forEach(content => content.classList.add('hidden'));
        // Show selected overlay
        const overlay = document.getElementById(`tab-${tabName}`);
        if (overlay) {
          overlay.classList.remove('hidden');
        }
      }
    });
  });
  
  // Update slider on window resize
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn && slider) {
      updateSlider(activeBtn);
    }
  });
}

// Initialize tier filters
function initTierFilters() {
  const filterButtons = document.querySelectorAll('.tier-filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active state
      button.classList.toggle('active');
      
      // Update map styling
      if (geojsonLayer) {
        geojsonLayer.setStyle(styleState);
      }
      // Update stats
      updateMarketStats();
    });
  });
  
  // Initialize visualization toggles
  const showTiersToggle = document.getElementById('show-tiers');
  const showLgbtqToggle = document.getElementById('show-lgbtq');
  
  // Create patterns on initialization
  createDynamicPatterns();
  
  if (showTiersToggle) {
    showTiersToggle.addEventListener('change', () => {
      if (geojsonLayer) {
        geojsonLayer.setStyle(styleState);
      }
    });
  }
  
  if (showLgbtqToggle) {
    showLgbtqToggle.addEventListener('change', () => {
      if (geojsonLayer) {
        geojsonLayer.setStyle(styleState);
      }
    });
  }
}

// Table state
let tableSortColumn = 'population';
let tableSortDirection = 'desc';

// Initialize table
function initTable() {
  renderTable();
  initTableSorting();
  initTableFilters();
}

// Render table with current sort and filters
function renderTable() {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';
  
  // Get filter values
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const tierFilter = document.getElementById('tier-filter').value;
  const idReqFilter = document.getElementById('id-req-filter').value;
  
  // Filter states
  let filteredStates = statesData.filter(state => {
    const matchesSearch = state.state.toLowerCase().includes(searchQuery);
    const matchesTier = !tierFilter || state.legal.tier.toString() === tierFilter;
    const matchesIdReq = !idReqFilter || 
      (idReqFilter === 'yes' && state.legal.idRequired) ||
      (idReqFilter === 'no' && !state.legal.idRequired);
    return matchesSearch && matchesTier && matchesIdReq;
  });
  
  // Sort states
  const sortedStates = [...filteredStates].sort((a, b) => {
    let aVal, bVal;
    
    switch(tableSortColumn) {
      case 'state':
        aVal = a.state;
        bVal = b.state;
        break;
      case 'tier':
        aVal = a.legal.tier;
        bVal = b.legal.tier;
        break;
      case 'population':
        aVal = a.populationPercent;
        bVal = b.populationPercent;
        break;
      case 'lgbtq':
        const lgbtqOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        aVal = lgbtqOrder[a.lgbtqDensity] || 0;
        bVal = lgbtqOrder[b.lgbtqDensity] || 0;
        break;
      case 'idRequired':
        aVal = a.legal.idRequired ? 1 : 0;
        bVal = b.legal.idRequired ? 1 : 0;
        break;
      default:
        aVal = a.populationPercent;
        bVal = b.populationPercent;
    }
    
    if (typeof aVal === 'string') {
      return tableSortDirection === 'asc' ? 
        aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else {
      return tableSortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });
  
  // Render rows
  sortedStates.forEach(state => {
    const row = document.createElement('tr');
    row.dataset.state = state.state;
    row.innerHTML = `
      <td class="px-4 py-3 text-sm font-medium text-gray-900">${state.state}</td>
      <td class="px-4 py-3 text-sm">
        <span class="tier-badge tier-${state.legal.tier}">Tier ${state.legal.tier}</span>
      </td>
      <td class="px-4 py-3 text-sm text-gray-700">${state.populationPercent}%</td>
      <td class="px-4 py-3 text-sm text-gray-700">${state.lgbtqDensity}</td>
      <td class="px-4 py-3 text-sm ${state.legal.idRequired ? 'text-red-600' : 'text-green-600'} font-semibold">
        ${state.legal.idRequired ? 'Yes' : 'No'}
      </td>
      <td class="px-4 py-3 text-sm text-gray-700">${state.legal.penalties.perViolation || '-'}</td>
    `;
    
    // Add click handler to row
    row.addEventListener('click', () => {
      showStateDetail(state);
    });
    
    tbody.appendChild(row);
  });
  
  // Update sort indicators
  document.querySelectorAll('.table-header').forEach(header => {
    header.classList.remove('sorted-asc', 'sorted-desc');
    if (header.dataset.sort === tableSortColumn) {
      header.classList.add(`sorted-${tableSortDirection}`);
    }
  });
}

// Initialize table sorting
function initTableSorting() {
  document.querySelectorAll('.table-header').forEach(header => {
    header.addEventListener('click', () => {
      const column = header.dataset.sort;
      if (tableSortColumn === column) {
        tableSortDirection = tableSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        tableSortColumn = column;
        tableSortDirection = 'desc';
      }
      renderTable();
    });
  });
}

// Initialize table filters
function initTableFilters() {
  const searchInput = document.getElementById('search');
  const tierFilter = document.getElementById('tier-filter');
  const idReqFilter = document.getElementById('id-req-filter');
  
  // Update filter styling when value changes
  function updateFilterStyling() {
    if (tierFilter.value) {
      tierFilter.classList.add('has-value');
    } else {
      tierFilter.classList.remove('has-value');
    }
    
    if (idReqFilter.value) {
      idReqFilter.classList.add('has-value');
      } else {
      idReqFilter.classList.remove('has-value');
    }
  }
  
  searchInput.addEventListener('input', renderTable);
  
  tierFilter.addEventListener('change', () => {
    updateFilterStyling();
    renderTable();
  });
  
  idReqFilter.addEventListener('change', () => {
    updateFilterStyling();
    renderTable();
  });
}

// Keep for backward compatibility
function initSearch() {
  // Now handled by initTableFilters
}

// Initialize legal term tooltips
function initLegalTermTooltips() {
  const legalTerms = document.querySelectorAll('.legal-term');
  const tooltip = document.getElementById('legal-tooltip');
  const tooltipTerm = document.getElementById('tooltip-term');
  const tooltipBody = document.getElementById('tooltip-body');
  const tooltipClose = document.getElementById('tooltip-close');
  
  legalTerms.forEach(term => {
    term.addEventListener('click', (e) => {
      e.stopPropagation();
      const termKey = term.dataset.term;
      const glossaryEntry = legalGlossary[termKey];
      
      if (glossaryEntry) {
        tooltipTerm.textContent = glossaryEntry.term;
        
        // Build rich content with all three levels
        let content = '<div style="margin-bottom: 12px;">';
        content += '<div style="margin-bottom: 8px;"><strong style="color: #2563eb;">🔵 Simple:</strong><br>' + glossaryEntry.simple + '</div>';
        if (glossaryEntry.intermediate) {
          content += '<div style="margin-bottom: 8px;"><strong style="color: #16a34a;">🟢 Intermediate:</strong><br>' + glossaryEntry.intermediate + '</div>';
        }
        if (glossaryEntry.detailed) {
          content += '<div><strong style="color: #ea580c;">🟠 Detailed:</strong><br>' + glossaryEntry.detailed + '</div>';
        }
        content += '</div>';
        
        tooltipBody.innerHTML = content;
        
        // Position tooltip near the clicked element
        const rect = term.getBoundingClientRect();
        const tooltipWidth = 450;
        let left = rect.left;
        let top = rect.bottom + 8;
        
        // Adjust if tooltip would go off screen
        if (left + tooltipWidth > window.innerWidth) {
          left = window.innerWidth - tooltipWidth - 20;
        }
        if (top + 400 > window.innerHeight) {
          top = rect.top - 408;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.classList.remove('hidden');
        tooltip.classList.add('show');
      }
    });
  });
  
  // Close tooltip handlers
  tooltipClose.addEventListener('click', () => {
    tooltip.classList.add('hidden');
    tooltip.classList.remove('show');
  });
  
  document.addEventListener('click', (e) => {
    if (!tooltip.contains(e.target) && !e.target.classList.contains('legal-term')) {
      tooltip.classList.add('hidden');
      tooltip.classList.remove('show');
    }
  });
}

// Initialize collapsible sections
function initCollapsibleSections() {
  const headers = document.querySelectorAll('.collapsible-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.dataset.section;
      const content = document.getElementById(`content-${section}`);
      const sectionWrapper = header.closest('.collapsible-section');
      
      // Toggle collapsed state
      const isCollapsed = header.classList.contains('collapsed');
      
      if (isCollapsed) {
        // Expand
        header.classList.remove('collapsed');
        content.classList.remove('collapsed');
        sectionWrapper.classList.remove('collapsed');
      } else {
        // Collapse
        header.classList.add('collapsed');
        content.classList.add('collapsed');
        sectionWrapper.classList.add('collapsed');
      }
    });
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initCollapsibleSections();
});
