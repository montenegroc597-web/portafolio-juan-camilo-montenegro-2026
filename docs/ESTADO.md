# Estado del portafolio

Última actualización: 2026-09-22. Para estructura, convenciones y cómo publicar, ver el [README](../README.md).

## Qué hay

**Publicado:** https://montenegroc597-web.github.io/portafolio-juan-camilo-montenegro-2026/ (GitHub Pages, rama `main`, raíz). Repositorio: https://github.com/montenegroc597-web/portafolio-juan-camilo-montenegro-2026

| Pieza | Archivo | Notas |
|---|---|---|
| Home | `index.html` | Dos modos (UX-UI y 3D), 7 proyectos, perfil, herramientas, referencias y contacto |
| Caso Dreaming | `casos/dreaming.html` | Paleta morada · 12 secciones · 3 personas · 3 meses |
| Caso Knoa | `casos/knoa.html` | Paleta verde · 11 secciones · 3 personas · 2 meses |
| Caso Nexo | `casos/nexo.html` | Paleta azul · 7 secciones · 4 personas · 4 días (hackathon) |
| Assets | `assets/` | 84 imágenes `.webp`/`.png` + CV; por proyecto, con nombres descriptivos |
| Skills | `skills/*.skill` | `portafolio-sistema-visual` y `portafolio-casos-de-estudio` |

## Lógica del home (`index.html`)

- **Modo UX-UI / 3D.** `state.mode`. Cambia con: las dos tarjetas de Proyectos, el botón circular del celular/cubo en la barra superior y el selector UX-UI | 3D. Al cambiar desde la barra, baja suavemente a los proyectos de esa sección y muestra un aviso ("Mostrando proyectos 3D"). `pageH` = 7380 (UX-UI) / 9063 (3D).
- **Carruseles (Dreaming 13 pantallas, Nexo 5, Knoa 7).** Bucle infinito: cada pantalla se posiciona por su distancia circular al centro (`cover()`), así que siempre hay vecina a ambos lados. Autoplay con `speed` (5 s por defecto).
- **Visor de imágenes 3D.** Las 16 imágenes de Scal, Kora, A New Hope y Gladiator son botones (`.lbthumb`, `data-lb="<proyecto>"`). Al hacer clic se abre un visor a pantalla completa con la paleta del proyecto: flechas (y ← →) recorren solo las imágenes de ese proyecto en bucle; se cierra con el botón Cerrar, Esc o un clic fuera de la imagen. Bloquea el scroll de fondo y devuelve el foco a la miniatura. Sin listener global de teclado: `onKeyDown` vive en el propio diálogo. Si un ancestro tiene transform (canvas), el diálogo pasa a `absolute` sobre la zona visible.
- **Barra superior.** Se esconde al bajar y reaparece al subir. Si `sticky` falla (dentro del canvas), pasa a `fixed` y un espaciador (`data-bar-spacer`) evita el hueco de 104 px al final.
- **Cursor contextual.** Cualquier elemento con `data-cursor="…"` muestra un seguidor con esa etiqueta. Los botones sin enlace todavía usan «Estamos trabajando en ello».
- **Escala.** Raíz fija de 1440 px; `fit()` aplica `zoom = min(1, ancho/1440)` por encima de 860 px. Por debajo, el CSS móvil desactiva el `zoom` y reordena el contenido (ver más abajo).

## Idiomas (ES / EN)

Selector `ES | EN` en la barra superior de las 4 páginas. Todo el texto visible existe dos veces en el mismo archivo: `<span class="l-es">…</span><span class="l-en">…</span>` (dentro de un SVG, `<tspan>`). La raíz lleva `data-lang` y el CSS decide cuál se ve; el visible usa `display: contents`, así que el layout no cambia. La elección se guarda en `localStorage` (`pf-lang`) y se mantiene al navegar entre páginas.

- Lo que no es texto visible (`alt`, `aria-label`) viaja en `data-alt-en` / `data-aria-en` y se aplica sobre el DOM en `applyLang()`, que corre en `componentDidMount` y `componentDidUpdate`. React no lo pisa porque el valor en su virtual DOM no cambió.
- Las etiquetas del cursor usan `data-cursor-en`; los textos que arma el JS (nombres de pantalla de los carruseles, avisos, título de la pestaña) tienen su variante inglesa en `renderVals()`.
- La traducción mantiene longitudes parecidas al español para no romper la estética.
- Herramientas en el scratchpad (`i18n-*.mjs`): extraen los tramos de texto con parse5, verifican que las etiquetas inline coincidan entre idiomas y avisan si algo queda sin traducir.
- Pendiente: el texto que está dentro de las imágenes (diagramas y capturas de las apps) sigue en español.

