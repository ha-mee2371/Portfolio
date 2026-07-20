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

const articles = [
  {
    category: "C#",
    date: "2026/07/15",
    title: "C#の基本構文と変数メモ",
    desc: "配列の操作方法やオブジェクト指向の基礎について紙ノートから転記した記録。",
    tags: ["C#", "文法", "基礎"],
    url: "#" // 例: "notes/csharp-01.html"
  },
  {
    category: "FE",
    date: "2026/06/20",
    title: "基本情報：アルゴリズム問題の解き方",
    desc: "トレース表の書き方と、擬似言語の繰り返し処理でハマりやすいポイントのまとめ。",
    tags: ["基本情報技術者", "アルゴリズム", "過去問"],
    url: "#"
  },
  {
    category: "IP",
    date: "2026/05/10",
    title: "ITパスポート：紛らわしい3文字略語集",
    desc: "SaaS/PaaS/IaaSや、CSR/CSVなどの違いを直感的に比較して整理。",
    tags: ["ITパスポート", "単語メモ"],
    url: "#"
  }
];

function displayArticles(categoryFilter) {
  const container = document.getElementById('notes-container');
  if (!container) return; 
  
  container.innerHTML = '';

  articles.forEach(article => {
    if (categoryFilter === 'ALL' || article.category === categoryFilter) {
      
      const card = document.createElement('div');
      card.className = 'works-card';

      const tagsHtml = article.tags.map(tag => `<span>#${tag}</span>`).join('');

      card.innerHTML = `
        <div class="card-badge">${article.category}</div>
        <div class="works-info">
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">DATE: ${article.date}</div>
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