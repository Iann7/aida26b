// Form workflow: render add/edit forms, collect input values, and submit saves.
import { API_BASE } from './config.js';
import { formContainer } from './dom.js';
import { getFieldElementId, renderFormField } from './field-renderers.js';
import { structure, type TableKey, type TableRecordMap } from './schema.js';

export function getPkFields(tableKey: TableKey): string[] {
  const tableConfig = structure.tables[tableKey];
  return Array.isArray(tableConfig.pk) ? tableConfig.pk : [tableConfig.pk];
}

function collectFormData<K extends TableKey>(tableKey: K): Partial<TableRecordMap[K]> {
  const tableConfig = structure.tables[tableKey];
  const payload: Partial<TableRecordMap[K]> = {};

  Object.entries(tableConfig.columns)
    .filter(([, column]) => column.editable !== false)
    .forEach(([fieldName, column]) => {
      const id = getFieldElementId(tableKey, fieldName);
      const element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      const rawValue = element?.value ?? '';

      if (column.type === 'number') {
        payload[fieldName as keyof TableRecordMap[K]] = (rawValue === ''
          ? column.nullable
            ? null
            : 0
          : Number(rawValue)) as TableRecordMap[K][keyof TableRecordMap[K]];
        return;
      }

      payload[fieldName as keyof TableRecordMap[K]] = rawValue as TableRecordMap[K][keyof TableRecordMap[K]];
    });

  return payload;
}

export function getRecordPath(recordValues: string[]): string {
  return `/${recordValues.map((value) => encodeURIComponent(value)).join('/')}`;
}

export function hideAnyForm(): void {
  formContainer.style.display = 'none';
  formContainer.innerHTML = '';
}

export async function showAnyForm<K extends TableKey>(
  tableKey: K,
  options: {
    record?: Partial<TableRecordMap[K]>;
    onSaved: (tableKey: K) => void;
  },
): Promise<void> {
  const { record, onSaved } = options;
  const tableConfig = structure.tables[tableKey];
  const isEdit = !!record;
  const formId = `${tableKey}-form`;

  const fields = Object.entries(tableConfig.columns)
    .filter(([, column]) => column.editable !== false)
    .map(([fieldName, column]) => renderFormField(tableKey, fieldName as keyof TableRecordMap[K] & string, column, record, isEdit));

  formContainer.innerHTML = '';
  const form = document.createElement('form');
  form.id = formId;

  const h3 = document.createElement('h3');
  h3.textContent = isEdit ? `Editar ${tableConfig.uiName} / Edit ${tableConfig.uiName}` : `Agregar ${tableConfig.uiName} / Add ${tableConfig.uiName}`;
  form.appendChild(h3);
  fields.forEach((field) => form.appendChild(field));

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'form-actions';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = isEdit ? 'Actualizar / Update' : 'Agregar / Add';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'cancel-btn';
  cancelBtn.textContent = 'Cancelar / Cancel';
  cancelBtn.addEventListener('click', hideAnyForm);

  actionsDiv.appendChild(submitBtn);
  actionsDiv.appendChild(cancelBtn);
  form.appendChild(actionsDiv);
  formContainer.appendChild(form);
  formContainer.style.display = 'block';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = collectFormData(tableKey);
    const recordValues = record as Record<string, unknown> | undefined;
    const pkPath = isEdit
      ? `/${getPkFields(tableKey)
          .map((fieldName) => encodeURIComponent(String((payload as Record<string, unknown>)[fieldName] ?? recordValues?.[fieldName] ?? '')))
          .join('/')}`
      : '';

    try {
      await fetch(`${API_BASE}/${tableKey}${pkPath}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      hideAnyForm();
      onSaved(tableKey);
    } catch (error) {
      console.error(`Error saving ${tableConfig.uiName.toLowerCase()}:`, error);
    }
  });
}
