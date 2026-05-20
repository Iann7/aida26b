// Centralized DOM lookups for elements shared across the application.
function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id} element in DOM`);
  return element as T;
}

export const viewTitle = getRequiredElement<HTMLElement>('view-title');
export const addRecordBtn = getRequiredElement<HTMLButtonElement>('add-record-btn');
export const formContainer = getRequiredElement<HTMLElement>('record-form');
export const sharedTable = getRequiredElement<HTMLTableElement>('records-table');
export const navContainer = getRequiredElement<HTMLElement>('table-nav');
