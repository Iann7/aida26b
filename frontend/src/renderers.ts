import { getLocalizedText } from './localization.js';
import type { TableKey, TableRecordMap } from './structure.js';
import type { ColumnDef, LocalizedText } from './types.js';

export type RendererProps<K extends TableKey> = {
  id: string;
  fieldName: keyof TableRecordMap[K] & string;
  column: ColumnDef;
  record?: Partial<TableRecordMap[K]>;
  isEdit?: boolean;
};

type RendererFunc = <K extends TableKey>(props: RendererProps<K>) => HTMLElement;

const renderers: Record<'input' | 'textarea' | 'select', RendererFunc> = {
  input<K extends TableKey>({ id, fieldName, column, record, isEdit }: RendererProps<K>) {
    const input = document.createElement('input');
    input.id = id;
    input.type = column.input ?? (column.type === 'number' ? 'number' : 'text');
    if (column.required) input.required = true;
    if (isEdit && column.readonlyOnEdit) input.readOnly = true;
    input.value = String(record?.[fieldName] ?? '');
    return input;
  },
  textarea<K extends TableKey>({ id, fieldName, column, record }: RendererProps<K>) {
    const textarea = document.createElement('textarea');
    textarea.id = id;
    if (column.required) textarea.required = true;
    textarea.value = String(record?.[fieldName] ?? '');
    return textarea;
  },
  select<K extends TableKey>({ id, fieldName, column, record }: RendererProps<K>) {
    const select = document.createElement('select');
    select.id = id;
    if (column.required) select.required = true;

    (column.options || []).forEach((opt: { value: string; label: LocalizedText }) => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = getLocalizedText(opt.label);
      if (String(record?.[fieldName] ?? '') === opt.value) option.selected = true;
      select.appendChild(option);
    });

    return select;
  },
};

type RendererKey = keyof typeof renderers;

export function getRenderer<K extends TableKey>(key: RendererKey) {
  return renderers[key] as (props: RendererProps<K>) => HTMLElement;
}

export function mapInputToRenderer(input?: ColumnDef['input']): RendererKey {
  if (input === 'textarea') return 'textarea';
  if (input === 'select') return 'select';
  return 'input';
}
