// チェッカーフラッグ描画
function buildChecker(id) {
  const el = document.getElementById(id);
  if (!el) return; 
  const cellSize = 36;
  const cols = Math.ceil(window.innerWidth / cellSize) + 1;
  el.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'checker-cell ' + (((r + c) % 2 === 0) ? 'b' : 'w');
      cell.style.height = cellSize + 'px';
      el.appendChild(cell);
    }
  }
}
buildChecker('checker-top');
buildChecker('checker-bot');

const BASE_IMAGE_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_TRAVEL/main/';
const DATA_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_TRAVEL/refs/heads/main/travel.json';

let map;
let travelSpots = [];
let markers = [];

function getFullImageUrl(url) {
  if (!url || url.trim() === '') return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return BASE_IMAGE_URL + url.replace(/^\//, '');
}

function initMap() {
  map = L.map('map-container').setView([36.2048, 138.2529], 5);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);
}

async function loadTravelData() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('JSON load failed');
    travelSpots = await response.json();
    renderSpots();
  } catch (error) {
    console.error(error);
    document.getElementById('spot-list').innerHTML = '<p style="font-size:12px; color:#666; text-align:center;">TRAVEL MAP LOAD ERROR</p>';
  }
}

function renderSpots() {
  const listContainer = document.getElementById('spot-list');
  listContainer.innerHTML = '';

  travelSpots.forEach((spot, index) => {
    let coords = null;

    if (spot.coords && spot.coords.includes(',')) {
      const parts = spot.coords.split(',').map(num => parseFloat(num.trim()));
      if (!isNaN(parts[0]) && !isNaN(parts[1])) {
        coords = parts;
      }
    }
    
    if (coords) {
      const marker = L.marker(coords).addTo(map);
      marker.on('click', () => openModal(index));
      markers.push(marker);
    }

    const card = document.createElement('div');
    card.className = 'spot-card';
    card.onclick = () => {
      if (coords) {
        map.flyTo(coords, 14, { duration: 1 });
        setTimeout(() => openModal(index), 800);
      } else {
        openModal(index);
      }
    };
    
    card.innerHTML = `
      <div class="spot-icon">📍</div>
      <div class="spot-info">
        <div class="spot-title">${spot.title || 'Untitled'}</div>
        <div class="spot-desc">${spot.comment || 'コメント無し'}</div>
      </div>
    `;
    listContainer.appendChild(card);
  });
}

function openModal(index) {
  const spot = travelSpots[index];
  if (!spot) return;

  const modal = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalImgWrap = document.querySelector('.modal-image-wrap');
  const modalComment = document.getElementById('modal-comment');

  modalTitle.textContent = spot.title || 'UNKNOWN SPOT';
  modalComment.textContent = spot.comment || '';

  const fullUrl = getFullImageUrl(spot.imageUrl);
  if (fullUrl) {
    modalImgWrap.innerHTML = `<img src="${fullUrl}" alt="TRAVEL PHOTO" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'no-image-text\\'>📷 NO IMAGE</div>';">`;
  } else {
    modalImgWrap.innerHTML = `<div class="no-image-text">📷 NO IMAGE</div>`;
  }

  modal.classList.add('open');
}

function closeModal(event) {
  if (event.target.id === 'modal-overlay') {
    document.getElementById('modal-overlay').classList.remove('open');
  }
}
function closeModalDirect() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadTravelData();
});