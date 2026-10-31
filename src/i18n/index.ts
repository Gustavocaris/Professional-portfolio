import { messages, type MessageKey } from './messages';

export type { MessageKey };

export type Lang = 'pt' | 'en';

/** Texto com versão em cada idioma, usado nos arquivos de src/data. */
export type Localized = Record<Lang, string>;

const STORAGE_KEY = 'lang';
const listeners = new Set<(lang: Lang) => void>();

// O script inline do <head> já definiu <html lang> antes da pintura.
let current: Lang = document.documentElement.lang.startsWith('en') ? 'en' : 'pt';

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang): void {
  if (lang === current) {
    return;
  }

  current = lang;
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Sem storage (aba anônima etc.): a escolha vale só nesta página.
  }

  listeners.forEach((listener) => listener(lang));
}

export function onLangChange(listener: (lang: Lang) => void): void {
  listeners.add(listener);
}

export function t(key: MessageKey): string {
  return messages[current][key];
}

/** Escolhe a versão do idioma atual de um texto traduzível. */
export function l(text: Localized): string {
  return text[current];
}

/** Aplica traduções nos elementos estáticos marcados com data-i18n / data-i18n-alt / data-i18n-label. */
export function translateStatic(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n as MessageKey);
  });

  root.querySelectorAll<HTMLElement>('[data-i18n-alt]').forEach((node) => {
    node.setAttribute('alt', t(node.dataset.i18nAlt as MessageKey));
  });

  root.querySelectorAll<HTMLElement>('[data-i18n-label]').forEach((node) => {
    node.setAttribute('aria-label', t(node.dataset.i18nLabel as MessageKey));
  });
}
