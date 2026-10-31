import type { SimpleIcon } from 'simple-icons';

import { stack } from '../data/stack';
import { onLangChange, translateStatic } from '../i18n';
import { createControls } from '../lib/controls';
import { el } from '../lib/dom';

const SVG_NS = 'http://www.w3.org/2000/svg';

function brandIcon({ path }: SimpleIcon): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');

  const shape = document.createElementNS(SVG_NS, 'path');
  shape.setAttribute('d', path);
  svg.append(shape);

  return svg;
}

function stackItem(tech: SimpleIcon): HTMLLIElement {
  const item = el('li', { class: 'marquee-item' }, [brandIcon(tech), el('span', {}, [tech.title])]);
  item.style.setProperty('--brand', `#${tech.hex}`);
  return item;
}

/** Esteira infinita: a lista é renderizada duas vezes e a trilha anda -50%. */
function renderMarquee(): void {
  const marquee = document.querySelector<HTMLElement>('[data-marquee]');

  if (!marquee) {
    return;
  }

  const track = el('div', { class: 'marquee-track' }, [
    el('ul', { class: 'marquee-list' }, stack.map(stackItem)),
    el('ul', { class: 'marquee-list', 'aria-hidden': 'true' }, stack.map(stackItem)),
  ]);

  marquee.replaceChildren(track);
}

document.querySelector('[data-controls]')?.replaceWith(createControls('controls controls-floating'));

document.querySelectorAll<HTMLElement>('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

renderMarquee();
translateStatic();
onLangChange(() => translateStatic());
