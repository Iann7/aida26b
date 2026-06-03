import { API_BASE } from './api.js';
import { getLocalizedText } from './localization.js';
import { structure } from './structure.js';
import type { TableKey, TableRecordMap } from './structure.js';

export type TableActions = {
  onEdit: <K extends TableKey>(tableKey: K, ...pkValues: string[]) => void;
  onDelete: <K extends TableKey>(tableKey: K, ...pkValues: string[]) => void;
};

export async function loadTableData<K extends TableKey>(
  sharedTable: HTMLTableElement,
  tableKey: K,
  actions: TableActions,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${tableKey}`);
    const data = (await response.json()) as TableRecordMap[K][];
    renderAnyTable(sharedTable, tableKey, data, actions);
  } catch (error) {
    console.error(`Error loading ${tableKey}:`, error);
  }
}

export function renderAnyTable<K extends TableKey>(
  sharedTable: HTMLTableElement,
  tableKey: K,
  records: TableRecordMap[K][],
  actions: TableActions,
): void {
  const thead = sharedTable.querySelector('thead');
  const tbody = sharedTable.querySelector('tbody');
  if (!thead || !tbody) throw new Error('Records table must include thead and tbody elements');

  const tableStructure = structure.tables[tableKey];
  thead.innerHTML = '';
  tbody.innerHTML = '';

  const headerRow = document.createElement('tr');
  Object.values(tableStructure.columns).forEach((column) => {
    const th = document.createElement('th');
    th.textContent = getLocalizedText(column.label);
    headerRow.appendChild(th);
  });

  const actionsHeader = document.createElement('th');
  actionsHeader.textContent = getLocalizedText(structure.commonText.actions);
  headerRow.appendChild(actionsHeader);
  thead.appendChild(headerRow);

  records.forEach((record) => {
    const pkFields = Array.isArray(tableStructure.pk) ? tableStructure.pk : [tableStructure.pk];
    const row = document.createElement('tr');
    const columnNames = Object.keys(tableStructure.columns) as Array<keyof TableRecordMap[K] & string>;

    columnNames.forEach((name) => {
      const td = document.createElement('td');
      td.textContent = String(record[name] ?? '');
      row.appendChild(td);
    });

    const actionsTd = document.createElement('td');
    actionsTd.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = getLocalizedText(structure.commonText.edit);
    editBtn.dataset.table = String(tableKey);
    editBtn.dataset.pk = JSON.stringify(pkFields.map((field) => String(record[field as keyof TableRecordMap[K]] ?? '')));
    editBtn.addEventListener('click', (e) => {
      const pkValues = JSON.parse((e.currentTarget as HTMLElement).dataset.pk || '[]') as string[];
      actions.onEdit(tableKey, ...pkValues);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = getLocalizedText(structure.commonText.delete);
    deleteBtn.dataset.table = String(tableKey);
    deleteBtn.dataset.pk = editBtn.dataset.pk;
    deleteBtn.addEventListener('click', (e) => {
      const pkValues = JSON.parse((e.currentTarget as HTMLElement).dataset.pk || '[]') as string[];
      actions.onDelete(tableKey, ...pkValues);
    });

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);
    row.appendChild(actionsTd);
    tbody.appendChild(row);
  });
}
