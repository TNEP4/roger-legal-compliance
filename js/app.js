// US Adult Content Compliance Dashboard
// Main application JavaScript

let statesData = [];
let map = null;
let geojsonLayer = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  // Load states data
  await loadStatesData();
  
  // Initialize map
  initMap();
  
  // Initialize UI
  initTabs();
  initStrategyBuilder();
  initTable();
  initSearch();
  
  // Update stats
  updateStats();
  
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
  map = L.map('map').setView([37.8, -96], 4);
  
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

// Style each state based on tier
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
  
  const colors = {
    0: '#10b981',  // green
    1: '#3b82f6',  // blue
    2: '#eab308',  // yellow
    3: '#f97316',  // orange
    4: '#ef4444'   // red
  };
  
  return {
    fillColor: colors[stateData.legal.tier] || '#999',
    weight: 2,
    opacity: 1,
    color: '#ffffff',
    fillOpacity: 0.7
  };
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

// Update statistics
function updateStats() {
  const tierCounts = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0
  };
  const tierPopPercents = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0
  };
  
  statesData.forEach(state => {
    const tier = state.legal.tier;
    tierCounts[tier]++;
    tierPopPercents[tier] += state.populationPercent;
  });
  
  document.getElementById('tier0-count').textContent = tierCounts[0];
  document.getElementById('tier0-percent').textContent = `${tierPopPercents[0].toFixed(1)}%`;
  
  document.getElementById('tier1-count').textContent = tierCounts[1];
  document.getElementById('tier1-percent').textContent = `${tierPopPercents[1].toFixed(1)}%`;
  
  document.getElementById('tier2-count').textContent = tierCounts[2];
  document.getElementById('tier2-percent').textContent = `${tierPopPercents[2].toFixed(1)}%`;
  
  const tier34Count = tierCounts[3] + tierCounts[4];
  const tier34Percent = tierPopPercents[3] + tierPopPercents[4];
  document.getElementById('tier34-count').textContent = tier34Count;
  document.getElementById('tier34-percent').textContent = `${tier34Percent.toFixed(1)}%`;
}

// Initialize tabs
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      // Update button states
      tabBtns.forEach(b => {
        b.classList.remove('active', 'border-blue-500', 'text-blue-600');
        b.classList.add('border-transparent', 'text-gray-500');
      });
      btn.classList.add('active', 'border-blue-500', 'text-blue-600');
      btn.classList.remove('border-transparent', 'text-gray-500');
      
      // Show/hide content
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    });
  });
}

// Initialize strategy builder
function initStrategyBuilder() {
  const checkboxes = document.querySelectorAll('.tier-checkbox');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateStrategyStats);
  });
  
  updateStrategyStats();
}

function updateStrategyStats() {
  const selectedTiers = Array.from(document.querySelectorAll('.tier-checkbox:checked')).map(cb => parseInt(cb.value));
  
  const selectedStates = statesData.filter(state => selectedTiers.includes(state.legal.tier));
  const totalStates = selectedStates.length;
  const totalPopPercent = selectedStates.reduce((sum, state) => sum + state.populationPercent, 0);
  const totalPopulation = selectedStates.reduce((sum, state) => sum + state.population, 0);
  
  // Determine implementation cost
  let cost = 'None';
  if (selectedTiers.includes(4)) cost = 'Very High';
  else if (selectedTiers.includes(3)) cost = 'High';
  else if (selectedTiers.includes(2)) cost = 'Medium';
  else if (selectedTiers.includes(1)) cost = 'Low';
  
  document.getElementById('selected-states').textContent = totalStates;
  document.getElementById('selected-percent').textContent = `${totalPopPercent.toFixed(1)}%`;
  document.getElementById('selected-population').textContent = `${(totalPopulation / 1000000).toFixed(0)}M`;
  document.getElementById('implementation-cost').textContent = cost;
}

// Initialize table
function initTable() {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';
  
  // Sort by population descending
  const sortedStates = [...statesData].sort((a, b) => b.populationPercent - a.populationPercent);
  
  sortedStates.forEach(state => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
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
      <td class="px-4 py-3 text-sm">
        <button class="text-blue-600 hover:text-blue-800 view-detail-btn" data-state="${state.state}">
          View Details
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  // Add click handlers
  document.querySelectorAll('.view-detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const stateName = e.target.dataset.state;
      const state = statesData.find(s => s.state === stateName);
      if (state) showStateDetail(state);
    });
  });
}

// Initialize search
function initSearch() {
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#table-body tr');
    
    rows.forEach(row => {
      const stateName = row.querySelector('td').textContent.toLowerCase();
      if (stateName.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}
