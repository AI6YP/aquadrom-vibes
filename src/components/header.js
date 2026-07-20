/**
 * Header and navigation components
 */

'use strict';

import { getTranslator } from '../i18n/index.js';

/**
 * Create site header with navigation
 */
export function createHeader(lang = 'ru', currentPage = 'works') {
  const t = getTranslator(lang);

  return [
    'header',
    { class: 'site-header' },
    [
      'div',
      { class: 'container' },
      [
        'div',
        { class: 'header-content' },
        [
          'div',
          { class: 'header-left' },
          [
            'div',
            { class: 'site-branding' },
            [
              'a',
              { href: '/', class: 'site-logo' },
              ['h1', { class: 'site-title' }, t('site.title')],
              ['p', { class: 'site-subtitle' }, t('site.subtitle')],
            ],
          ],
          [
            'nav',
            { class: 'main-nav', role: 'navigation' },
            [
              'ul',
              { class: 'nav-menu' },
              [
                'li',
                { class: currentPage === 'works' ? 'active' : '' },
                ['a', { href: '#gallery' }, t('nav.works')],
              ],
              [
                'li',
                { class: currentPage === 'blog' ? 'active' : '' },
                ['a', { href: '#blog' }, t('nav.blog')],
              ],
              [
                'li',
                { class: currentPage === 'about' ? 'active' : '' },
                ['a', { href: '#about' }, t('nav.about')],
              ],
              [
                'li',
                { class: currentPage === 'contacts' ? 'active' : '' },
                ['a', { href: '#contacts' }, t('nav.contacts')],
              ],
            ],
          ],
        ],
        [
          'div',
          { class: 'header-right' },
          [
            'button',
            {
              class: 'theme-toggle',
              'aria-label': t('aria.toggleDarkMode'),
              id: 'theme-toggle',
            },
            ['span', { class: 'theme-icon theme-icon-light' }, '☀️'],
            ['span', { class: 'theme-icon theme-icon-dark' }, '🌙'],
          ],
          [
            'div',
            { class: 'lang-switcher' },
            [
              'button',
              {
                class: lang === 'ru' ? 'lang-btn active' : 'lang-btn',
                'data-lang': 'ru',
              },
              'RU',
            ],
            ['span', { class: 'lang-sep' }, '/'],
            [
              'button',
              {
                class: lang === 'en' ? 'lang-btn active' : 'lang-btn',
                'data-lang': 'en',
              },
              'EN',
            ],
          ],
        ],
      ],
    ],
  ];
}
