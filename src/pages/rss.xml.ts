import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { AVISO_IA, MEDIO, SECCIONES } from '../config';
import { articulos, urlArticulo } from '../lib/utils';

export async function GET(context: APIContext) {
  const lista = (await articulos()).slice(0, 50);
  return rss({
    title: MEDIO.nombre,
    description: MEDIO.descripcion,
    site: new URL(import.meta.env.BASE_URL, context.site).href,
    trailingSlash: true,
    customData: `<language>es-es</language>`,
    items: lista.map((a) => ({
      title: a.data.titulo,
      description: `${a.data.entradilla} — ${AVISO_IA}`,
      pubDate: a.data.fecha,
      link: urlArticulo(a),
      categories: [SECCIONES[a.data.seccion].nombre, ...a.data.etiquetas],
    })),
  });
}
