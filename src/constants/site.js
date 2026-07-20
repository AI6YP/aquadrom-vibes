/**
 * Shared site-wide constants
 */

'use strict';

export const SITE_NAME = 'AquaDrom';
export const SITE_URL = 'https://aqua.drom.io';
export const SITE_DEFAULT_IMAGE_PATH =
  '/images/contre-jour-watercolor-study-ocean-waves.jpg';
export const SITE_DEFAULT_IMAGE_URL = `${SITE_URL}${SITE_DEFAULT_IMAGE_PATH}`;

export const SITE_SOCIAL_HANDLES = {
  twitter: '@wavedrom',
  instagram: '@wavedrom',
};

export const LANGUAGE_LOCALES = {
  ru: 'ru-RU',
  en: 'en-US',
};

export const CANONICAL_PATHS = {
  ru: '',
  en: '/en',
};

export const FONT_RESOURCES = {
  preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  stylesheet:
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Raleway:wght@300;400;500;600&display=swap',
};

export const CLIENT_SCRIPT_PATHS = {
  header: '/scripts/header.js',
  gallery: '/scripts/gallery.js',
};

export const ALTERNATE_LINKS = {
  ru: `${SITE_URL}/`,
  en: `${SITE_URL}/en`,
  default: `${SITE_URL}/`,
};
