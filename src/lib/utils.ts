import { getCollection, type CollectionEntry } from 'astro:content';
import { MEDIO, type Seccion } from '../config';

export type Articulo = CollectionEntry<'articulos'>;

/** Ruta interna respetando el subdirectorio de GitHub Pages (/periodico/). */
export function ruta(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const limpio = path.startsWith('/') ? path : `/${path}`;
  return `${base}${limpio}`;
}

export function urlArticulo(a: Articulo): string {
  return ruta(`/${a.data.seccion}/${a.id}/`);
}

export async function articulos(seccion?: Seccion): Promise<Articulo[]> {
  const todos = await getCollection('articulos', (a) => !seccion || a.data.seccion === seccion);
  return todos.sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime() || a.id.localeCompare(b.id));
}

const fmtLargo = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: MEDIO.zonaHoraria,
});
const fmtCorto = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: MEDIO.zonaHoraria,
});

export const fechaLarga = (d: Date) => {
  const t = fmtLargo.format(d);
  return t.charAt(0).toUpperCase() + t.slice(1);
};
export const fechaCorta = (d: Date) => fmtCorto.format(d);
export const fechaISO = (d: Date) => d.toISOString();

export function minutosLectura(texto = ''): number {
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 220));
}
