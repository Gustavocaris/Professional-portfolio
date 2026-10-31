import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const page = (file: string) => resolve(import.meta.dirname, file);

export default defineConfig({
  base: './',
  build: {
    assetsDir: 'static',
    rollupOptions: {
      input: {
        home: page('index.html'),
        projects: page('projetos.html'),
        certifications: page('certificacoes.html'),
        education: page('formacao.html'),
      },
    },
  },
});
