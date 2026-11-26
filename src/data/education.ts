import type { Localized } from '../i18n';

export type EducationStatus = 'ongoing' | 'completed' | 'paused';

export const statusLabels: Record<EducationStatus, Localized> = {
  ongoing: { pt: 'Em andamento', en: 'In progress' },
  completed: { pt: 'Formado', en: 'Graduated' },
  paused: { pt: 'Trancado', en: 'On hold' },
};

export interface Education {
  course: Localized;
  institution: Localized;
  period: Localized;
  status: EducationStatus;
}

export const education: Education[] = [
  {
    course: { pt: 'Bacharelado em Engenharia de Software', en: "Bachelor's in Software Engineering" },
    institution: { pt: 'UNOPAR, Universidade do Norte do Paraná', en: 'UNOPAR, Universidade do Norte do Paraná' },
    period: { pt: '2023 – 2026', en: '2023 – 2026' },
    status: 'completed',
  },
  {
    course: { pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis and Development' },
    institution: { pt: 'Unicesumar, Universidade Cesumar', en: 'Unicesumar, Universidade Cesumar' },
    period: { pt: '2020 – 2021', en: '2020 – 2021' },
    status: 'paused',
  },
];

export const skills: string[] = [
  'HTML/CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Git',
  'Python',
  'SQL',
  'Power BI',
  'Scrum',
  'Kanban',
];
