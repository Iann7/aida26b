// Table renderer: draws records and delegates edit/delete button behavior to callbacks.
import { sharedTable } from './dom.js';
import { structure, type TableKey, type TableRecordMap } from './schema.js';

type TableActions<K extends TableKey> = {
  onEdit: (tableKey: K, pkValues: string[]) => void;
  onDelete: (tableKey: K, pkValues: string[]) => void;
};

export function renderAnyTable<K extends TableKey>(
  tableKey: K,
  records: TableRecordMap[K][],
  actions: TableActions<K>,
): void {
  const thead = sharedTable.querySelector('thead')!;
  const tbody = sharedTable.querySelector('tbody')!;
  const tableStructure = structure.tables[tableKey];
  thead.innerHTML = '';
  tbody.innerHTML = '';

  const headerRow = document.createElement('tr');
  Object.values(tableStructure.columns).forEach((column) => {
    const th = document.createElement('th');
    th.textContent = column.label ?? '';
    headerRow.appendChild(th);
  });

  const actionsHeader = document.createElement('th');
  actionsHeader.textContent = 'Acciones / Actions';
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

    const pkValues = pkFields.map((field) => String(record[field as keyof TableRecordMap[K]] ?? ''));
    const actionsTd = document.createElement('td');
    actionsTd.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Editar / Edit';
    editBtn.addEventListener('click', () => actions.onEdit(tableKey, pkValues));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Eliminar / Delete';
    deleteBtn.addEventListener('click', () => actions.onDelete(tableKey, pkValues));

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);
    row.appendChild(actionsTd);
    tbody.appendChild(row);
  });
}
