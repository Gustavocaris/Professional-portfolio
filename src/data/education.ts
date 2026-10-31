import type { Localized } from '../i18n';

export type EducationStatus = 'ongoing' | 'completed' | 'paused';

export const statusLabels: Record<EducationStatus, Localized> = {
  ongoing: { pt: 'Em andamento', en: 'In progress' },
  completed: { pt: 'Concluído', en: 'Completed' },
  paused: { pt: 'Interrompido', en: 'Paused' },
};

export interface Education {
  course: Localized;
  institution: Localized;
  period: Localized;
  status: EducationStatus;
}

// TODO: preencher instituições e períodos.
export const education: Education[] = [
  {
    course: { pt: 'Engenharia de Software', en: 'Software Engineering' },
    institution: { pt: 'Nome da instituição', en: 'Institution name' },
    period: { pt: '20XX – atual', en: '20XX – present' },
    status: 'ongoing',
  },
  {
    course: { pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis and Development' },
    institution: { pt: 'Nome da instituição', en: 'Institution name' },
    period: { pt: '20XX – 20XX', en: '20XX – 20XX' },
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
