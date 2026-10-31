import { certifications, type Certification } from '../data/certifications';
import { l } from '../i18n';
import { el, externalLink, icon } from '../lib/dom';
import { mountPage } from '../lib/layout';

function certificationRow(cert: Certification): HTMLElement {
  return el('li', {}, [
    externalLink(
      cert.url,
      [
        el('span', { class: 'row-icon' }, [icon('fa-solid fa-award')]),
        el('span', { class: 'row-text' }, [
          el('span', { class: 'row-title' }, [l(cert.title)]),
          el('span', { class: 'row-meta' }, [`${l(cert.issuer)} · ${cert.year}`]),
        ]),
        icon('fa-solid fa-arrow-up-right-from-square row-arrow'),
      ],
      'row',
    ),
  ]);
}

mountPage({
  path: 'certificacoes',
  title: 'certifications.title',
  lead: 'certifications.lead',
  render: () => [el('ul', { class: 'row-list' }, certifications.map(certificationRow))],
});
