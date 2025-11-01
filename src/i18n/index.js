/**
 * i18next configuration for both server and client
 */

'use strict';

import i18next from 'i18next';

/**
 * Initialize i18next with translations
 * @param {Object} translations - Translation resources
 * @param {string} lng - Language code
 * @returns {Promise} Promise that resolves when i18n is initialized
 */
export async function initI18n(translations, lng = 'ru') {
  await i18next.init({
    lng,
    fallbackLng: 'ru',
    resources: translations,
    interpolation: {
      escapeValue: false, // Not needed for non-DOM usage
    },
    returnNull: false,
    returnEmptyString: false,
  });

  return i18next;
}

/**
 * Get translation function bound to specific language
 * @param {string} lng - Language code
 * @returns {Function} Translation function
 */
export function getTranslator(lng = 'ru') {
  return i18next.getFixedT(lng);
}

export default i18next;
