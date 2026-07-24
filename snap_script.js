function buildChecker(id) {
  const el = document.getElementById(id);
  if (!el) return; 
  
  const cellSize = 36;
  const cols = Math.ceil(window.innerWidth / cellSize) + 1;
  const rows = 3;
  el.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  
  for (let r = 0; r < rows; r++) {
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

let snapPhotos = [];

// ===== FETCH SNAP DATA =====
async function loadSnapData() {
  const DATA_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_SNAP/refs/heads/main/snap.json';

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('JSON load failed');
    snapPhotos = await response.json();
    displaySnaps();
  } catch (error) {
    console.error(error);
    const container = document.getElementById('snap-container');
    if (container) {
      container.innerHTML = '<div style="grid-column:1/-1; font-size:12px; color:#666; text-align:center;">SNAP LOG LOAD ERROR</div>';
    }
  }
}

function displaySnaps() {
  const container = document.getElementById('snap-container');
  if (!container) return; 
  
  container.innerHTML = '';

  snapPhotos.forEach((photo, index) => {
    const card = document.createElement('div');
    card.className = 'snap-card';
    card.onclick = () => openModal(index);

    const imageHtml = (photo.imageUrl && photo.imageUrl.trim() !== '')
      ? `<img src="${photo.imageUrl}" alt="SNAP PHOTO" class="snap-img" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'no-image-box\\'><span class=\\'icon\\'>📷</span><span class=\\'text\\'>NO IMAGE</span></div>';">`
      : `<div class="no-image-box">
           <span class="icon">📷</span>
           <span class="text">NO IMAGE</span>
         </div>`;

    card.innerHTML = imageHtml;
    container.appendChild(card);
  });
}

function openModal(index) {
  const photo = snapPhotos[index];
  if (!photo) return;

  const modal = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalComment = document.getElementById('modal-comment');

  modalImg.src = photo.imageUrl || '';
  modalComment.textContent = photo.comment || '';

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

document.addEventListener('DOMContentLoaded', loadSnapData);