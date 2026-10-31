const pt = {
  'meta.role': 'Software Engineer · Frontend & Data',
  'home.avatarAlt': 'Foto de Gustavo Caris',
  'home.links': 'Links',
  'home.stack': 'Tecnologias',
  'link.projects': 'Projetos',
  'link.certifications': 'Certificações',
  'link.education': 'Formação',
  'link.email': 'E-mail',

  'controls.language': 'Idioma',
  'controls.toPt': 'Mudar para português',
  'controls.toEn': 'Mudar para inglês',
  'controls.toLight': 'Ativar tema claro',
  'controls.toDark': 'Ativar tema escuro',
  'nav.back': 'voltar',

  'projects.title': 'Projetos',
  'projects.lead': 'Alguns projetos de Data Science e Front-end.',
  'projects.code': 'Código',
  'projects.site': 'Site',
  'projects.preview': 'Prévia do projeto',

  'certifications.title': 'Certificações',
  'certifications.lead': 'Cursos e certificações que concluí.',

  'education.title': 'Formação',
  'education.lead': 'Minha trajetória acadêmica e as tecnologias com que trabalho.',
  'education.academic': 'Acadêmica',
  'education.skills': 'Skills',
};

export type MessageKey = keyof typeof pt;

const en: Record<MessageKey, string> = {
  'meta.role': 'Software Engineer · Frontend & Data',
  'home.avatarAlt': 'Photo of Gustavo Caris',
  'home.links': 'Links',
  'home.stack': 'Tech stack',
  'link.projects': 'Projects',
  'link.certifications': 'Certifications',
  'link.education': 'Education',
  'link.email': 'Email',

  'controls.language': 'Language',
  'controls.toPt': 'Switch to Portuguese',
  'controls.toEn': 'Switch to English',
  'controls.toLight': 'Switch to light theme',
  'controls.toDark': 'Switch to dark theme',
  'nav.back': 'back',

  'projects.title': 'Projects',
  'projects.lead': 'Some of my Data Science and Front-end projects.',
  'projects.code': 'Code',
  'projects.site': 'Website',
  'projects.preview': 'Preview of the project',

  'certifications.title': 'Certifications',
  'certifications.lead': 'Courses and certifications I have completed.',

  'education.title': 'Education',
  'education.lead': 'My academic background and the technologies I work with.',
  'education.academic': 'Academic',
  'education.skills': 'Skills',
};

export const messages = { pt, en };
