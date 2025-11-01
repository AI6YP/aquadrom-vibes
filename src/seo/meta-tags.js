/**
 * SEO meta tags generation
 */

'use strict';

import {getTranslator} from '../i18n/index.js';
import {
  ALTERNATE_LINKS,
  CANONICAL_PATHS,
  LANGUAGE_LOCALES,
  SITE_DEFAULT_IMAGE_URL,
  SITE_NAME,
  SITE_SOCIAL_HANDLES,
  SITE_URL,
} from '../constants/site.js';

/**
 * Create SEO meta tags
 * @param {string} lang - Language code ('ru' or 'en')
 * @returns {Array} ONML structure for meta tags
 */
export function createSEOTags(lang = 'ru') {
  const t = getTranslator(lang);
  const language = ['ru', 'en'].includes(lang) ? lang : 'ru';
  const title = t('meta.pageTitle');
  const description = t('meta.description');
  const keywords = t('meta.keywords');
  const canonicalPath = CANONICAL_PATHS[language] ?? CANONICAL_PATHS.ru;
  const url = `${SITE_URL}${canonicalPath}`;
  const image = SITE_DEFAULT_IMAGE_URL;
  const locale = LANGUAGE_LOCALES[language] ?? LANGUAGE_LOCALES.ru;

  return [
    // Basic meta tags
    ['meta', {name: 'description', content: description}],
    ['meta', {name: 'keywords', content: keywords}],
    ['meta', {name: 'author', content: t('site.author')}],
    ['meta', {name: 'robots', content: 'index, follow'}],
    ['link', {rel: 'canonical', href: url}],

    // Open Graph (Facebook, LinkedIn)
    ['meta', {property: 'og:type', content: 'website'}],
    ['meta', {property: 'og:title', content: title}],
    ['meta', {property: 'og:description', content: description}],
    ['meta', {property: 'og:url', content: url}],
    ['meta', {property: 'og:image', content: image}],
    ['meta', {property: 'og:image:width', content: '1200'}],
    ['meta', {property: 'og:image:height', content: '630'}],
    ['meta', {property: 'og:site_name', content: SITE_NAME}],
    ['meta', {property: 'og:locale', content: locale.replace('-', '_')}],

    // Twitter Card
    ['meta', {name: 'twitter:card', content: 'summary_large_image'}],
    ['meta', {name: 'twitter:title', content: title}],
    ['meta', {name: 'twitter:description', content: description}],
    ['meta', {name: 'twitter:image', content: image}],
    ['meta', {name: 'twitter:creator', content: SITE_SOCIAL_HANDLES.twitter}],

    // Alternate languages
    ['link', {rel: 'alternate', hreflang: 'ru', href: ALTERNATE_LINKS.ru}],
    ['link', {rel: 'alternate', hreflang: 'en', href: ALTERNATE_LINKS.en}],
    [
      'link',
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: ALTERNATE_LINKS.default,
      },
    ],
  ];
}
