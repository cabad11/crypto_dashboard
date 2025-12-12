import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import nextTs from 'eslint-config-next/typescript';
import stylistic from '@stylistic/eslint-plugin';
import path from 'path';

const eslintConfig = defineConfig([
  stylistic.configs.recommended,
  {
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
      'better-tailwindcss/no-unregistered-classes': ['error', {
        detectComponentClasses: true,
      }],
      '@stylistic/semi': ['warn', 'always'],
      'react-hooks/set-state-in-effect': 'off',
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: path.resolve('./src/app/globals.css'),
      },
    },
  },
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
