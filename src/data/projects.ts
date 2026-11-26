import type { Localized } from '../i18n';

export type ProjectCategory = 'homelab' | 'data' | 'freelance' | 'studies';

export interface Project {
  title: Localized;
  description: Localized;
  /** Caminho relativo a public/, ex.: "image/projects/1.png". */
  image: string;
  category: ProjectCategory;
  repoUrl: string;
  liveUrl?: string;
}

// TODO: trocar pelos links de cada repositório.
const GITHUB = 'https://github.com/Gustavocaris';

// A ordem das chaves define a ordem das seções na página.
// Categoria sem projetos mostra o aviso "em manutenção".
// TODO: adicionar os projetos de HomeLabs Cloud e Desenvolvimentos Freelance.
export const categories: Record<ProjectCategory, Localized> = {
  homelab: { pt: 'HomeLabs Cloud', en: 'Cloud HomeLabs' },
  data: { pt: 'Data Science', en: 'Data Science' },
  freelance: { pt: 'Desenvolvimentos Freelance', en: 'Freelance Work' },
  studies: { pt: 'Estudos e imersões', en: 'Studies and immersions' },
};

export const projects: Project[] = [
  {
    title: { pt: 'Face Detector', en: 'Face Detector' },
    description: {
      pt: 'Detecta rostos em tempo real com Python. Captura imagens da webcam, identifica faces e desenha um quadrado ao redor delas.',
      en: 'Real-time face detection with Python. Captures webcam frames, finds faces and draws a box around them.',
    },
    image: 'image/projects/2.png',
    category: 'data',
    repoUrl: GITHUB,
  },
  {
    title: { pt: 'Análise de Churn', en: 'Churn Analysis' },
    description: {
      pt: 'Investigação do aumento no cancelamento de clientes de uma empresa de cartões de crédito e dos fatores que levam ao churn.',
      en: 'Investigation of rising customer cancellations at a credit card company and the factors that drive churn.',
    },
    image: 'image/projects/3.png',
    category: 'data',
    repoUrl: GITHUB,
  },
  {
    title: { pt: 'Algoritmos de Machine Learning', en: 'Machine Learning Algorithms' },
    description: {
      pt: 'Modelos que aprendem padrões a partir de dados para realizar previsões e classificações.',
      en: 'Models that learn patterns from data to make predictions and classifications.',
    },
    image: 'image/projects/4.png',
    category: 'data',
    repoUrl: GITHUB,
  },
  {
    title: { pt: 'Análise de Vendas', en: 'Sales Analysis' },
    description: {
      pt: 'Estratégias para aumentar as vendas e atrair clientes para uma rede de cinco lojas de bermudas.',
      en: 'Strategies to grow sales and attract customers for a chain of five shorts stores.',
    },
    image: 'image/projects/1.png',
    category: 'data',
    repoUrl: GITHUB,
  },
  {
    title: { pt: 'Pet Life', en: 'Pet Life' },
    description: {
      pt: 'Site de uma marca dedicada ao bem-estar dos pets, com produtos e serviços de qualidade para animais.',
      en: 'Website for a brand devoted to pet wellbeing, offering quality products and services for animals.',
    },
    image: 'image/projects/5.png',
    category: 'studies',
    repoUrl: GITHUB,
  },
  {
    title: { pt: 'Spotify', en: 'Spotify' },
    description: {
      pt: 'Recriação do front-end de uma plataforma de streaming com faixas, podcasts e playlists.',
      en: 'Front-end recreation of a streaming platform with tracks, podcasts and playlists.',
    },
    image: 'image/projects/6.png',
    category: 'studies',
    repoUrl: GITHUB,
  },
  {
    title: { pt: 'Portfolio V.1', en: 'Portfolio V.1' },
    description: {
      pt: 'Primeira versão do meu portfólio, feita com HTML, CSS e JavaScript.',
      en: 'The first version of my portfolio, built with HTML, CSS and JavaScript.',
    },
    image: 'image/projects/9.png',
    category: 'studies',
    repoUrl: GITHUB,
  },
];
