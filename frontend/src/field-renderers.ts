// Field rendering helpers: convert schema column definitions into form controls.
import { getLocalizedText } from './internationalization.js';
import type { ColumnDef } from './types.js';
import type { TableKey, TableRecordMap } from './schema.js';

type RendererProps<K extends TableKey> = {
  id: string;
  fieldName: keyof TableRecordMap[K] & string;
  column: ColumnDef;
  record?: Partial<TableRecordMap[K]>;
  isEdit?: boolean;
};

type RendererFunc = <K extends TableKey>(props: RendererProps<K>) => HTMLElement;

const renderers: Record<'input' | 'textarea' | 'select', RendererFunc> = {
  input<K extends TableKey>({ id, fieldName, column, record, isEdit }: RendererProps<K>) {
    const inp = document.createElement('input');
    inp.id = id;
    inp.type = column.input ?? (column.type === 'number' ? 'number' : 'text');
    if (column.required) inp.required = true;
    if (isEdit && column.readonlyOnEdit) inp.readOnly = true;
    inp.value = String(record?.[fieldName] ?? '');
    return inp;
  },
  textarea<K extends TableKey>({ id, fieldName, column, record }: RendererProps<K>) {
    const ta = document.createElement('textarea');
    ta.id = id;
    if (column.required) ta.required = true;
    ta.value = String(record?.[fieldName] ?? '');
    return ta;
  },
  select<K extends TableKey>({ id, fieldName, column, record }: RendererProps<K>) {
    const sel = document.createElement('select');
    sel.id = id;
    if (column.required) sel.required = true;
    (column.options || []).forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = getLocalizedText(opt.label);
      if (String(record?.[fieldName] ?? '') === opt.value) o.selected = true;
      sel.appendChild(o);
    });
    return sel;
  },
};

type RendererKey = keyof typeof renderers;

function getRenderer<K extends TableKey>(key: RendererKey) {
  return renderers[key] as (props: RendererProps<K>) => HTMLElement;
}

function mapInputToRenderer(input?: ColumnDef['input']): RendererKey {
  if (!input) return 'input';
  if (input === 'textarea') return 'textarea';
  if (input === 'select') return 'select';
  return 'input';
}

export function getFieldElementId(tableKey: TableKey, fieldName: string): string {
  return `${tableKey}-${fieldName}`;
}

export function renderFormField<K extends TableKey>(
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
