type Attrs = Record<string, string | undefined>;
type Child = Node | string | null | undefined | false;

/** Cria um elemento com atributos e filhos. Textos viram text nodes (nunca innerHTML). */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: Child[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined) {
      node.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (child) {
      node.append(child);
    }
  }

  return node;
}

/** Ícone do Font Awesome, oculto para leitores de tela. */
export function icon(classes: string): HTMLElement {
  return el('i', { class: classes, 'aria-hidden': 'true' });
}

/** Link externo que abre em nova aba. */
export function externalLink(href: string, children: Child[], className?: string): HTMLAnchorElement {
  return el('a', { href, class: className, target: '_blank', rel: 'noopener' }, children);
}