## Responsive (móvil)

`@media (max-width: 860px)` en las 4 páginas, sin tocar nada del layout de escritorio (que sigue igual arriba de ese ancho). Estrategia: no se reescribió el markup, se sobrescriben con `!important` los estilos inline fijos del diseño de escritorio, usando selectores de atributo (`[style*="..."]`) sobre fragmentos únicos de cada patrón repetido, más un puñado de clases nuevas para los casos que ese truco no alcanza a cubrir (`.hero-collage`, `.hero-shots`, `.avatarwrap`/`.avatar3d`, `.carousel-box`, `.caso-body`, `.sitenav`).

- **Zoom apagado, `overflow: hidden` en la raíz.** Root a `width: 100%`; todo con `width: 1440px` a `100%`; secciones a `height: auto`.
- **Grids a una columna** (`grid-template-columns: repeat(...)` → `1fr`) y **filas flex apiladas** (`flex-direction: column`), siempre con `align-items: stretch` — sin esto, un `align-items: flex-start`/`center` original hace que los hijos se encojan a su contenido en vez de ocupar el 100%, y basta un elemento sin restricción (una imagen que tarda en cargar, por ejemplo) para que todo el bloque se dispare de ancho. Fue la causa real de una sección que aparecía en blanco durante las pruebas.
- **Cuidado con los shorthands normalizados por el navegador:** un selector `[style*="padding: 0 72px 72px 72px"]` nunca hace match porque el navegador serializa `0` como `0px` y además colapsa valores repetidos (`0 72px 72px 72px` → `0px 72px 72px`). Cuando el fragmento incluye un cero bare o valores que se puedan colapsar, mejor una clase real que un selector de atributo.
- **Fotos y mockups compuestos:** la foto del hero y el avatar de Quien soy se mantienen sobre su bloque de color (reposicionado a la medida del celular); el hero de cada caso (`.hero-shots`) muestra las tres capturas en abanico, y en Nexo, por ser horizontales, la principal arriba y las otras dos debajo.
- **Carruseles coverflow** (`.coverslide`): en vez de reescribir la lógica, cada slide pasa a `position: absolute; inset: 0; width: 100%` — como solo el slide activo tiene `opacity: 1`, los demás quedan completamente tapados detrás sin necesidad de tocar el JS.
- **Barra superior:** dos filas; los cuatro enlaces del menú caben completos en la segunda.
- **Barra lateral de los casos** (`aside`): deja de ser sticky, y su `<nav>` de secciones pasa de lista vertical a pills envueltas (`flex-wrap: wrap`).
- **Imágenes de pantallas/capturas:** `height: auto` en vez del alto fijo de escritorio, para que se vean completas y a buen tamaño sin recorte forzado.
- **Visor a pantalla completa:** relleno y botones más chicos, imagen limitada con `vw`/`vh` en vez de porcentajes (evita depender del ancho real del contenedor).
- **Revisar siempre a tamaño real** (pantallas de 390x844, no una captura larga reducida): así se vio que los casos seguían escalados con zoom.
- Herramientas de prueba: Chrome headless por línea de comandos tiene un piso de ~500px de ancho aunque se pida menos con `--window-size`; para un viewport móvil real (390px) hubo que instalar `puppeteer-core` en el scratchpad y pilotar el mismo Chrome instalado vía CDP (`page.setViewport`), con `--allow-file-access-from-files` en los args del launch (si falta, las páginas cargadas por `file://` fallan por CORS).

## Lógica de los casos

Estructura común (skill `portafolio-casos-de-estudio`): hero en degradado del color del proyecto, ficha de 4 columnas, barra lateral sticky con indicador de sección, y secciones según lo que el proyecto tenga. Alto `auto` (se ajusta al contenido) y 72 px de margen final. Las pantallas finales cierran cada caso en una cinta que rota de forma continua (Dreaming, Knoa y Nexo).

## Convenciones de contenido (Camilo)

1. Nunca inventar datos; lo que falta va entre corchetes o con el mensaje de cursor.
2. En las fichas: solo «Equipo de N personas» (yo incluido), sin nombres. Trabajo de equipo en plural, lo personal en primera persona.
3. Si una imagen no coincide del todo con el texto, se aclara debajo de la imagen (se muestran solo los aspectos más importantes).
4. Recortar de las imágenes cualquier nombre de persona.
5. Knoa no lleva antes/después.

