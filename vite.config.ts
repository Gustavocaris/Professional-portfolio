import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    assetsDir: 'static',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        certification: resolve(import.meta.dirname, 'certificacation.html'),
      },
    },
  },
});
