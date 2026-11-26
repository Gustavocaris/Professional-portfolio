import { t } from '../i18n';
import { el } from './dom';

/**
 * Intro da home: milhares de pontos azuis se juntam e formam o rosto da imagem
 * de referência (`src/data/intro-face.ts`), a cabeça gira de leve até ficar de
 * frente, um scanner percorre o rosto, os pontos viram "Hello!" e depois pousam
 * na grade de pontos do fundo enquanto o cartão aparece.
 * Só roda quando o script inline do <head> marcou <html data-intro>.
 */

type Point = { x: number; y: number };

type Particle = {
  hx: number; // posição na imagem de referência
  hy: number;
  z: number; // profundidade aproximada (para o giro em pseudo-3D)
  v: number; // brilho (0–1)
  fade: number; // atenuação nas bordas da imagem
  start: Point;
  text: Point;
  textDup: boolean; // sobra no texto: some durante o morph
  exit: Point;
  from: Point;
  fromRadius: number;
  fromAlpha: number;
  delay: number;
  phase: number;
};

/** Grade de pontos do fundo (`background-size: 22px` em base.css). */
const GRID = 22;
const FONT = '700 100px "Space Grotesk"';
const LEVELS = 14;

/** Linha do tempo, em segundos. */
const T = {
  fadeIn: 0.7,
  faceStart: 0.3,
  faceEnd: 2.5,
  scanStart: 2.6,
  scanEnd: 4.0,
  textStart: 4.3,
  textEnd: 5.6,
  exitStart: 6.6,
  exitDur: 1.1,
  skipDur: 0.5,
  stagger: 0.55,
};

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number): number => {
  const k = clamp01((v - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const easeInOut = (v: number): number => (v < 0.5 ? 4 * v * v * v : 1 - (-2 * v + 2) ** 3 / 2);
const mix = (a: number, b: number, k: number): number => a + (b - a) * k;
const lerp = (a: Point, b: Point, k: number): Point => ({ x: mix(a.x, b.x, k), y: mix(a.y, b.y, k) });

/** Decodifica os pontos (4 caracteres base64url = x 9 bits · y 10 bits · brilho 5 bits). */
function decode(packed: string): { x: number; y: number; v: number }[] {
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const out: { x: number; y: number; v: number }[] = [];
  for (let i = 0; i + 3 < packed.length; i += 4) {
    let n = 0;
    for (let k = 0; k < 4; k++) {
      n = (n << 6) | B64.indexOf(packed[i + k]);
    }
    out.push({ x: n >> 15, y: (n >> 5) & 1023, v: (n & 31) / 31 });
  }
  return out;
}

/** "Hello!" amostrado numa grade hexagonal de pontos. */
function sampleText(w: number, h: number, family: string, count: number): { points: Point[]; step: number } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return { points: [], step: 6 };
  }

  let size = Math.min(h * 0.3, 220);
  ctx.font = `700 ${size}px ${family}`;
  const width = ctx.measureText('Hello!').width;
  if (width > w * 0.86 || w < 640) {
    size *= (w * 0.86) / width;
    ctx.font = `700 ${size}px ${family}`;
  }
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Hello!', w / 2, h / 2);

  const data = ctx.getImageData(0, 0, w, h).data;
  const lit = (x: number, y: number): boolean => data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 128;

  let area = 0;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (lit(x, y)) {
        area += 4;
      }
    }
  }

  const step = Math.max(6, Math.sqrt(area / (0.866 * count)));
  const points: Point[] = [];
  for (let row = 0, y = step / 2; y < h; row++, y += step * 0.866) {
    for (let x = row % 2 ? step : step / 2; x < w; x += step) {
      if (lit(x, y)) {
        points.push({ x, y });
      }
    }
  }
  return { points, step };
}

function loadFont(): Promise<boolean> {
  if (!document.fonts) {
    return Promise.resolve(false);
  }
  const timeout = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 1200));
  const load = document.fonts.load(FONT).then(
    (faces) => faces.length > 0,
    () => false,
  );
  return Promise.race([load, timeout]);
}

