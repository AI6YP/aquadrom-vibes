/**
 * Main page builder using ONML
 */

'use strict';

import onml from 'onml';
import {createHeader} from './components/header.js';
import {createGallery, createGalleryDataScript,} from './components/gallery.js';
import {createAbout, createBlog, createContacts} from './components/blog.js';
import {createFooter} from './components/footer.js';
import {createSEOTags} from './seo/meta-tags.js';
import {createStructuredData} from './seo/structured-data.js';
import {getTranslator, initI18n} from './i18n/index.js';
import {translations} from './i18n/translations.js';
import {CLIENT_SCRIPT_PATHS, FONT_RESOURCES, LANGUAGE_LOCALES,} from './constants/site.js';

/**
 * Create complete HTML page
 * @param {string} lang - Language code ('ru' or 'en')
 * @returns {string} HTML string
 */
export async function createPage(lang = 'ru') {
  const language = ['ru', 'en'].includes(lang) ? lang : 'ru';

  // Initialize i18next
  await initI18n(translations, language);
  const t = getTranslator(language);

  const langAttr = LANGUAGE_LOCALES[language] ?? LANGUAGE_LOCALES.ru;
  const title = t('meta.pageTitle');
  const fontPreconnectLinks = FONT_RESOURCES.preconnect.map((href) => {
    const attrs = {rel: 'preconnect', href};
    if (href.includes('gstatic')) {
      attrs.crossorigin = '';
    }
    return ['link', attrs];
  });

  // Build page structure using ONML
  const page = [
    'html',
    {lang: langAttr},
    [
      'head',
      ['meta', {charset: 'UTF-8'}],
      [
        'meta',
        {name: 'viewport', content: 'width=device-width, initial-scale=1.0'},
      ],
      ['title', title],

      // SEO meta tags
      ...createSEOTags(lang),

      // Fonts
      ...fontPreconnectLinks,
      ['link', {rel: 'stylesheet', href: FONT_RESOURCES.stylesheet}],

      // Styles
      ['link', {rel: 'stylesheet', href: '/styles/main.css'}],
      ['link', {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'}],

      // Structured data
      ...createStructuredData(lang),
    ],
    [
      'body',
      createHeader(language, 'works'),
      [
        'main',
        {class: 'main-content'},
        createGallery(language),
        createBlog(language),
        createAbout(language),
        createContacts(language),
      ],
      createFooter(language),
      createGalleryDataScript(),
      ['script', {src: CLIENT_SCRIPT_PATHS.header, defer: true}],
      ['script', {src: CLIENT_SCRIPT_PATHS.gallery, defer: true}],
    ],
  ];

  // Convert ONML to HTML string
  let html = '<!DOCTYPE html>\n' + onml.stringify(page, 2);

  // Fix self-closing script tags (HTML requires script tags to have closing tags)
  html = html.replace(/<script([^>]*)\/>/g, '<script$1></script>');

  return html;
}

/**
 * Generate static HTML files
 * @returns {Object} Object with filename -> HTML content mapping
 */
export async function build() {
  console.log('🏗️  Building AquaDrom Gallery...\n');

  return {
    'index.html': await createPage('ru'),
    'index-en.html': await createPage('en'),
  };
}
