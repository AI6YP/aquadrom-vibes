/**
 * Gallery component with filtering, lazy loading, and lightbox
 */

'use strict';

import {galleryItems} from '../data/index.js';
import {createPictureElement} from '../utils/responsive-images.js';
import {getTranslator} from '../i18n/index.js';

/**
 * Create gallery grid item
 */
export function createGalleryItem(item, lang = 'ru') {
  const t = getTranslator(lang);
  const soldOverlay = item.sold
    ? ['div', {class: 'sold-badge'}, t('gallery.sold')]
    : null;

  // Use responsive picture element with optimized images
  const thumbnailImage = createPictureElement(
    item.thumbnail,
    item.alt ? item.alt[lang] : item.title[lang],
    'gallery-image',
    {
      loading: 'lazy',
      sizes: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px',
    },
  );

  return [
    'div',
    {
      class: 'gallery-item',
      'data-category': item.category,
      'data-year': item.year,
      'data-id': item.id,
    },
    [
      'div',
      {class: 'gallery-item-inner'},
      thumbnailImage,
      [
        'div',
        {class: 'gallery-overlay'},
        [
          'div',
          {class: 'gallery-info'},
          ['h3', {class: 'gallery-title'}, item.title[lang]],
          [
            'p',
            {class: 'gallery-meta'},
            ['span', {class: 'gallery-size'}, item.size],
            ['span', {class: 'gallery-year'}, item.year.toString()],
          ],
        ],
        soldOverlay,
      ].filter(Boolean),
    ],
  ];
}

/**
 * Create category filter buttons
 */
export function createCategoryFilter(lang = 'ru') {
  const t = getTranslator(lang);

  // Dynamically get categories from gallery items
  const uniqueCategories = [...new Set(galleryItems.map((item) => item.category))];

  // Map category slugs to i18n keys
  const categoryToI18nKey = {
    'seascape': 'seascape',
    'landscape': 'landscape',
    'still-life': 'stillLife',
  };

  // Build category buttons dynamically
  const buttons = [
    // Always include "all" button
    [
      'button',
      {
        class: 'filter-btn active',
        'data-category': 'all',
      },
      t('categories.all'),
    ],
    // Add buttons for each category that exists in gallery items
    ...uniqueCategories
      .sort()
      .map((categorySlug) => {
        const i18nKey = categoryToI18nKey[categorySlug] || categorySlug;
        return [
          'button',
          {
            class: 'filter-btn',
            'data-category': categorySlug,
          },
          t(`categories.${i18nKey}`),
        ];
      }),
  ];

  return [
    'div',
    {class: 'gallery-filters'},
    ['h2', {class: 'filters-title'}, t('gallery.categories')],
    ['div', {class: 'filter-buttons'}, ...buttons],
  ];
}

/**
 * Create year filter
 */
export function createYearFilter(lang = 'ru') {
  const t = getTranslator(lang);
  const years = [...new Set(galleryItems.map((item) => item.year))].sort(
    (a, b) => b - a,
  );

  const options = [
    ['option', {value: 'all'}, t('gallery.allYears')],
    ...years.map((year) => [
      'option',
      {value: year.toString()},
      year.toString(),
    ]),
  ];

  return [
    'div',
    {class: 'year-filter'},
    ['label', {for: 'year-select'}, t('gallery.year')],
    ['select', {id: 'year-select', class: 'year-select'}, ...options],
  ];
}

/**
 * Create full gallery section
 */
export function createGallery(lang = 'ru') {
  const t = getTranslator(lang);
  const items = galleryItems.map((item) => createGalleryItem(item, lang));

  return [
    'section',
    {id: 'gallery', class: 'gallery-section'},
    [
      'div',
      {class: 'container'},
      [
        'div',
        {class: 'gallery-header'},
        createCategoryFilter(lang),
        createYearFilter(lang),
      ],
      ['div', {class: 'gallery-grid', id: 'gallery-grid'}, ...items],
      [
        'div',
        {id: 'lightbox', class: 'lightbox'},
        ['div', {class: 'lightbox-overlay'}],
        [
          'div',
          {class: 'lightbox-content'},
          [
            'button',
            {class: 'lightbox-close', 'aria-label': t('aria.close')},
            '×',
          ],
          [
            'button',
            {class: 'lightbox-prev', 'aria-label': t('aria.previous')},
            '‹',
          ],
          [
            'button',
            {class: 'lightbox-next', 'aria-label': t('aria.next')},
            '›',
          ],
          ['img', {class: 'lightbox-image', src: '', alt: ''}],
          [
            'div',
            {class: 'lightbox-info'},
            ['h3', {class: 'lightbox-title'}],
            ['p', {class: 'lightbox-meta'}],
          ],
        ],
      ],
    ],
  ];
}

/**
 * Gallery data bridge for client-side scripts
 */
export function createGalleryDataScript() {
  return [
    'script',
    {type: 'application/json', id: 'gallery-data'},
    JSON.stringify(galleryItems),
  ];
}
