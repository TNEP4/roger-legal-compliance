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
  
  return {
    fillColor: isSelected ? colors[stateData.legal.tier] || '#999' : '#d1d5db',
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
    commercialDatabase: '🗄️ Commercial Database'
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
  
  // Determine verification methods needed
  const methodsEl = document.getElementById('verification-methods');
  const methods = [];
  
  if (selectedTiers.includes(0)) {
    methods.push('• No verification required');
  }
  if (selectedTiers.includes(1)) {
    methods.push('• <span class="legal-term" data-term="Credit Card">Credit card</span> verification');
  }
  if (selectedTiers.includes(2)) {
    methods.push('• <span class="legal-term" data-term="Transactional Data">Transactional data</span> services');
  }
  if (selectedTiers.includes(3) || selectedTiers.includes(4)) {
    methods.push('• <span class="legal-term" data-term="IAL2">IAL2</span> identity verification');
    methods.push('• <span class="legal-term" data-term="Photo ID">Photo ID</span> matching');
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
    const offsetLeft = btnRect.left - containerRect.left;
    
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
  
  searchInput.addEventListener('input', renderTable);
  tierFilter.addEventListener('change', renderTable);
  idReqFilter.addEventListener('change', renderTable);
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
