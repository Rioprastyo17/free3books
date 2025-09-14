import { books } from './data.js';

// --- Elemen-elemen penting dari DOM ---
const gallery = document.querySelector('#interactive-gallery');
const prevButton = document.querySelector('#prev-page');
const nextButton = document.querySelector('#next-page');
const pageIndicator = document.querySelector('#page-indicator');
const searchInput = document.querySelector('#search-input');
const themeToggle = document.querySelector('#theme-toggle');

// --- Variabel State Aplikasi ---
const ITEMS_PER_PAGE = 7;
let currentPage = 1;
let filteredBooks = [...books]; // Salinan data buku yang bisa difilter

// --- Ikon untuk Tombol Tema ---
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;


/**
 * Fungsi untuk me-render halaman ebook tertentu berdasarkan data yang sudah difilter
 */
function renderPage() {
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = 1; // Reset ke halaman 1 jika hasil filter lebih sedikit

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const booksToShow = filteredBooks.slice(start, end);

  if (booksToShow.length === 0) {
    gallery.innerHTML = `<p style="font-family: monospace; grid-column: 1 / -1; text-align: center;">Ebook tidak ditemukan.</p>`;
  } else {
    const galleryItemsHTML = booksToShow.map((book, index) => {
      const isActive = index === 0 ? "true" : "false";
      const coverPath = `data/thumbnails/${book.coverImage}`;
      const pdfPath = `data/ebook/${book.pdfFile}`;
      return `
        <li data-active="${isActive}">
          <article>
            <h3>${book.title}</h3>
            <p>${book.description}</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <a href="${pdfPath}" target="_blank" rel="noopener noreferrer"><span>Download PDF</span></a>
            <img src="${coverPath}" alt="Thumbnail ${book.title}" />
          </article>
        </li>
      `;
    }).join('');
    gallery.innerHTML = galleryItemsHTML;
  }

  setupInteractiveLogic();
  updatePaginationControls();
}

/**
 * Fungsi untuk mengatur logika animasi dan interaksi galeri
 */
function setupInteractiveLogic() {
  const items = gallery.querySelectorAll('li');
  if (items.length === 0) return;

  const initialCols = new Array(items.length).fill('1fr').map((c, i) => i === 0 ? '10fr' : c).join(' ');
  gallery.style.setProperty('grid-template-columns', initialCols);

  const setIndex = (event) => {
    const closest = event.target.closest('li');
    if (closest) {
      const index = [...items].indexOf(closest);
      const cols = new Array(items.length).fill('1fr').map((col, i) => {
        items[i].dataset.active = (index === i).toString();
        return index === i ? '10fr' : '1fr';
      }).join(' ');
      gallery.style.setProperty('grid-template-columns', cols);
    }
  };
  
  gallery.removeEventListener('pointermove', setIndex);
  gallery.addEventListener('pointermove', setIndex);

  const resync = () => {
    if (items.length === 0) return;
    const w = Math.max(...[...items].map(i => i.offsetWidth));
    gallery.style.setProperty('--article-width', w);
  };
  window.addEventListener('resize', resync);
  resync();
}

/**
 * Fungsi untuk memperbarui status kontrol paginasi
 */
function updatePaginationControls() {
    const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
    if (totalPages === 0) {
        pageIndicator.textContent = "Halaman 0 dari 0";
    } else {
        pageIndicator.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    }
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;
}


// --- LOGIKA FITUR ---

// 1. Fitur Search
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
  currentPage = 1;
  renderPage();
});

// 2. Fitur Theme Toggle
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
});

// 3. Fitur Paginasi
nextButton.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
});

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});


// --- INISIALISASI APLIKASI ---
// Saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Cek tema yang tersimpan di localStorage atau preferensi sistem
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
    
    // Render halaman pertama
    renderPage();
});