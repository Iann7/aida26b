import type { Language, LocalizedText } from './types.js';

function isLanguage(value: string | null): value is Language {
  return value === 'es' || value === 'en';
}

const storedLanguage = localStorage.getItem('language');
let currentLanguage: Language = isLanguage(storedLanguage) ? storedLanguage : 'es';

export const commonText = {
  actions: { es: 'Acciones', en: 'Actions' },
  add: { es: 'Agregar', en: 'Add' },
  appTitle: { es: 'Sistema de Gestión Académica', en: 'Academic Management System' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  delete: { es: 'Eliminar', en: 'Delete' },
  edit: { es: 'Editar', en: 'Edit' },
  update: { es: 'Actualizar', en: 'Update' },
} satisfies Record<string, LocalizedText>;

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(language: Language): void {
  currentLanguage = language;
  localStorage.setItem('language', language);
}

export function t(text?: LocalizedText): string {
  return text?.[currentLanguage] ?? '';
}
