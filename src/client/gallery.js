/**
 * Gallery client-side interactions (filters, lazy loading, lightbox)
 */

'use strict';

(function () {
  'use strict';

  function readGalleryData() {
    const dataElement = document.getElementById('gallery-data');
    if (!dataElement) {
      return [];
    }

    try {
      const raw = dataElement.textContent || dataElement.innerText || '[]';
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.warn('Failed to parse gallery data payload:', error);
      return [];
    }
  }

  function detectLanguage() {
    const docLang = document.documentElement.lang || 'ru';
    if (docLang.toLowerCase().startsWith('en')) {
      return 'en';
    }
    return 'ru';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const galleryData = readGalleryData();
    let currentLang = detectLanguage();
    let currentImageIndex = 0;
    let filteredItems = [...galleryData];

    function initLazyLoading() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: load all images immediately
        document.querySelectorAll('img[data-src]').forEach((img) => {
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
        });
        return;
      }

      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
              }
            }
          });
        },
        {rootMargin: '50px'},
      );

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }

    function filterGallery() {
      const activeCategory =
        document
          .querySelector('.filter-btn.active')
          ?.getAttribute('data-category') || 'all';
      const selectedYear =
        document.getElementById('year-select')?.value || 'all';
      const items = document.querySelectorAll('.gallery-item');

      filteredItems = [];
      items.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        const itemYear = item.getAttribute('data-year');
        const itemId = item.getAttribute('data-id');

        const categoryMatch =
          activeCategory === 'all' || itemCategory === activeCategory;
        const yearMatch = selectedYear === 'all' || itemYear === selectedYear;

        if (categoryMatch && yearMatch) {
          item.style.display = 'block';
          const dataItem = galleryData.find((data) => data.id === itemId);
          if (dataItem) {
            filteredItems.push(dataItem);
          }
        } else {
          item.style.display = 'none';
        }
      });
    }

    function initFilters() {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const yearSelect = document.getElementById('year-select');

      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterButtons.forEach((button) => button.classList.remove('active'));
          btn.classList.add('active');
          filterGallery();
        });
      });

      if (yearSelect) {
        yearSelect.addEventListener('change', filterGallery);
      }
    }

    function openLightbox(itemId) {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox) {
        return;
      }

      const item = filteredItems.find((entry) => entry.id === itemId);
      if (!item) {
        return;
      }

      currentImageIndex = filteredItems.indexOf(item);
      showImage(currentImageIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox) {
        return;
      }

      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showImage(index) {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox) {
        return;
      }

      const item = filteredItems[index];
      if (!item) {
        return;
      }

      const lightboxImg = lightbox.querySelector('.lightbox-image');
      const lightboxTitle = lightbox.querySelector('.lightbox-title');
      const lightboxMeta = lightbox.querySelector('.lightbox-meta');

      if (lightboxImg) {
        lightboxImg.src = item.image;
        lightboxImg.alt = item.title[currentLang];
      }

      if (lightboxTitle) {
        lightboxTitle.textContent = item.title[currentLang];
      }

      if (lightboxMeta) {
        const soldText = currentLang === 'ru' ? 'ПРОДАНО' : 'SOLD';
        lightboxMeta.innerHTML =
          `${item.size} • ${item.year}` +
          (item.sold ? ` • <span class="sold-text">${soldText}</span>` : '');
      }
    }

    function showNextImage() {
      if (filteredItems.length === 0) {
        return;
      }

      currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
      showImage(currentImageIndex);
    }

    function showPreviousImage() {
      if (filteredItems.length === 0) {
        return;
      }

      currentImageIndex =
        (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
      showImage(currentImageIndex);
    }

    function initLightbox() {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox) {
        return;
      }

      const closeBtn = lightbox.querySelector('.lightbox-close');
      const prevBtn = lightbox.querySelector('.lightbox-prev');
      const nextBtn = lightbox.querySelector('.lightbox-next');
      const overlay = lightbox.querySelector('.lightbox-overlay');

      document.querySelectorAll('.gallery-item').forEach((item) => {
        item.addEventListener('click', () => {
          openLightbox(item.getAttribute('data-id'));
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
      }

      if (overlay) {
        overlay.addEventListener('click', closeLightbox);
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          showNextImage();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          showPreviousImage();
        });
      }

      document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('active')) {
          return;
        }

        if (event.key === 'Escape') {
          closeLightbox();
        }

        if (event.key === 'ArrowRight') {
          showNextImage();
        }

        if (event.key === 'ArrowLeft') {
          showPreviousImage();
        }
      });
    }

    initLazyLoading();
    initFilters();
    initLightbox();

    // Update language if HTML lang attribute changes later
    const observer = new MutationObserver(() => {
      currentLang = detectLanguage();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
  });
})();
