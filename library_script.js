// ===== CHECKER GRID BUILDER =====
function buildChecker(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const cellSize = 36;
  const cols = Math.ceil(window.innerWidth / cellSize) + 1;
  const rows = 3;
  el.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  el.innerHTML = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'checker-cell ' + (((r + c) % 2 === 0) ? 'b' : 'w');
      cell.style.height = cellSize + 'px';
      el.appendChild(cell);
    }
  }
}

// ===== BOOKSHELF FETCH PROCESS =====
async function loadLibraryBooks() {
  const container = document.getElementById('bookshelf');
  if (!container) return;

  const DATA_URL = 'https://raw.githubusercontent.com/ha-mee2371/Portfolio_Books/refs/heads/main/books.json';

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const booksData = await response.json();

    if (!booksData || booksData.length === 0) {
      container.innerHTML = '<div class="error-state">NO BOOKS FOUND</div>';
      return;
    }

    const isbnList = booksData.map(b => String(b.isbn).replace(/-/g, '')).filter(Boolean).join(',');
    const openBdUrl = `https://api.openbd.jp/v1/get?isbn=${isbnList}`;

    const bdResponse = await fetch(openBdUrl);
    const bdData = await bdResponse.json();

    const bdMap = {};
    if (Array.isArray(bdData)) {
      bdData.forEach(item => {
        if (item && item.summary && item.summary.isbn) {
          bdMap[item.summary.isbn] = item;
        }
      });
    }

    container.innerHTML = ''; 

    booksData.forEach((item) => {
      const cleanIsbn = String(item.isbn).replace(/-/g, '');
      const bdInfo = bdMap[cleanIsbn];
      
      const coverUrl = item.coverUrl || bdInfo?.summary?.cover || '';
      const title = bdInfo?.summary?.title || item.title || 'UNTITLED';

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