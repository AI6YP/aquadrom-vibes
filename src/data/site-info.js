/**
 * Site information and navigation labels
 */

'use strict';

import {
  SITE_DEFAULT_IMAGE_PATH,
  SITE_NAME,
  SITE_SOCIAL_HANDLES,
  SITE_URL,
} from '../constants/site.js';

export const siteInfo = {
  title: {
    ru: SITE_NAME,
    en: SITE_NAME,
  },
  subtitle: {
    ru: 'Мир в акварели',
    en: 'World in watercolors',
  },
  author: {
    ru: 'Дмитрий Романов',
    en: 'Dmitry Romanov',
  },
  description: {
    ru: 'Галерея акварельных работ Дмитрия Романова: морские пейзажи, пустынные ландшафты, натюрморты. Техника Contre-jour, пленэр, зарисовки природы.',
    en: 'Dmitry Romanov watercolor gallery: seascapes, desert landscapes, still life. Contre-jour technique, plein air, nature sketches.',
  },
  keywords: {
    ru: 'акварель, галерея, пейзаж, морской пейзаж, натюрморт, Дмитрий Романов, contre-jour, пленэр',
    en: 'watercolor, gallery, landscape, seascape, still life, Dmitry Romanov, contre-jour, plein air',
  },
  url: SITE_URL,
  image: SITE_DEFAULT_IMAGE_PATH,
  social: {
    twitter: SITE_SOCIAL_HANDLES.twitter,
    facebook: SITE_SOCIAL_HANDLES.facebook,
  },
};

export const navigation = {
  works: { ru: 'Работы', en: 'Works' },
  about: { ru: 'Немного обо мне', en: 'About Me' },
  blog: { ru: 'Блог', en: 'Blog' },
  contacts: { ru: 'Контакты', en: 'Contacts' },
};
