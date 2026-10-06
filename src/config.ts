// Datos generales del medio. Edita aquí el nombre, el lema y los datos legales.

export const MEDIO = {
  nombre: 'Fuente Primaria',
  lema: 'Política española contada desde los documentos oficiales',
  descripcion:
    'Información política española elaborada exclusivamente a partir de fuentes oficiales (BOE, Congreso, Senado, La Moncloa) y una sección diaria de curiosidades históricas con fuentes verificables.',
  idioma: 'es-ES',
  zonaHoraria: 'Europe/Madrid',
  repositorio: 'https://github.com/rubencio67tuntunsahur/periodico',
};

// Datos obligatorios por la LSSI (art. 10). Sustituye los marcadores entre
// corchetes antes de difundir la web: `npm run publicar` avisará mientras
// quede alguno sin rellenar.
export const LEGAL = {
  titular: '[NOMBRE Y APELLIDOS O RAZÓN SOCIAL]',
  nif: '[NIF]',
  domicilio: '[DOMICILIO A EFECTOS DE NOTIFICACIONES]',
  correo: '[CORREO DE CONTACTO]',
  // Fecha de la última revisión de los textos legales.
  actualizado: '2026-10-06',
};

export const AVISO_IA =
  'Redactado con asistencia de IA a partir de fuentes oficiales y revisado por la redacción.';

export const SECCIONES = {
  politica: {
    nombre: 'Política',
    descripcion: 'Lo que publican el BOE, las Cortes y el Gobierno, explicado con enlaces a cada documento original.',
  },
  historia: {
    nombre: 'Historia',
    descripcion: 'Una efeméride y dos curiosidades al día, cada una con su fuente verificable.',
  },
} as const;

export const FORMATOS = {
  'boe-hoy': 'Lo que publica hoy el BOE',
  explicado: 'Explicado',
  agenda: 'Agenda de la semana',
  consejo: 'Consejo de Ministros',
  efemeride: 'Efeméride',
  curiosidad: 'Curiosidad',
} as const;

export type Seccion = keyof typeof SECCIONES;
export type Formato = keyof typeof FORMATOS;
