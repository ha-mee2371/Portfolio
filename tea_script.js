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

const pageTopBtn = document.getElementById('page-top-btn');

if (pageTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      pageTopBtn.classList.add('is-show');
    } else {
      pageTopBtn.classList.remove('is-show');
    }
  });

  pageTopBtn.addEventListener('click', () => {
    const duration = 600; 
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
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
