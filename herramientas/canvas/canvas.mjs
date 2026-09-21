#!/usr/bin/env node
// Puente entre el repositorio (sitio estatico) y el canvas de diseno de Claude.
//
//   node herramientas/canvas/canvas.mjs build <carpetaSalida>   repo  -> canvas (archivos listos para publicar)
//   node herramientas/canvas/canvas.mjs sync  <carpetaEntrada>  canvas -> repo   (trae lo editado en el canvas)
//
// En el canvas las paginas se llaman Main.dc.html / Caso-*.dc.html y las imagenes viven como /_blob/<id>.
// En el repo son index.html / casos/*.html con rutas relativas a assets/. Este script traduce en ambos sentidos.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'herramientas/canvas/asset-map.json'), 'utf8'));
const REV = Object.fromEntries(Object.entries(MAP).map(([p, id]) => [id, p]));

const PAGES = [
  { file: 'index.html', canvas: 'Main.dc.html', up: './' },
  { file: 'casos/dreaming.html', canvas: 'Caso-Dreaming.dc.html', up: '../' },
  { file: 'casos/knoa.html', canvas: 'Caso-Knoa.dc.html', up: '../' },
  { file: 'casos/nexo.html', canvas: 'Caso-Nexo.dc.html', up: '../' },
];
// ruta de la pagina B vista desde la pagina A (en el repo)
const rel = (from, to) => path.posix.relative(path.posix.dirname(from.file), to.file);

const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const finish = (t) => t.replace(/\n*$/, '\n');

function build(outDir) {
  const problems = [];
  for (const page of PAGES) {
    let t = read(path.join(ROOT, page.file));
    t = t.split('\n').filter((l) => !/vendor\/react/.test(l)).join('\n');
    t = t.replace(`<script src="${page.up}vendor/support.js"></script>`, '<script src="./support.js"></script>');
    for (const other of PAGES) {
      if (other === page) continue;
      const r = rel(page, other);
      t = t.split(`href="${r}"`).join(`href="${other.canvas}"`).split(`href="${r}#`).join(`href="${other.canvas}#`);
    }
    t = t.replace(/(?:\.\.\/|\.\/)assets\/([A-Za-z0-9_.\-\/]+)/g, (m, p) => {
      const id = MAP['assets/' + p];
      if (!id) { problems.push(`${page.file}: sin blob para assets/${p}`); return m; }
      return `/_blob/${id}`;
    });
    const dst = path.join(outDir, 'project', page.canvas);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, finish(t));
    console.log(`build ${page.file} -> ${page.canvas}`);
  }
  if (problems.length) { console.error('\nATENCION, imagenes sin subir al canvas:\n' + problems.join('\n')); process.exitCode = 1; }
}

function sync(inDir) {
  const unknown = new Set();
  for (const page of PAGES) {
    const src = path.join(inDir, 'project', page.canvas);
    if (!fs.existsSync(src)) { console.log(`omitido ${page.canvas} (no esta en la carpeta)`); continue; }
    let t = read(src);
    t = t.replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => { if (!REV[id]) { unknown.add(id); return m; } return page.up + REV[id]; });
    for (const other of PAGES) {
      if (other === page) continue;
      const r = rel(page, other);
      t = t.split(`href="${other.canvas}"`).join(`href="${r}"`).split(`href="${other.canvas}#`).join(`href="${r}#`);
    }
    t = t.replace('<script src="./support.js"></script>', `<script src="${page.up}vendor/react.js"></script>\n<script src="${page.up}vendor/react-dom.js"></script>\n<script src="${page.up}vendor/support.js"></script>`);
    fs.writeFileSync(path.join(ROOT, page.file), finish(t));
    console.log(`sync ${page.canvas} -> ${page.file}`);
  }
  if (unknown.size) { console.error('\nATENCION, blobs desconocidos (imagen nueva subida al canvas). Descargala a assets/ y agregala a asset-map.json:\n' + [...unknown].join('\n')); process.exitCode = 1; }
}

const [cmd, dir] = process.argv.slice(2);
if (cmd === 'build' && dir) build(path.resolve(dir));
else if (cmd === 'sync' && dir) sync(path.resolve(dir));
else { console.error('Uso:\n  node herramientas/canvas/canvas.mjs build <carpetaSalida>\n  node herramientas/canvas/canvas.mjs sync <carpetaEntrada>'); process.exit(2); }
