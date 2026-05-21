// App coordinator: wires navigation, top-level API actions, and the initial screen load.
import { API_BASE } from './config.js';
import { addRecordBtn, navContainer, viewTitle } from './dom.js';
import { getRecordPath, hideAnyForm, showAnyForm } from './form.js';
import { commonText, getLanguage, setLanguage, t } from './internationalization.js';
import { structure, type TableKey, type TableRecordMap } from './schema.js';
import { renderAnyTable } from './table.js';
import type { Language } from './types.js';

const tableKeys = Object.keys(structure.tables) as TableKey[];
const tableNavButtons = {} as Record<TableKey, HTMLButtonElement>;
const appTitle = document.getElementById('app-title');
const languageSelect = document.getElementById('language-select') as HTMLSelectElement | null;
let activeTableKey: TableKey = tableKeys[0];

for (const key of tableKeys) {
  const btn = document.createElement('button');
  btn.id = `${key}-btn`;
  navContainer.appendChild(btn);
  tableNavButtons[key] = btn;
  btn.addEventListener('click', () => showSection(key));
}

function showSection(section: TableKey): void {
  activeTableKey = section;

  Object.entries(tableNavButtons).forEach(([key, button]) => {
    button.classList.toggle('active', key === section);
    const tableConfig = structure.tables[key as TableKey];
    button.textContent = t(tableConfig.title ?? tableConfig.uiName);
  });

  const tableConfig = structure.tables[section];
  const translatedAppTitle = t(commonText.appTitle);
  document.title = translatedAppTitle;
  if (appTitle) appTitle.textContent = translatedAppTitle;
  viewTitle.textContent = t(tableConfig.title ?? tableConfig.uiName);
  addRecordBtn.textContent = t(tableConfig.addButtonLabel) || `${t(commonText.add)} ${t(tableConfig.uiName)}`;
  hideAnyForm();
  loadTableData(section);
}

async function loadTableData<K extends TableKey>(tableKey: K): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${tableKey}`);
    const data = (await response.json()) as TableRecordMap[K][];
    renderAnyTable(tableKey, data, {
      onEdit: editRecord,
      onDelete: deleteRecord,
    });
  } catch (error) {
    console.error(`Error loading ${tableKey}:`, error);
  }
}

async function editRecord<K extends TableKey>(tableKey: K, pkValues: string[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${tableKey}${getRecordPath(pkValues)}`);
    const record = (await response.json()) as TableRecordMap[K];
    showAnyForm(tableKey, { record, onSaved: loadTableData });
  } catch (error) {
    console.error(`Error loading ${tableKey} for edit:`, error);
  }
}

async function deleteRecord<K extends TableKey>(tableKey: K, pkValues: string[]): Promise<void> {
  const tableConfig = structure.tables[tableKey];
  const tableName = t(tableConfig.uiName).toLowerCase();
  const confirmed = confirm(
    getLanguage() === 'es'
      ? `¿Está seguro de que desea eliminar este ${tableName}?`
      : `Are you sure you want to delete this ${tableName}?`,
  );

  if (!confirmed) return;

  try {
    await fetch(`${API_BASE}/${tableKey}${getRecordPath(pkValues)}`, { method: 'DELETE' });
    loadTableData(tableKey);
  } catch (error) {
    console.error(`Error deleting ${tableKey}:`, error);
  }
}

addRecordBtn.addEventListener('click', () => {
  showAnyForm(activeTableKey, { onSaved: loadTableData });
});

if (languageSelect) {
  languageSelect.value = getLanguage();
}

languageSelect?.addEventListener('change', (event) => {
  const select = event.currentTarget as HTMLSelectElement;
  setLanguage(select.value as Language);
  showSection(activeTableKey);
});

showSection(activeTableKey);
