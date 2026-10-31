export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

// O script inline do <head> já aplicou data-theme antes da pintura.
export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Sem storage: o tema vale só nesta página.
  }
}
