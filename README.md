# Portafolio · Juan Camilo Montenegro 2026

**Sitio en vivo:** https://montenegroc597-web.github.io/portafolio-juan-camilo-montenegro-2026/

Portafolio de diseñador UX-UI y 3D. Sitio estático (HTML + assets), sin paso de build, listo para publicar en **GitHub Pages**.

- **Home** (`index.html`): presentación, proyectos UX-UI y 3D, perfil, herramientas y contacto.
- **Casos de estudio** (`casos/`): Dreaming, Knoa y Nexo, cada uno con la paleta de su proyecto.

> Las páginas usan un runtime propio de plantillas (`vendor/support.js`, `<x-dc>`, `<sc-if>`, `<sc-for>`) sobre React. No se editan las plantillas con otro motor; se editan los `.html` directamente o desde el canvas de diseño (ver [Flujo con el canvas](#flujo-con-el-canvas-de-diseño)).

## Estructura

```
.
├── index.html                  Home
├── casos/
│   ├── dreaming.html           Caso de estudio · Dreaming  (morado)
│   ├── knoa.html               Caso de estudio · Knoa      (verde)
│   └── nexo.html               Caso de estudio · Nexo      (azul)
├── assets/                     Todo lo que carga el sitio, agrupado por proyecto
│   ├── home/                   Foto, avatar, tarjetas · herramientas/ · referencias/
│   ├── dreaming/               Diagramas y capturas · pantallas/
│   ├── knoa/                   Diagramas y capturas · pantallas/
│   ├── nexo/                   Diagramas y fotos · pantallas/
│   ├── 3d/                     scal/ · kora/ · a-new-hope/ · gladiator/
│   ├── shared/                 Íconos compartidos (iconos/)
│   └── docs/                   CV en PDF
├── vendor/                     Runtime de las páginas: react.js, react-dom.js, support.js (no editar)
├── docs/                       Documentación del proyecto (ESTADO.md)
├── fuentes/                    Material original. Solo local: está en .gitignore (no se sube a GitHub)
│   ├── casos-de-estudio/       Textos base de cada caso (.md)
│   ├── recursos-originales/    Imágenes y CV sin convertir
│   └── enlaces.txt             Enlaces externos (LinkedIn, ArtStation, videos…)
├── herramientas/canvas/        Puente con el canvas de diseño (canvas.mjs + asset-map.json)
├── skills/                     Skills de Claude del portafolio (sistema visual y casos de estudio)
├── package.json  .editorconfig  .gitignore  .nojekyll
└── _archivo-previo/            Copias anteriores (ignorado por git)
```

## Ver el sitio en local

Hay que servirlo por HTTP (abrirlo con `file://` puede bloquear scripts en algunos navegadores):

```bash
npm start            # equivale a: npx serve . -l 8080  → http://localhost:8080
# o, sin Node:
python -m http.server 8080
```

## Publicar en GitHub Pages

1. Crea el repositorio en GitHub y sube el proyecto (`git init`, `git add .`, `git commit`, `git push`).
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. El sitio queda en `https://<usuario>.github.io/<repositorio>/` (este: https://montenegroc597-web.github.io/portafolio-juan-camilo-montenegro-2026/).

Todas las rutas son **relativas** (`assets/...`, `../assets/...`), así que funciona igual en la raíz de un dominio o en un subdirectorio de Pages. `.nojekyll` evita que Pages procese el sitio con Jekyll.

## Convenciones

**Assets**
- Un directorio por proyecto dentro de `assets/`; las capturas de pantalla van en su subcarpeta `pantallas/`.
- Nombres en `kebab-case`, en minúsculas, sin espacios ni tildes, y **descriptivos** (`oportunidades-vista-general.webp`, no `86a6ac6a….webp`).
- Imágenes en `.webp` (el ícono de ArtStation es `.png`). Recortar el aire alrededor del sujeto antes de agregarlas.
- Si una imagen trae datos personales (por ejemplo nombres de participantes), se recorta antes de publicarla.
- Los originales sin convertir se guardan en `fuentes/recursos-originales/`.

**Páginas**
- `index.html` en la raíz; los casos en `casos/<proyecto>.html` (minúsculas, sin prefijos).
- Cada caso sigue el skill `portafolio-casos-de-estudio` y usa la paleta de su proyecto.
- Enlaces internos relativos; externos con `target="_blank" rel="noopener"`.
- Lo que falta se marca entre corchetes o con el mensaje de cursor «Estamos trabajando en ello»; nunca se inventan datos.

**Código**
- JS clásico dentro de la plantilla (`class Component extends DCLogic`), sin módulos ni dependencias externas.
- Movimiento con CSS (`animation-timeline: view()` para las apariciones) y desactivado bajo `prefers-reduced-motion`.

## Agregar un proyecto nuevo

1. Crea `assets/<proyecto>/` (y `pantallas/`) con las imágenes ya convertidas a `.webp` y bien nombradas.
2. Duplica el caso más parecido en `casos/<proyecto>.html` y cambia paleta, ficha y secciones.
3. Agrega su bloque en `index.html` y enlaza el botón «Ver Mas» a `casos/<proyecto>.html`.
4. Registra la nueva página en `herramientas/canvas/canvas.mjs` (lista `PAGES`) si quieres verla en el canvas.
5. Actualiza `docs/ESTADO.md`.

## Flujo con el canvas de diseño

El canvas de Claude sirve para ver y comentar cambios. Allí las páginas se llaman `Main.dc.html` / `Caso-*.dc.html` y las imágenes son `/_blob/<id>`. El script traduce en ambos sentidos:

```bash
# repo → canvas: genera archivos listos para publicar en <carpeta>/project/
node herramientas/canvas/canvas.mjs build dist-canvas

# canvas → repo: trae lo que se editó en el canvas (carpeta con project/*.dc.html)
node herramientas/canvas/canvas.mjs sync <carpeta>
```

Una imagen nueva debe subirse al canvas como asset y registrarse en `herramientas/canvas/asset-map.json` (`"assets/ruta/imagen.webp": "<id del blob>"`); el script avisa si falta alguna.

## Licencia

© Camilo Montenegro. Todos los derechos reservados: el contenido, las imágenes y los textos no se pueden reutilizar sin autorización.