## Pendiente

**Enlaces**
- **GitHub general** (footer): ya enlaza al perfil `github.com/montenegroc597-web`.
- **ArtStation de Kora.**
- **Prototipo en Figma** de Knoa y de Dreaming, y **código en GitHub** de Dreaming (botones con «Estamos trabajando en ello»).

**Contenido**
- Año en la ficha de Knoa (`[Año por confirmar]`).
- Fotos de Nexo ya incluidas; falta decidir si Nexo lleva botón de código.

**Mejoras técnicas**
1. La prop `accent` no re-tiñe todo (morado fijo en cinta, fondo, `.edgeline`, enlaces).
2. «Home» siempre activo en el menú (sin scroll-spy).
3. Restos de edición: atributos `data-path-to-node` en la cursiva de "La La Land".
4. Ortografía: «Kora» en títulos y «Köra» en un `alt`.
5. Dependencia del runtime propio (`vendor/support.js`): el sitio solo se renderiza con él.
6. Favicon y `404.html` para GitHub Pages.

## Historial de decisiones relevantes

- 2026-09-20: los tres casos creados y conectados al home; CV, LinkedIn, correo, ArtStation (Scal, A New Hope, Gladiator), videos y tráiler de Kora integrados; Behance retirado.
- 2026-09-21: carruseles del home en bucle infinito; selector UX-UI | 3D en la barra superior; alto automático en los casos.
- 2026-09-21: repositorio creado y publicado en GitHub Pages.
- 2026-09-21: Dreaming suma las dos pantallas del maker "Añadir impresora" (catálogo y configuración) en su carrusel, en la cinta final y en el home.
- 2026-09-21: reorganización a estructura de repositorio (assets por proyecto con nombres descriptivos, `casos/`, `vendor/`, `docs/`, `fuentes/`, `herramientas/`). Los assets sin uso se movieron a `_archivo-previo/assets-sin-uso/` (diamante morado antiguo y un duplicado idéntico de "Crear producto").
- 2026-09-21: cada caso muestra su mockup 3D (`assets/<proyecto>/mockup-<proyecto>.webp`) al final de Resumen. Dreaming: Pruebas rediseñada (tres filas: hallazgos con cifra grande + pantalla) e Iteraciones con antes → después unidos por una flecha.
- 2026-09-21: visor a pantalla completa para las imágenes de la sección 3D (navegación por proyecto, cierre con botón/Esc/clic fuera).
- 2026-09-22: cursor contextual corregido — la etiqueta se recalcula en cada mousemove (antes solo con mouseover/mouseleave), así que ya no queda pegada cuando el DOM bajo el cursor cambia por un re-render (carrusel, cambio de modo) sin que el mouse cruce a otro elemento.
- 2026-09-22: corregido el indicador de sección activa en los tres casos — la última fase (Reflexión) no se marcaba porque su borde nunca cruzaba el umbral de detección; ahora se fuerza al llegar al final de la página.
- 2026-09-22: motion — fundido y elevación al cambiar entre proyectos UX-UI y 3D en el home (`.modeswitch`); transición suave en los puntos del menú lateral de los casos. Cursor del mockup UX-UI del home: "Ver proyectos UX-UI" en vez de "Ver caso".
- 2026-09-22: fundido de cambio de modo aligerado a solo opacity (sin transform) para evitar un posible destello blanco al entrar a 3D con las 4 secciones (16 imágenes) animando a la vez.
- 2026-09-22: sitio responsive para móvil (`@media (max-width: 860px)`) en las 4 páginas, sin tocar el layout de escritorio. Ver sección "Responsive (móvil)" más arriba.
- 2026-09-22: móvil rehecho tras revisarlo a tamaño real (390px, pantalla por pantalla): los casos seguían escalados con zoom (texto diminuto) y ahora no; menú completo visible sin scroll; foto del hero y avatar otra vez sobre su bloque de color; hero de cada caso con las tres capturas en abanico (Nexo: principal arriba y dos debajo); ficha en 2x2; en Diseño el texto va antes de las capturas; Pruebas e Iteraciones mantienen las imágenes lado a lado; carruseles del home con etiqueta y puntos compactos. Verificado sin desbordes a 360, 390 y 430px.
- 2026-09-22: portafolio bilingüe (ES/EN) con selector en la barra superior; todo el contenido traducido dentro del mismo archivo.
