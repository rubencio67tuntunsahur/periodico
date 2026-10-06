# Fase 1 — Plan y verificación de fuentes

Fecha de verificación: 2026-10-06 (desde un servidor en la nube; algunas fuentes pueden comportarse distinto desde una conexión doméstica).

## 1. Arquitectura propuesta

| Pieza | Elección | Por qué |
|---|---|---|
| Generador | **Astro** (salida 100 % estática) | Las *content collections* validan el frontmatter con un esquema (zod): un artículo sin fuentes o con `estado` incorrecto rompe la compilación en vez de publicarse. Tiene integraciones oficiales y gratuitas de RSS y sitemap. No envía JavaScript al navegador salvo el interruptor de modo oscuro. Eleventy también serviría, pero habría que programar a mano la validación, que aquí es una garantía editorial. |
| Hosting | **GitHub Pages** + GitHub Actions si el repo es **público**; **Cloudflare Pages** si es **privado** | Pages es gratis y está en el mismo sitio que el código. Pero GitHub Pages no funciona con repos privados en el plan gratuito, y Cloudflare Pages sí (además permite dominio propio con HTTPS gratis y tiene analítica sin cookies). |
| Scripts | Node.js 22 (ya instalado), sin dependencias de pago | `recoger`, `publicar` y la validación, en el mismo lenguaje que la web. |
| Redacción | Claude Code, siguiendo `REDACCION.md` | No se usa la API de Anthropic. |

Estructura:

```
contenido/borradores/AAAA-MM-DD-slug.md   ← lo que redacta Claude Code (estado: borrador)
contenido/publicados/AAAA-MM-DD-slug.md   ← solo lo que apruebas tú (estado: publicado)
contenido/guiones/AAAA-MM-DD-video.md     ← guion vertical (no se publica en la web)
datos/AAAA-MM-DD/                         ← JSON/PDF/HTML crudos + manifiesto con URL y hora de descarga
scripts/recoger.mjs · scripts/publicar.mjs · scripts/validar.mjs
REDACCION.md                              ← instrucciones editoriales para Claude Code
src/                                      ← web Astro
```

Frontmatter (borrador):

```yaml
titulo: "..."
entradilla: "..."
fecha: 2026-10-06
seccion: politica | historia
formato: boe-hoy | explicado | agenda | efemeride | curiosidad
fuentes:
  - nombre: "BOE-A-2026-XXXXX"
    url: "https://www.boe.es/..."
confianza: alta | media        # solo historia
estado: borrador | aprobado | publicado
```

Flujo de aprobación (principio 5): la web **solo compila `contenido/publicados`**. `npm run publicar -- <archivo>` (o `--todos-aprobados`) comprueba el frontmatter, rechaza piezas de historia con `confianza: media` salvo que pases `--revisado`, mueve el archivo, compila y despliega. Nada pasa de borrador a publicado sin ese comando.

## 2. Verificación de fuentes

| Fuente | Endpoint comprobado | Resultado | robots.txt / condiciones |
|---|---|---|---|
| **BOE** sumario | `https://www.boe.es/datosabiertos/api/boe/sumario/AAAAMMDD` (Accept: application/json) | ✅ 200, JSON. Sumario de hoy: BOE-S-2026-248, con secciones I, II-A, II-B, III, IV, V-A/B/C | Solo prohíbe ficheros concretos (datos personales). Reutilización permitida citando la fuente (aviso legal del BOE, RD 1495/2011). |
| **Congreso** datos abiertos | `/es/opendata/iniciativas`, `/diputados`, `/votaciones`, `/intervenciones` | ✅ 200. Ofrece ficheros JSON/CSV/XML que se regeneran a diario (p. ej. `ProyectosDeLey__20261006…json`) | Solo prohíbe PDF concretos. Hay que citar al Congreso como fuente. |
| **Congreso** agenda | `https://www.congreso.es/es/agenda` → PDF `backoffice_doc/prensa/agenda-semanal/AAAAMMDD-agenda-semanal-es.pdf` | ✅ 200. El PDF de esta semana (5–11 oct.) se descarga y se convierte a texto con `pdftotext` (gratis, poppler) | Igual que arriba. |
| **Senado** | `www.senado.es` (todo el dominio, incluido robots.txt) | ❌ **403** desde este servidor, también con el agente de usuario de un navegador. Parece un cortafuegos que bloquea IP de centros de datos. | **Por comprobar desde tu equipo.** Si allí funciona, lo incluimos; si no, la alternativa es el catálogo `datos.gob.es` (que también devolvió 403 aquí) o dejar fuera el Senado al principio. |
| **La Moncloa** referencias | `/consejodeministros/referencias/Paginas/AAAA/AAAAMMDD-referencia-rueda-de-prensa-ministros.aspx` | ✅ 200. HTML con los acuerdos (se ha extraído el texto bien, p. ej. la referencia del 29-09-2026) | robots.txt vacío (sin restricciones). |
| **La Moncloa** RSS | `https://www.lamoncloa.gob.es/Paginas/rss.aspx` | ✅ 200 RSS. Ya trae el Consejo de Ministros de hoy (06-10-2026); sirve para detectar cuándo sale la referencia | — |
| **DOGV** (opcional) | `https://dogv.gva.es/` | ⚠️ Respondió una vez (200) y después cortó la conexión. Inestable desde aquí. | Solo prohíbe PDF concretos (datos personales). Lo volveré a comprobar en la fase 3. |
| **Parlamento Europeo** (opcional) | `https://data.europarl.europa.eu/api/v2/meetings?year=AAAA&format=application/ld+json` | ✅ 200 JSON-LD (sesiones plenarias) | `Allow: /`. Datos abiertos con licencia de reutilización de la UE. |
| **Efemérides** (pista) | `https://api.wikimedia.org/feed/v1/wikipedia/es/onthisday/selected/MM/DD` | ✅ 200 (la URL antigua `es.wikipedia.org/api/rest_v1/...` devolvió 429; usaremos esta). | CC BY-SA. **Solo sirve para encontrar candidatas**: cada dato se contrasta con una fuente institucional (Diccionario Biográfico de la Real Academia de la Historia (`dbe.rah.es`), PARES, BNE, museos y universidades), que es la que se enlaza. |

Ningún script descargará páginas completas de forma masiva: una o pocas peticiones al día por fuente, con un agente de usuario identificable, pausas entre peticiones y caché en `datos/`.

## Decisiones tomadas tras la fase 1

- Nombre: **Fuente Primaria** («Política española contada desde los documentos oficiales»).
- Hosting: **GitHub Pages** (repositorio público) en `https://rubencio67tuntunsahur.github.io/periodico/`.
- Estilo: diario sobrio. Tipografía con remates (Source Serif 4) para leer y sin remates (Inter) para la interfaz, ambas alojadas en la propia web. Paleta tinta/papel con acento ocre, sin colores asociados a partidos. Modo oscuro automático y con botón.
- Sin analítica ni cookies.
- Sistema del redactor: Windows (los scripts serán multiplataforma con Node.js, sin depender de bash).
- Pendiente: datos del titular para el aviso legal (marcadores en `src/config.ts`) y comprobar el Senado desde tu conexión.