export async function playIntro(): Promise<void> {
  const root = document.documentElement;

  if (!root.hasAttribute('data-intro')) {
    return;
  }

  // Os dados do rosto só são baixados quando a intro vai tocar
  let face: typeof import('../data/intro-face');
  try {
    face = await import('../data/intro-face');
  } catch {
    root.removeAttribute('data-intro');
    return;
  }

  const canvas = el('canvas', { class: 'intro', 'aria-hidden': 'true' });
  const skipButton = el('button', { class: 'intro-skip', type: 'button' }, [t('intro.skip')]);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    root.removeAttribute('data-intro');
    return;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.scale(dpr, dpr);


  const light = root.dataset.theme === 'light';
  // Rampa de cor do ponto mais apagado ao mais brilhante (azul → ciano → branco-azulado)
  const ramp = light
    ? ['#7aa7f5', '#3b78e6', '#1559c9', '#0b3f9e']
    : ['#1b3fc4', '#2363f0', '#2f8fff', '#5fc2ff', '#bfeaff'];
  const halo = light ? '60,130,255' : '20,90,230';
  const eyeRgb = light ? '40,110,255' : '190,240,255';

  // Escala: a imagem (476×525) ocupa a maior parte da altura da tela
  const FW = face.FACE_WIDTH;
  const FH = face.FACE_HEIGHT;
  const scale = Math.min((h * 0.84) / FH, (w * 0.96) / FW, 1.6);
  const ox = (w - FW * scale) / 2;
  const oy = (h - FH * scale) / 2;
  const radius = Math.max(0.65, 0.85 * scale);

  const all = decode(face.FACE_POINTS);
  // Telas pequenas: menos pontos (a ordem já é embaralhada, então qualquer prefixo é uniforme)
  const limit = w < 640 ? 6500 : Math.round(all.length * Math.min(1, scale * scale * 1.1));
  const points = all.slice(0, Math.max(2000, limit));
  const total = points.length;
  const center = { x: w / 2, y: h / 2 };

  /** Profundidade aproximada: a cabeça como um elipsoide (só para o giro de leve). */
  const depth = (x: number, y: number): number => {
    const dx = (x - FW / 2) / 210;
    const dy = (y - 250) / 290;
    return Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy * 0.5)) * 170;
  };

  const particles: Particle[] = points.map((p) => ({
    hx: p.x,
    hy: p.y,
    z: depth(p.x, p.y),
    v: p.v,
    fade: (1 - smooth(440, FH, p.y)) * smooth(0, 30, p.x) * smooth(0, 30, FW - p.x),
    start: { x: Math.random() * w, y: Math.random() * h },
    text: { x: center.x, y: center.y },
    textDup: true,
    exit: { x: 0, y: 0 },
    from: { x: 0, y: 0 },
    fromRadius: 0,
    fromAlpha: 0,
    delay: (p.y / FH) * T.stagger * 0.7 + Math.random() * T.stagger * 0.3,
    phase: Math.random() * Math.PI * 2,
  }));

  // Texto: usa a Space Grotesk se carregar a tempo; senão a fonte do sistema
  let textReady = false;
  let textRadius = radius;
  const buildText = (family: string): void => {
    if (textReady) {
      return;
    }
    textReady = true;
    const { points: targets, step } = sampleText(w, h, family, total);
    textRadius = Math.max(1, step * 0.27);
    if (targets.length === 0) {
      return;
    }
    // Pareia por posição horizontal para o morph fluir sem cruzamentos caóticos
    const sorted = [...targets].sort((a, b) => a.x - b.x);
    const order = particles
      .map((p, i) => ({ i, x: p.hx + (Math.random() - 0.5) * 30 }))
      .sort((a, b) => a.x - b.x);
    // Quando há mais pontos que alvos, as sobras reutilizam um alvo e somem no caminho
    const used = new Set<number>();
    order.forEach(({ i }, k) => {
      const slot = Math.min(sorted.length - 1, Math.floor((k / order.length) * sorted.length));
      particles[i].text = sorted[slot];
      particles[i].textDup = used.has(slot);
      used.add(slot);
    });
  };
  void loadFont().then((ok) => buildText(ok ? '"Space Grotesk", system-ui, sans-serif' : 'system-ui, sans-serif'));

  /** Giro: a cabeça chega virada, fica de frente e oscila de leve. */
  const yawAt = (s: number): number =>
    -0.45 * (1 - easeInOut(clamp01((s - T.faceStart) / (T.faceEnd - T.faceStart + 0.4)))) +
    0.05 * Math.sin((s - T.faceEnd) * 1.2) * smooth(T.faceEnd - 0.2, T.faceEnd + 0.6, s);

  /** Posição na tela de um ponto da imagem, com o giro aplicado. */
  const project = (x: number, y: number, z: number, cosY: number, sinY: number): Point => {
    const dx = x - FW / 2;
    return { x: ox + (FW / 2 + dx * cosY + z * sinY) * scale, y: oy + y * scale };
  };

  await new Promise<void>((resolve) => {
    let begin = -1;
    let exitAt = T.exitStart;
    let exitDur = T.exitDur;
    let exiting = false;
    let revealed = false;
    let frame = 0;

    const reveal = (): void => {
      if (revealed) {
        return;
      }
      revealed = true;
      root.removeAttribute('data-intro');
      root.setAttribute('data-intro-reveal', '');
      setTimeout(() => root.removeAttribute('data-intro-reveal'), 900);
    };

    const elapsed = (): number => (begin < 0 ? 0 : (performance.now() - begin) / 1000);

    type State = { pos: Point; r: number; alpha: number };
    const state = (p: Particle, s: number, cosY: number, sinY: number, scanY: number, scan: number): State => {
      const home = project(p.hx, p.hy, p.z, cosY, sinY);
      // Pontos do lado que gira para longe ficam um pouco mais apagados
      const turn = clamp01(1 + ((p.hx - FW / 2) / 240) * sinY * 1.6);

      let faceAlpha = (0.22 + 0.78 * p.v) * p.fade * turn;
      let r = radius * (0.65 + 0.55 * p.v);
      const boost = Math.exp(-(((p.hy - scanY) / 7) ** 2)) * scan;
      faceAlpha = Math.min(1, faceAlpha + boost * 0.8 * p.fade);
      r *= 1 + boost * 0.35;

      // Montagem: dos pontos soltos até o rosto
      const ka = easeInOut(clamp01((s - p.delay - T.faceStart) / (T.faceEnd - T.faceStart)));
      const appear = clamp01((s - p.delay * 0.6) / T.fadeIn);
      const wobble = 0.35 * ka;
      let pos = lerp(p.start, home, ka);
      pos = { x: pos.x + Math.sin(s * 2.4 + p.phase) * wobble, y: pos.y + Math.cos(s * 2.1 + p.phase) * wobble };
      let alpha = mix(0.3 * p.fade + 0.1, faceAlpha, ka) * appear;

      // Morph para o texto
      const kt = easeInOut(clamp01((s - p.delay * 0.4 - T.textStart) / (T.textEnd - T.textStart)));
      if (kt > 0) {
        pos = lerp(pos, p.text, kt);
        r = mix(r, textRadius, kt);
        alpha = p.textDup ? alpha * (1 - kt) : mix(Math.max(alpha, 0.2), 0.74, kt);
      }

      return { pos, r, alpha };
    };

    const startExit = (s: number): void => {
      if (exiting) {
        return;
      }
      exiting = true;
      exitAt = s;
      const yaw = yawAt(s);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      for (const p of particles) {
        const st = state(p, s, cosY, sinY, -100, 0);
        p.from = st.pos;
        p.fromRadius = st.r;
        p.fromAlpha = st.alpha;
        // Explode para fora do centro e pousa no ponto mais próximo da grade do fundo
        const dx = p.from.x - center.x;
        const dy = p.from.y - center.y;
        const push = 0.6 + Math.random() * 0.9;
        const tx = p.from.x + dx * push + (Math.random() - 0.5) * 80;
        const ty = p.from.y + dy * push + (Math.random() - 0.5) * 80;
        p.exit = {
          x: Math.round((tx - GRID / 2) / GRID) * GRID + GRID / 2,
          y: Math.round((ty - GRID / 2) / GRID) * GRID + GRID / 2,
        };
      }
    };

    const skip = (): void => {
      if (!exiting) {
        exitDur = T.skipDur;
        startExit(elapsed());
      }
    };

    const finish = (): void => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('resize', skip);
      canvas.removeEventListener('pointerdown', skip);
      skipButton.removeEventListener('click', skip);
      canvas.remove();
      skipButton.remove();
      reveal();
      resolve();
    };

    const tick = (now: number): void => {
      if (begin < 0) {
        begin = now;
      }
      const s = (now - begin) / 1000;

      if (s >= T.textStart - 0.1 && !textReady) {
        buildText('system-ui, sans-serif');
      }
      if (s >= T.exitStart) {
        startExit(s);
      }

      const exitK = exiting ? easeInOut(clamp01((s - exitAt) / exitDur)) : 0;
      if (exiting && exitK > 0.12) {
        reveal();
      }

      const yaw = yawAt(s);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      // Scanner: uma faixa de luz desce pelo rosto já formado
      const scanK = clamp01((s - T.scanStart) / (T.scanEnd - T.scanStart));
      const scanY = mix(-20, FH * 0.9, easeInOut(scanK));
      const scan = scanK > 0 && scanK < 1 ? Math.sin(scanK * Math.PI) : 0;

      // Presença do rosto (halo e olhos)
      const faceVis =
        smooth(T.faceEnd - 1, T.faceEnd, s) * (1 - smooth(T.textStart, T.textStart + 0.7, s)) * (1 - exitK);

      const paths = Array.from({ length: LEVELS }, () => new Path2D());

      for (const p of particles) {
        let pos: Point;
        let r: number;
        let alpha: number;

        if (exiting) {
          pos = lerp(p.from, p.exit, exitK);
          r = mix(p.fromRadius, 0.8, exitK);
          alpha = p.fromAlpha * (1 - exitK);
        } else {
          ({ pos, r, alpha } = state(p, s, cosY, sinY, scanY, scan));
        }

        const level = Math.round(clamp01(alpha) * (LEVELS - 1));
        if (level > 0) {
          paths[level].moveTo(pos.x + r, pos.y);
          paths[level].arc(pos.x, pos.y, r, 0, Math.PI * 2);
        }
      }

      ctx.clearRect(0, 0, w, h);

      ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';

      // Cada nível de intensidade usa uma cor da rampa (apagado = azul, forte = branco-azulado)
      paths.forEach((path, level) => {
        if (level === 0) {
          return;
        }
        const k = level / (LEVELS - 1);
        // k^1.6: a maioria dos pontos fica nos azuis; só os mais fortes chegam ao branco-azulado
        ctx.fillStyle = ramp[Math.min(ramp.length - 1, Math.floor(k ** 1.6 * ramp.length))];
        ctx.globalAlpha = 0.35 + 0.65 * k;
        ctx.fill(path);
      });

      // Halo azul atrás da cabeça (desenhado por baixo do que já está no quadro)
      if (faceVis > 0) {
        const hc = project(FW / 2, 250, 0, cosY, sinY);
        const glow = ctx.createRadialGradient(hc.x, hc.y, 0, hc.x, hc.y, FH * scale * 0.7);
        glow.addColorStop(0, `rgba(${halo},${0.2 * faceVis})`);
        glow.addColorStop(1, `rgba(${halo},0)`);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
      }

      // Olhos luminosos
      if (faceVis > 0) {
        ctx.globalAlpha = 1;
        for (const e of face.FACE_EYES) {
          const c = project(e.x, e.y, depth(e.x, e.y), cosY, sinY);
          const size = 34 * scale;
          const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, size);
          g.addColorStop(0, `rgba(${eyeRgb},${0.95 * faceVis})`);
          g.addColorStop(0.18, `rgba(${eyeRgb},${0.55 * faceVis})`);
          g.addColorStop(1, `rgba(${eyeRgb},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(c.x - size, c.y - size, size * 2, size * 2);
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (exiting && s - exitAt >= exitDur) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('keydown', skip);
    window.addEventListener('resize', skip);
    canvas.addEventListener('pointerdown', skip);
    skipButton.addEventListener('click', skip);
    document.body.append(canvas, skipButton);
    frame = requestAnimationFrame(tick);
  });
}
