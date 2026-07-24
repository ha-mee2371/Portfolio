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

// APIへの連続アクセスを和らげるためのウェイト関数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ===== OPENBD & GOOGLE BOOKS FETCH PROCESS =====
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

    // 1. OpenBD で一括検索
    const isbnList = booksData.map(b => String(b.isbn).replace(/-/g, '')).filter(Boolean).join(',');
    const openBdUrl = `https://api.openbd.jp/v1/get?isbn=${isbnList}`;

    const bdResponse = await fetch(openBdUrl);
    const bdData = await bdResponse.json();

    container.innerHTML = ''; 

    // 2. 1冊ずつカードを生成
    for (let index = 0; index < booksData.length; index++) {
      const item = booksData[index];
      const cleanIsbn = String(item.isbn).replace(/-/g, '');
      const bdInfo = bdData ? bdData[index] : null;
      
      let coverUrl = item.coverUrl || bdInfo?.summary?.cover || '';
      let title = bdInfo?.summary?.title || item.title || 'UNTITLED';

      // 3. OpenBD に画像がない場合のみ Google Books を検索
      if (!coverUrl) {
        try {
          await sleep(200);

          const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
          if (googleRes.ok) {
            const googleData = await googleRes.json();
            if (googleData.items && googleData.items.length > 0) {
              const volumeInfo = googleData.items[0].volumeInfo;
              coverUrl = volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || '';
              if (title === 'UNTITLED') {
                title = volumeInfo.title || 'UNTITLED';
              }
            }
          }
        } catch (e) {
          console.warn(`Google Books fetch failed for ISBN: ${cleanIsbn}`, e);
        }
      }

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
    }

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