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

let currentCategory = 'ALL';

function displayArticles(categoryFilter) {
  const container = document.getElementById('notes-container');
  if (!container) return; 
  
  container.innerHTML = '';

  if (typeof articles === 'undefined' || !Array.isArray(articles)) {
    container.innerHTML = '<div style="font-size:12px; color:#666; padding:10px;">記事データを読み込み中</div>';
    return;
  }

  articles.forEach(article => {
    if (categoryFilter === 'ALL' || article.category === categoryFilter) {
      
      const card = document.createElement('div');
      card.className = 'works-card';

      const tagsHtml = article.tags ? article.tags.map(tag => `<span>#${tag}</span>`).join('') : '';

      const imageHtml = article.image 
        ? `<img src="${article.image}" alt="${article.title}" class="note-thumb-img">` 
        : '';

      card.innerHTML = `
        <div class="card-badge">${article.category}</div>
        <div class="works-info">
          ${imageHtml}
          <div class="works-title">${article.title}</div>
          <div class="works-desc">${article.desc}</div>
          <div class="tech-stack">
            ${tagsHtml}
          </div>
          <a href="${article.url}" class="order-btn">READ NOTE →</a>
        </div>
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

  displayArticles(categoryName);
}

displayArticles('ALL');