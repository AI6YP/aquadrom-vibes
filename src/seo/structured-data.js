/**
 * Structured data (JSON-LD) generation for SEO
 */

'use strict';

import {blogPosts, galleryItems} from '../data/index.js';
import {getTranslator} from '../i18n/index.js';
import {LANGUAGE_LOCALES, SITE_NAME, SITE_URL} from '../constants/site.js';

/**
 * Create structured data (JSON-LD) for SEO
 * @param {string} lang - Language code ('ru' or 'en')
 * @returns {Array} ONML structure for JSON-LD scripts
 */
export function createStructuredData(lang = 'ru') {
  const t = getTranslator(lang);
  const language = ['ru', 'en'].includes(lang) ? lang : 'ru';
  const locale = LANGUAGE_LOCALES[language] ?? LANGUAGE_LOCALES.ru;
  const description = t('meta.description');

  // Website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description,
    url: SITE_URL,
    inLanguage: locale,
    author: {
      '@type': 'Person',
      name: t('site.author'),
      jobTitle: t('meta.authorJobTitle'),
    },
  };

  // Image gallery schema
  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: t('meta.galleryName'),
    description,
    url: SITE_URL,
    image: galleryItems.slice(0, 5).map((item) => ({
      '@type': 'ImageObject',
      name: item.title[language],
      description: item.description[language],
      contentUrl: `${SITE_URL}${item.image}`,
      thumbnailUrl: `${SITE_URL}${item.thumbnail}`,
      creator: {
        '@type': 'Person',
        name: t('site.author'),
      },
      dateCreated: item.year.toString(),
      artMedium: 'Watercolor',
      artform:
        item.category === 'seascape'
          ? 'Seascape painting'
          : item.category === 'landscape'
            ? 'Landscape painting'
            : 'Still life painting',
    })),
  };

  // Blog schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('meta.blogTitle'),
    description: t('meta.blogDescription'),
    url: `${SITE_URL}/blog`,
    author: {
      '@type': 'Person',
      name: t('site.author'),
    },
    blogPost: blogPosts.slice(0, 3).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title[language],
      description: post.excerpt[language],
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: t('site.author'),
      },
      image: `${SITE_URL}${post.image}`,
      keywords: post.keywords,
    })),
  };

  return [
    [
      'script',
      {type: 'application/ld+json'},
      JSON.stringify(websiteSchema, null, 2),
    ],
    [
      'script',
      {type: 'application/ld+json'},
      JSON.stringify(imageGallerySchema, null, 2),
    ],
    [
      'script',
      {type: 'application/ld+json'},
      JSON.stringify(blogSchema, null, 2),
    ],
  ];
}
