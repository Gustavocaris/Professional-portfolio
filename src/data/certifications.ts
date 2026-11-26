import type { Localized } from '../i18n';

/** Categorias usadas nos filtros da página de certificações. */
export type CertificationCategory = 'cloud' | 'support' | 'leadership' | 'hackathon' | 'bootcamp';

export interface Certification {
  title: Localized;
  issuer: Localized;
  /** Data de conclusão no formato 'AAAA-MM' (usada para ordenar; a página exibe só o ano). */
  date: string;
  category: CertificationCategory;
  url: string;
}

// TODO: substituir pelos certificados reais.
const example: Omit<Certification, 'date' | 'category'> = {
  title: { pt: 'Nome da certificação', en: 'Certification name' },
  issuer: { pt: 'Instituição emissora', en: 'Issuing organization' },
  url: '#',
};

// A ordem aqui não importa: a página ordena do mais recente para o mais antigo.
export const certifications: Certification[] = [
  { ...example, date: '2025-06', category: 'cloud' },
  { ...example, date: '2024-11', category: 'support' },
  { ...example, date: '2024-03', category: 'bootcamp' },
  { ...example, date: '2025-02', category: 'hackathon' },
];
