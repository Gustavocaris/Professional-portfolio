import type { Localized } from '../i18n';

export interface Certification {
  title: Localized;
  issuer: Localized;
  year: string;
  url: string;
}

// TODO: substituir pelos certificados reais.
const example: Omit<Certification, 'year'> = {
  title: { pt: 'Nome da certificação', en: 'Certification name' },
  issuer: { pt: 'Instituição emissora', en: 'Issuing organization' },
  url: '#',
};

export const certifications: Certification[] = [
  { ...example, year: '2025' },
  { ...example, year: '2024' },
  { ...example, year: '2024' },
];
