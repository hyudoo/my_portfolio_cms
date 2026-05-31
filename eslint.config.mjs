import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierRecommended,

  {
    languageOptions: {
      globals: {
        node: true,
      },
    },

    rules: {
      'no-fallthrough': 'off',
      'no-empty': 'off',
      'prettier/prettier': 'warn',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-async-promise-executor': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/alt-text': 'off',
      'no-extend-native': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useDebounceEffect|useMemoRef|useCtrl$)',
        },
      ],
    },
  },

  {
    files: ['**/page.tsx', '**/layout.tsx', '**/loading.tsx'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      'react/display-name': 'off',
    },
  },

  // Ignore files
  globalIgnores([
    '.eslintrc.js',

    // Default ignores of eslint-config-next
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);
