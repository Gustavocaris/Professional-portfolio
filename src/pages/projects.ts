import { categories, projects, type Project, type ProjectCategory } from '../data/projects';
import { l, t } from '../i18n';
import { el, externalLink, icon } from '../lib/dom';
import { mountPage, section } from '../lib/layout';

function projectCard(project: Project): HTMLElement {
  return el('article', { class: 'project' }, [
    el('img', {
      class: 'project-image',
      src: project.image,
      alt: `${t('projects.preview')} ${l(project.title)}`,
      loading: 'lazy',
    }),
    el('div', { class: 'project-body' }, [
      el('h3', { class: 'project-title' }, [l(project.title)]),
      el('p', { class: 'project-description' }, [l(project.description)]),
      el('div', { class: 'project-links' }, [
        externalLink(project.repoUrl, [icon('fa-brands fa-github'), t('projects.code')], 'chip-link'),
        project.liveUrl &&
          externalLink(
            project.liveUrl,
            [icon('fa-solid fa-arrow-up-right-from-square'), t('projects.site')],
            'chip-link',
          ),
      ]),
    ]),
  ]);
}

mountPage({
  path: 'projetos',
  title: 'projects.title',
  lead: 'projects.lead',
  render: () =>
    (Object.keys(categories) as ProjectCategory[]).map((category) =>
      section(l(categories[category]), [
        el('div', { class: 'project-grid' }, projects.filter((p) => p.category === category).map(projectCard)),
      ]),
    ),
});
