'use strict';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dromConfig = require('@drom/eslint-config/eslint9/node22.js');
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  // Apply drom config but override sourceType
  {
    ...dromConfig,
    languageOptions: {
      ...dromConfig.languageOptions,
      sourceType: 'module',
    },
  },
  prettierConfig,
  {
    rules: {
      'no-console': 'warn',
      strict: 'off', // Allow 'use strict' in modules if explicitly added
    },
  },
  // More lenient rules for scripts
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off', // Allow console in scripts
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn but allow unused vars prefixed with _
    },
  },
];
