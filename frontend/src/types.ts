// Shared TypeScript types used to describe schema fields and infer record shapes.
export type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  date: Date;
};

export type MyTypeNames = keyof TypeMap;

export type ColumnDef = {
  type: MyTypeNames;
  label?: string;
  input?: 'text' | 'email' | 'date' | 'number' | 'textarea' | 'select';
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  editable?: boolean;
  readonlyOnEdit?: boolean;
  nullable?: boolean;
};

export type TableStructure = {
  columns: Record<string, ColumnDef>;
  pk: string | string[];
  uiName: string;
  title?: string;
  addButtonLabel?: string;
};

export type InferType<FieldDefs extends Record<string, ColumnDef>> = {
  [K in keyof FieldDefs]: TypeMap[FieldDefs[K]['type']];
};
