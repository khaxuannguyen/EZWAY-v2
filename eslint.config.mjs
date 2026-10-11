import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: {
    // Public links use native navigation: no speculative prefetch of tracking URLs.
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-location-assign-relative-destination': 'off',
    // Assets are pre-optimized WebP with explicit sizes; no hosted image service required.
    '@next/next/no-img-element': 'off',
  } },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
