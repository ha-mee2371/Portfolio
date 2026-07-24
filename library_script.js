// ===== CHECKER GRID BUILDER =====
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

// ===== OPENBD & BOOKSHELF FETCH PROCESS =====
async function loadLibraryBooks() {
  const container = document.getElementById('bookshelf');
  if (!container) return;

  const DATA_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_Books/main/books.json';

  try {
    // 1. データリポジトリから JSON を取得
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('Failed to fetch books.json');
    const booksData = await response.json();

    if (!booksData || booksData.length === 0) {
      container.innerHTML = '<div class="error-state">NO BOOKS FOUND</div>';
      return;
    }

    // 2. OpenBD API 用に ISBN をカンマ区切りで準備
    const isbnList = booksData.map(b => b.isbn).filter(Boolean).join(',');
    const openBdUrl = `https://api.openbd.jp/v1/get?isbn=${isbnList}`;

    // 3. OpenBD API から書誌情報を一括取得
    const bdResponse = await fetch(openBdUrl);
    const bdData = await bdResponse.json();

    container.innerHTML = ''; 

    // 4. 書影カードを生成して表示
    booksData.forEach((item, index) => {
      const bdInfo = bdData[index];
      
      const coverUrl = bdInfo?.summary?.cover || '';
      const title = bdInfo?.summary?.title || 'UNTITLED';

      const card = document.createElement('a');
      card.className = 'book-card';
      card.href = item.amazonUrl || '#';
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

      card.innerHTML = `
        <div class="book-cover-wrap">
          ${coverUrl 
            ? `<img class="book-cover" src="${coverUrl}" alt="${title}" loading="lazy">`
            : `<div class="book-no-cover">${title}</div>`
          }
        </div>
        <div class="book-title-tag">${title}</div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Library loading error:', error);
    container.innerHTML = '<div class="error-state">FAILED TO LOAD BOOKSHELF</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  buildChecker('checker-top');
  buildChecker('checker-bot');
  loadLibraryBooks();
});