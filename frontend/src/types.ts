export type Language = 'es' | 'en';

export type LocalizedText = Record<Language, string>;

export type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  date: Date;
};

export type MyTypeNames = keyof TypeMap;

export type ColumnDef = {
  type: MyTypeNames;
  label?: LocalizedText;
  input?: 'text' | 'email' | 'date' | 'number' | 'textarea' | 'select';
  options?: Array<{ value: string; label: LocalizedText }>;
  required?: boolean;
  editable?: boolean;
  readonlyOnEdit?: boolean;
  nullable?: boolean;
};

export type TableStructure = {
  columns: Record<string, ColumnDef>;
  pk: string | string[];
  uiName: LocalizedText;
  title?: LocalizedText;
  addButtonLabel?: LocalizedText;
};

export type InferType<FieldDefs extends Record<string, ColumnDef>> = {
  [K in keyof FieldDefs]: TypeMap[FieldDefs[K]['type']];
};

export type MenuOption = {
  value: string;
  label: LocalizedText;
};

export type MenuConfig = {
  title: LocalizedText;
  id: string;
  handler: (value: string) => void;
  options: MenuOption[];
  initial: string | (() => string);
};

export type AppElements = {
  viewTitle: HTMLElement;
  addRecordBtn: HTMLButtonElement;
  formContainer: HTMLElement;
  sharedTable: HTMLTableElement;
  navRoot: HTMLElement;
  menuRoot: HTMLElement;
};
