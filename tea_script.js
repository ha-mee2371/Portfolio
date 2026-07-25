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

let teaArticles = [];
let currentCategory = 'ALL';

const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_TEA/main/';

async function loadTeaData() {
  const DATA_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_TEA/refs/heads/main/tea.json';

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('JSON load failed');
    teaArticles = await response.json();
    displayTeas('ALL');
  } catch (error) {
    console.error(error);
    const container = document.getElementById('tea-container');
    if (container) {
      container.innerHTML = '<div style="grid-column:1/-1; font-size:12px; color:#666; text-align:center;">TEA LOG LOAD ERROR</div>';
    }
  }
}

function displayTeas(categoryFilter) {
  const container = document.getElementById('tea-container');
  if (!container) return; 
  
  container.innerHTML = '';

  teaArticles.forEach(tea => {
    const brandName = tea.brand ? tea.brand.toUpperCase() : 'OTHER';
    let isMatch = false;

    if (categoryFilter === 'ALL') {
      isMatch = true;
    } else if (categoryFilter === 'OTHER') {
      isMatch = (brandName !== 'LUPICIA' && brandName !== 'KAREL CAPEK');
    } else {
      isMatch = (brandName === categoryFilter);
    }

    if (isMatch) {
      const card = document.createElement('div');
      card.className = 'tea-card';

      let rankText = '';
      let rankClass = '';
      if (tea.rank === 1) {
        rankText = '🥰 REPEAT!';
        rankClass = 'rank-1';
      } else if (tea.rank === 2) {
        rankText = '😊 GOOD!';
        rankClass = 'rank-2';
      } else if (tea.rank === 3) {
        rankText = '☹ NOT FOR ME';
        rankClass = 'rank-3';
      }

      let imgSrc = (tea.coverUrl && tea.coverUrl.trim() !== '') ? tea.coverUrl.trim() : '';
      if (imgSrc && !imgSrc.startsWith('http://') && !imgSrc.startsWith('https://')) {
        imgSrc = IMAGE_BASE_URL + imgSrc.replace(/^\//, '');
      }

      const imageHtml = (imgSrc !== '') 
        ? `<img src="${imgSrc}" alt="${tea.title}" class="tea-img" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'no-image-box\\'><span class=\\'icon\\'>☕</span><span class=\\'text\\'>NO IMAGE</span></div>';">` 
        : `<div class="no-image-box">
             <span class="icon">☕</span>
             <span class="text">NO IMAGE</span>
           </div>`;

      card.innerHTML = `
        <div class="rank-badge ${rankClass}">${rankText}</div>
        <div class="tea-image-wrap">
          ${imageHtml}
        </div>
        <div class="tea-brand">${tea.brand}</div>
        <div class="tea-title">${tea.title}</div>
        <div class="tea-comment">${tea.comment || ''}</div>
      `;

      container.appendChild(card);
    }
  });
}

function filterCategory(categoryName) {
  currentCategory = categoryName;
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    if (btn.textContent === categoryName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  displayTeas(categoryName);
}

document.addEventListener('DOMContentLoaded', loadTeaData);