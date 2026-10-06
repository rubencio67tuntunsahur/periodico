// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dirección pública. Si más adelante se usa un dominio propio, basta con
// definir SITE_URL=https://midominio.es y BASE_PATH=/ al compilar.
const site = process.env.SITE_URL ?? 'https://rubencio67tuntunsahur.github.io';
const base = process.env.BASE_PATH ?? '/periodico';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: { format: 'directory' },
});
