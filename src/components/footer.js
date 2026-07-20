/**
 * Footer component
 */

'use strict';

import { getTranslator } from '../i18n/index.js';

/**
 * Create site footer
 */
export function createFooter(lang = 'ru') {
  const t = getTranslator(lang);
  const year = new Date().getFullYear();
  const copyright = t('site.copyright', { year, author: t('site.author') });

  return [
    'footer',
    { class: 'site-footer' },
    [
      'div',
      { class: 'container' },
      [
        'div',
        { class: 'footer-content' },
        ['p', { class: 'copyright' }, copyright],
        ['p', { class: 'tech-note' }, t('site.techNote')],
      ],
    ],
  ];
}
