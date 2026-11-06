// Draws the Second Look app icon (white magnifying glass on dark blue) as PNGs.
// Run once: node scripts/make-icons.mjs
import { PNG } from 'pngjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const BLUE = [10, 61, 145];
const WHITE = [255, 255, 255];

function draw(size) {
  const png = new PNG({ width: size, height: size });
  const s = size / 512; // design is on a 512 grid
  const cx = 220 * s, cy = 220 * s, rOuter = 130 * s, rInner = 92 * s;
  // handle: thick line from the ring toward the bottom-right
  const hx1 = 312 * s, hy1 = 312 * s, hx2 = 410 * s, hy2 = 410 * s, hw = 34 * s;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy);
      const ring = d <= rOuter && d >= rInner;
      // distance from point to handle segment
      const vx = hx2 - hx1, vy = hy2 - hy1;
      const t = Math.max(0, Math.min(1, ((x - hx1) * vx + (y - hy1) * vy) / (vx * vx + vy * vy)));
      const dh = Math.hypot(x - (hx1 + t * vx), y - (hy1 + t * vy));
      const handle = dh <= hw;
      const [r, g, b] = ring || handle ? WHITE : BLUE;
      const i = (y * size + x) * 4;
      png.data[i] = r; png.data[i + 1] = g; png.data[i + 2] = b; png.data[i + 3] = 255;
    }
  }
  return PNG.sync.write(png);
}

mkdirSync('public/icons', { recursive: true });
for (const size of [180, 192, 512]) writeFileSync(`public/icons/icon-${size}.png`, draw(size));
console.log('icons written');
