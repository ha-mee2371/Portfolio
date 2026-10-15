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

const BASE_IMAGE_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_Hamidori/main/';

function getFullImageUrl(url) {
  if (!url || url.trim() === '') return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return BASE_IMAGE_URL + url.replace(/^\//, '');
}

async function loadSnapData() {
  const DATA_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_Hamidori/refs/heads/main/snap.json';

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('JSON load failed');
    snapPhotos = await response.json();
    displaySnaps();
  } catch (error) {
    console.error(error);
    const container = document.getElementById('snap-container');
    if (container) {
      container.innerHTML = '<div style="grid-column:1/-1; font-size:12px; color:#666; text-align:center;">Hami LOG LOAD ERROR</div>';
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

    const fullUrl = getFullImageUrl(photo.imageUrl);

    const imageHtml = fullUrl
      ? `<img src="${fullUrl}" alt="SNAP PHOTO" class="snap-img" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'no-image-box\\'><span class=\\'icon\\'>📷</span><span class=\\'text\\'>NO IMAGE</span></div>';">`
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

  modalImg.src = getFullImageUrl(photo.imageUrl);

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

const pageTopBtn = document.getElementById('page-top-btn');

if (pageTopBtn) {
  // スクロール位置に応じてボタンを表示・非表示
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      pageTopBtn.classList.add('is-show');
    } else {
      pageTopBtn.classList.remove('is-show');
    }
  });

  // クリックされたら「ぬるっ」と時間をかけて上に戻る
  pageTopBtn.addEventListener('click', () => {
    const duration = 600; // 戻るのにかける時間（ミリ秒：600なら0.6秒。もっとゆっくりにしたい場合は 800 や 1000 に増やしてね）
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // イージング（最初はゆっくり、中頃スルスル、最後は優しく止まる動き）
      const easeInOutQuad = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startPosition * (1 - easeInOutQuad));

      if (progress < 1) {
        requestAnimationFrame(scrollAnimation);
      }
    }

    requestAnimationFrame(scrollAnimation);
  });
}
