/**
 * Blog components
 */

'use strict';

import {blogPosts} from '../data/index.js';
import {getTranslator} from '../i18n/index.js';

/**
 * Create blog post card
 */
export function createBlogPostCard(post, lang = 'ru') {
  // const t = getTranslator(lang);
  const dateObj = new Date(post.date);
  const dateStr = dateObj.toLocaleDateString(
    lang === 'ru' ? 'ru-RU' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  return [
    'article',
    {class: 'blog-post-card', 'data-post-id': post.id},
    post.image
      ? [
        'div',
        {class: 'post-image'},
        [
          'img',
          {
            src: post.image,
            alt: post.title[lang],
            loading: 'lazy',
          },
        ],
      ]
      : null,
    [
      'div',
      {class: 'post-content'},
      ['time', {class: 'post-date', datetime: post.date}, dateStr],
      ['h3', {class: 'post-title'}, post.title[lang]],
      ['p', {class: 'post-excerpt'}, post.excerpt[lang]],
    ],
  ].filter(Boolean);
}

/**
 * Create blog section
 */
export function createBlog(lang = 'ru') {
  const t = getTranslator(lang);
  const posts = blogPosts.map((post) => createBlogPostCard(post, lang));

  return [
    'section',
    {id: 'blog', class: 'blog-section'},
    [
      'div',
      {class: 'container'},
      ['h2', {class: 'section-title'}, t('blog.title')],
      ['div', {class: 'blog-grid'}, ...posts],
    ],
  ];
}

/**
 * Create about section
 */
export function createAbout(lang = 'ru') {
  const t = getTranslator(lang);
  const textParagraphs = [t('about.text1'), t('about.text2'), t('about.text3')];

  return [
    'section',
    {id: 'about', class: 'about-section'},
    [
      'div',
      {class: 'container'},
      ['h2', {class: 'section-title'}, t('about.title')],
      [
        'div',
        {class: 'about-content'},
        ...textParagraphs.map((p) => ['p', p]),
      ],
    ],
  ];
}

/**
 * Create contacts section
 */
export function createContacts(lang = 'ru') {
  const t = getTranslator(lang);

  return [
    'section',
    {id: 'contacts', class: 'contacts-section'},
    [
      'div',
      {class: 'container'},
      ['h2', {class: 'section-title'}, t('contacts.title')],
      [
        'div',
        {class: 'contacts-content'},
        [
          'div',
          {class: 'contact-item'},
          ['h3', t('contacts.email')],
          ['a', {href: 'mailto:info@aquadrom.art'}, 'info@aquadrom.art'],
        ],
      ],
    ],
  ];
}
