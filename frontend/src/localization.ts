import type { Language, LocalizedText } from './types.js';

const storedLanguage = localStorage.getItem('language');
let currentLanguage: Language = isLanguage(storedLanguage) ? storedLanguage : 'es';

export function isLanguage(value: string | null): value is Language {
  return value === 'es' || value === 'en';
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(language: Language): void {
  currentLanguage = language;
  localStorage.setItem('language', language);
}

export function getLocalizedText(text?: LocalizedText): string {
  return text?.[currentLanguage] ?? '';
}
