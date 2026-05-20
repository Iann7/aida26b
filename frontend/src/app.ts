// App coordinator: wires navigation, top-level API actions, and the initial screen load.
import { API_BASE } from './config.js';
import { addRecordBtn, navContainer, viewTitle } from './dom.js';
import { getRecordPath, hideAnyForm, showAnyForm } from './form.js';
import { structure, type TableKey, type TableRecordMap } from './schema.js';
import { renderAnyTable } from './table.js';

const tableKeys = Object.keys(structure.tables) as TableKey[];
const tableNavButtons = {} as Record<TableKey, HTMLButtonElement>;
let activeTableKey: TableKey = tableKeys[0];

for (const key of tableKeys) {
  const cfg = structure.tables[key];
  const btn = document.createElement('button');
  btn.id = `${key}-btn`;
  btn.textContent = cfg.title ?? cfg.uiName;
  navContainer.appendChild(btn);
  tableNavButtons[key] = btn;
  btn.addEventListener('click', () => showSection(key));
}

function showSection(section: TableKey): void {
  activeTableKey = section;

  Object.entries(tableNavButtons).forEach(([key, button]) => {
    button.classList.toggle('active', key === section);
  });

  const tableConfig = structure.tables[section];
  viewTitle.textContent = tableConfig.title ?? tableConfig.uiName;
  addRecordBtn.textContent = tableConfig.addButtonLabel || `Agregar ${tableConfig.uiName} / Add ${tableConfig.uiName}`;
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
  const confirmed = confirm(
    `¿Está seguro de que desea eliminar este ${tableConfig.uiName.toLowerCase()}? / Are you sure you want to delete this ${tableConfig.uiName.toLowerCase()}?`,
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

showSection(activeTableKey);
