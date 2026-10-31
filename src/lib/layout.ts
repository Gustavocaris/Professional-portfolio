import { getLang, onLangChange, t, type Lang, type MessageKey } from '../i18n';
import { createControls } from './controls';
import { el, icon } from './dom';

interface PageOptions {
  /** Caminho exibido na barra superior, ex.: "projetos". */
  path: string;
  title: MessageKey;
  lead: MessageKey;
  /** Monta o conteúdo da página; é chamado de novo quando o idioma muda. */
  render: (lang: Lang) => Node[];
}

/** Monta a estrutura padrão das páginas internas dentro de #app. */
export function mountPage({ path, title, lead, render }: PageOptions): void {
  const app = document.getElementById('app');

  if (!app) {
    return;
  }

  const backLabel = el('span', {}, [t('nav.back')]);

  const topBar = el('header', { class: 'top-bar' }, [
    el('a', { class: 'top-bar-back', href: 'index.html' }, [icon('fa-solid fa-arrow-left'), backLabel]),
    el('span', { class: 'top-bar-path' }, [el('span', { class: 'accent' }, ['~']), `/gustavo-caris/${path}`]),
    createControls(),
  ]);

  const main = el('main', { class: 'page' });
  const footer = el('footer', { class: 'footer' }, [`© ${new Date().getFullYear()} Gustavo Caris`]);

  function renderMain(lang: Lang): void {
    backLabel.textContent = t('nav.back');
    document.title = `${t(title)} · Gustavo Caris`;

    main.replaceChildren(
      el('header', { class: 'page-header' }, [
        el('h1', { class: 'page-title' }, [t(title)]),
        el('p', { class: 'page-lead' }, [t(lead)]),
      ]),
      ...render(lang),
    );
  }

  renderMain(getLang());
  onLangChange(renderMain);

  app.append(topBar, main, footer);
}

/** Seção com título no estilo "// título". */
export function section(title: string, children: Node[]): HTMLElement {
  return el('section', { class: 'section' }, [
    el('h2', { class: 'section-title' }, [el('span', { class: 'accent' }, ['// ']), title]),
    ...children,
  ]);
}
