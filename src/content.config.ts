import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { FORMATOS, SECCIONES } from './config';

// La web SOLO se construye con /contenido/publicados. Los borradores nunca se
// cargan. Con FP_DEMO=1 (solo en local) se añaden las piezas de /contenido/ejemplos
// para poder revisar el diseño; el despliegue nunca define esa variable.
const demo = process.env.FP_DEMO === '1';

const fuente = z.object({
  nombre: z.string().min(3),
  url: z.url(),
  // Qué aporta esa fuente: "texto íntegro", "nota oficial", "ficha biográfica"...
  tipo: z.string().optional(),
});

const articulos = defineCollection({
  loader: glob({
    base: './contenido',
    pattern: demo ? ['publicados/*.md', 'ejemplos/*.md'] : ['publicados/*.md'],
    generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      titulo: z.string().min(10).max(120),
      entradilla: z.string().min(40).max(320),
      fecha: z.coerce.date(),
      actualizado: z.coerce.date().optional(),
      seccion: z.enum(Object.keys(SECCIONES) as [keyof typeof SECCIONES]),
      formato: z.enum(Object.keys(FORMATOS) as [keyof typeof FORMATOS]),
      fuentes: z.array(fuente).min(1, 'Cada pieza necesita al menos una fuente enlazada'),
      confianza: z.enum(['alta', 'media']).optional(),
      revisado: z.boolean().default(false),
      estado: z.enum(['publicado', 'ejemplo']),
      etiquetas: z.array(z.string()).default([]),
      correcciones: z
        .array(z.object({ fecha: z.coerce.date(), texto: z.string() }))
        .default([]),
    })
    .refine((a) => a.seccion !== 'historia' || a.confianza, {
      message: 'Las piezas de historia deben indicar confianza: alta | media',
      path: ['confianza'],
    })
    .refine((a) => a.confianza !== 'media' || a.revisado, {
      message: 'Un dato de confianza media no se publica sin revisión expresa (revisado: true)',
      path: ['revisado'],
    })
    .refine((a) => a.estado !== 'ejemplo' || demo, {
      message: 'Las piezas de ejemplo no pueden compilarse fuera del modo demostración',
      path: ['estado'],
    }),
});

export const collections = { articulos };
