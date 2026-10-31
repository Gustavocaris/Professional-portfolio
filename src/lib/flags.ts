const SVG_NS = 'http://www.w3.org/2000/svg';

type Shape = [tag: string, attrs: Record<string, string>];

function svg(viewBox: string, shapes: Shape[]): SVGSVGElement {
  const root = document.createElementNS(SVG_NS, 'svg');
  root.setAttribute('viewBox', viewBox);
  root.setAttribute('class', 'flag');
  root.setAttribute('aria-hidden', 'true');

  for (const [tag, attrs] of shapes) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    root.append(node);
  }

  return root;
}

/** Bandeira do Brasil simplificada (sem estrelas, legível em 20px). */
export function flagBR(): SVGSVGElement {
  return svg('0 0 28 20', [
    ['rect', { width: '28', height: '20', fill: '#009b3a' }],
    ['path', { d: 'M14 2.6 25.4 10 14 17.4 2.6 10z', fill: '#fedf00' }],
    ['circle', { cx: '14', cy: '10', r: '4.6', fill: '#002776' }],
    ['path', { d: 'M9.6 9.1c2.9-.5 6.2.1 8.8 1.6', stroke: '#fff', 'stroke-width': '.9', fill: 'none' }],
  ]);
}

/** Bandeira dos EUA simplificada (7 listras, cantão sem estrelas individuais). */
export function flagUS(): SVGSVGElement {
  const stripe = 20 / 7;
  // Listras vermelhas nas posições 0, 2, 4 e 6.
  const redStripes = [0, 2, 4, 6].map((i): Shape => [
    'rect',
    { y: String(i * stripe), width: '28', height: String(stripe), fill: '#b22234' },
  ]);

  return svg('0 0 28 20', [
    ['rect', { width: '28', height: '20', fill: '#fff' }],
    ...redStripes,
    ['rect', { width: '12', height: String(stripe * 4), fill: '#3c3b6e' }],
  ]);
}
