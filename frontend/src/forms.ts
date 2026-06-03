import { API_BASE } from './api.js';
import { getLocalizedText } from './localization.js';
import { getRenderer, mapInputToRenderer } from './renderers.js';
import { structure } from './structure.js';
import type { TableKey, TableRecordMap } from './structure.js';
import type { ColumnDef } from './types.js';

let formContainer: HTMLElement | null = null;
//#region getters
function getPkFields(tableKey: TableKey): string[] {
  const tableConfig = structure.tables[tableKey];
  return Array.isArray(tableConfig.pk) ? tableConfig.pk : [tableConfig.pk];
}

function getFieldElementId(tableKey: TableKey, fieldName: string): string {
  return `${tableKey}-${fieldName}`;
}

export function getRecordPath(recordValues: string[]): string {
  return `/${recordValues.map((value) => encodeURIComponent(value)).join('/')}`;
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
//#endregion  
//#region initialization
export function initForms(container: HTMLElement): void {
  formContainer = container;
}
//#endregion 
//region UI 
export function hideAnyForm(): void {
  if (!formContainer) return;
  formContainer.style.display = 'none';
  formContainer.innerHTML = '';
}
function renderFormField<K extends TableKey>(
  tableKey: K,
  fieldName: keyof TableRecordMap[K] & string,
  column: ColumnDef,
  record?: Partial<TableRecordMap[K]>,
  isEdit = false,
): HTMLElement {
  const id = getFieldElementId(tableKey, fieldName);
  const wrapper = document.createElement('div');
  wrapper.className = 'form-group';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = id;
  labelEl.textContent = getLocalizedText(column.label);
  wrapper.appendChild(labelEl);

  const renderer = getRenderer<K>(mapInputToRenderer(column.input));
  wrapper.appendChild(renderer({ id, fieldName, column, record, isEdit }));

  return wrapper;
}
//#endregion 
export async function showAnyForm<K extends TableKey>(
  tableKey: K,
  options: {
    record?: Partial<TableRecordMap[K]>;
    onSaved: (tableKey: K) => void;
  },
): Promise<void> {
  if (!formContainer) throw new Error('Forms module was not initialized');

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
  h3.textContent = `${isEdit ? getLocalizedText(structure.commonText.edit) : getLocalizedText(structure.commonText.add)} ${getLocalizedText(tableConfig.uiName)}`;
  form.appendChild(h3);
  fields.forEach((field) => form.appendChild(field));

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'form-actions';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = isEdit ? getLocalizedText(structure.commonText.update) : getLocalizedText(structure.commonText.add);

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'cancel-btn';
  cancelBtn.textContent = getLocalizedText(structure.commonText.cancel);
  cancelBtn.addEventListener('click', hideAnyForm);

  actionsDiv.appendChild(submitBtn);
  actionsDiv.appendChild(cancelBtn);
  form.appendChild(actionsDiv);
  formContainer.appendChild(form);
  formContainer.style.display = 'flex';

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
      console.error(`Error saving ${getLocalizedText(tableConfig.uiName).toLowerCase()}:`, error);
    }
  });
}
//#endregion
