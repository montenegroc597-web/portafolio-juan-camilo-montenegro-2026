# Estado del portafolio

Última actualización: 2026-09-21. Para estructura, convenciones y cómo publicar, ver el [README](../README.md).

## Qué hay

| Pieza | Archivo | Notas |
|---|---|---|
| Home | `index.html` | Dos modos (UX-UI y 3D), 7 proyectos, perfil, herramientas, referencias y contacto |
| Caso Dreaming | `casos/dreaming.html` | Paleta morada · 12 secciones · 3 personas · 3 meses |
| Caso Knoa | `casos/knoa.html` | Paleta verde · 11 secciones · 3 personas · 2 meses |
| Caso Nexo | `casos/nexo.html` | Paleta azul · 7 secciones · 4 personas · 4 días (hackathon) |
| Assets | `assets/` | 81 imágenes `.webp`/`.png` + CV; por proyecto, con nombres descriptivos |
| Skills | `skills/*.skill` | `portafolio-sistema-visual` y `portafolio-casos-de-estudio` |

## Lógica del home (`index.html`)

- **Modo UX-UI / 3D.** `state.mode`. Cambia con: las dos tarjetas de Proyectos, el botón circular del celular/cubo en la barra superior y el selector UX-UI | 3D. Al cambiar desde la barra, baja suavemente a los proyectos de esa sección y muestra un aviso ("Mostrando proyectos 3D"). `pageH` = 7380 (UX-UI) / 9063 (3D).
- **Carruseles (Dreaming 11 pantallas, Nexo 5, Knoa 7).** Bucle infinito: cada pantalla se posiciona por su distancia circular al centro (`cover()`), así que siempre hay vecina a ambos lados. Autoplay con `speed` (5 s por defecto).
- **Barra superior.** Se esconde al bajar y reaparece al subir. Si `sticky` falla (dentro del canvas), pasa a `fixed` y un espaciador (`data-bar-spacer`) evita el hueco de 104 px al final.
- **Cursor contextual.** Cualquier elemento con `data-cursor="…"` muestra un seguidor con esa etiqueta. Los botones sin enlace todavía usan «Estamos trabajando en ello».
- **Escala.** Raíz fija de 1440 px; `fit()` aplica `zoom = min(1, ancho/1440)`.

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
1. Responsive real para móvil (hoy escala con `zoom`, mínimo 0.3).
2. La prop `accent` no re-tiñe todo (morado fijo en cinta, fondo, `.edgeline`, enlaces).
3. «Home» siempre activo en el menú (sin scroll-spy).
4. Restos de edición: atributos `data-path-to-node` en la cursiva de "La La Land".
5. Ortografía: «Kora» en títulos y «Köra» en un `alt`.
6. Dependencia del runtime propio (`vendor/support.js`): el sitio solo se renderiza con él.
7. Favicon y `404.html` para GitHub Pages.

## Historial de decisiones relevantes

- 2026-09-20: los tres casos creados y conectados al home; CV, LinkedIn, correo, ArtStation (Scal, A New Hope, Gladiator), videos y tráiler de Kora integrados; Behance retirado.
- 2026-09-21: carruseles del home en bucle infinito; selector UX-UI | 3D en la barra superior; alto automático en los casos.
- 2026-09-21: reorganización a estructura de repositorio (assets por proyecto con nombres descriptivos, `casos/`, `vendor/`, `docs/`, `fuentes/`, `herramientas/`). Los assets sin uso se movieron a `_archivo-previo/assets-sin-uso/` (diamante morado antiguo y un duplicado idéntico de "Crear producto").
