import { education, skills, statusLabels, type Education } from '../data/education';
import { l, t } from '../i18n';
import { el } from '../lib/dom';
import { mountPage, section } from '../lib/layout';

function timelineItem(item: Education): HTMLElement {
  const statusClass = item.status === 'paused' ? 'status status-paused' : 'status status-active';

  return el('li', { class: 'timeline-item' }, [
    el('div', { class: 'timeline-head' }, [
      el('h3', { class: 'timeline-title' }, [l(item.course)]),
      el('span', { class: statusClass }, [l(statusLabels[item.status])]),
    ]),
    el('p', { class: 'row-meta' }, [`${l(item.institution)} · ${l(item.period)}`]),
  ]);
}

mountPage({
  path: 'formacao',
  title: 'education.title',
  lead: 'education.lead',
  render: () => [
    section(t('education.academic'), [el('ol', { class: 'timeline' }, education.map(timelineItem))]),
    section(t('education.skills'), [
      el('ul', { class: 'badges' }, skills.map((skill) => el('li', { class: 'badge' }, [skill]))),
    ]),
  ],
});
