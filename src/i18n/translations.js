/**
 * Translation resources loader
 */

'use strict';

import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ruTranslations = JSON.parse(
  readFileSync(join(__dirname, 'locales', 'ru.json'), 'utf-8'),
);
const enTranslations = JSON.parse(
  readFileSync(join(__dirname, 'locales', 'en.json'), 'utf-8'),
);

export const translations = {
  ru: {translation: ruTranslations},
  en: {translation: enTranslations},
};

export const supportedLanguages = ['ru', 'en'];

export const defaultLanguage = 'ru';
