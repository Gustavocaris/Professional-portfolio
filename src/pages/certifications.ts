import { certifications, type Certification, type CertificationCategory } from '../data/certifications';
import { l, t, type MessageKey } from '../i18n';
import { el, externalLink, icon } from '../lib/dom';
import { mountPage } from '../lib/layout';

type Filter = 'all' | CertificationCategory;

const filters: { id: Filter; label: MessageKey }[] = [
  { id: 'all', label: 'certifications.filter.all' },
  { id: 'cloud', label: 'certifications.filter.cloud' },
  { id: 'support', label: 'certifications.filter.support' },
  { id: 'leadership', label: 'certifications.filter.leadership' },
  { id: 'hackathon', label: 'certifications.filter.hackathon' },
  { id: 'bootcamp', label: 'certifications.filter.bootcamp' },
];

// Mais recentes primeiro.
const sorted = [...certifications].sort((a, b) => b.date.localeCompare(a.date));

// Fica fora do render para o filtro escolhido sobreviver à troca de idioma.
let active: Filter = 'all';

function matches(cert: Certification, filter: Filter): boolean {
  return filter === 'all' || cert.category === filter;
}

function certificationRow(cert: Certification): HTMLElement {
  return el('li', {}, [
    externalLink(
      cert.url,
      [
        el('span', { class: 'row-icon' }, [icon('fa-solid fa-award')]),
        el('span', { class: 'row-text' }, [
          el('span', { class: 'row-title' }, [l(cert.title)]),
          el('span', { class: 'row-meta' }, [`${l(cert.issuer)} · ${cert.date.slice(0, 4)}`]),
        ]),
        icon('fa-solid fa-arrow-up-right-from-square row-arrow'),
      ],
      'row',
    ),
  ]);
}

function render(): Node[] {
  const list = el('ul', { class: 'row-list' });

  function fillList(): void {
    const visible = sorted.filter((cert) => matches(cert, active));

    list.replaceChildren(
      ...(visible.length > 0
        ? visible.map(certificationRow)
        : [el('li', { class: 'empty-state' }, [t('certifications.empty')])]),
    );
  }

  const buttons = filters.map(({ id, label }) => {
    const count = sorted.filter((cert) => matches(cert, id)).length;
    const button = el('button', { type: 'button', class: 'filter-chip', 'aria-pressed': String(id === active) }, [
      t(label),
      el('span', { class: 'filter-count' }, [String(count)]),
    ]);

    button.addEventListener('click', () => {
      active = id;
      buttons.forEach((other, index) => other.setAttribute('aria-pressed', String(filters[index].id === id)));
      fillList();
    });

    return button;
  });

  fillList();

  return [el('div', { class: 'filter-bar', role: 'group', 'aria-label': t('certifications.filter.label') }, buttons), list];
}

mountPage({
  path: 'certificacoes',
  title: 'certifications.title',
  lead: 'certifications.lead',
  render,
});
