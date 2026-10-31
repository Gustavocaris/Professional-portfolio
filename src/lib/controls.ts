import { getLang, onLangChange, setLang, t, type Lang } from '../i18n';
import { el, icon } from './dom';
import { flagBR, flagUS } from './flags';
import { getTheme, setTheme } from './theme';

/** Seletor de idioma (BR/EUA) + botão de tema. */
export function createControls(className = 'controls'): HTMLElement {
  const langButton = (lang: Lang, flag: SVGSVGElement, code: string): HTMLButtonElement => {
    const button = el('button', { type: 'button', class: 'lang-option', 'data-lang': lang }, [
      flag,
      el('span', { class: 'lang-code' }, [code]),
    ]);
    button.addEventListener('click', () => setLang(lang));
    return button;
  };

  const ptButton = langButton('pt', flagBR(), 'PT');
  const enButton = langButton('en', flagUS(), 'EN');
  const langGroup = el('div', { class: 'lang-switch', role: 'group' }, [ptButton, enButton]);

  const themeButton = el('button', { type: 'button', class: 'icon-button theme-toggle' }, [
    icon('fa-solid fa-sun theme-icon-light'),
    icon('fa-solid fa-moon theme-icon-dark'),
  ]);

  themeButton.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    updateLabels();
  });

  function updateLabels(): void {
    const lang = getLang();

    langGroup.setAttribute('aria-label', t('controls.language'));
    ptButton.setAttribute('aria-pressed', String(lang === 'pt'));
    ptButton.setAttribute('aria-label', t('controls.toPt'));
    enButton.setAttribute('aria-pressed', String(lang === 'en'));
    enButton.setAttribute('aria-label', t('controls.toEn'));
    themeButton.setAttribute('aria-label', t(getTheme() === 'dark' ? 'controls.toLight' : 'controls.toDark'));
  }

  updateLabels();
  onLangChange(updateLabels);

  return el('div', { class: className }, [langGroup, el('span', { class: 'controls-divider' }), themeButton]);
}
