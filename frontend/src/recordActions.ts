import { API_BASE } from './api.js';
import { getRecordPath, hideAnyForm, showAnyForm } from './forms.js';
import { getLocalizedText } from './localization.js';
import { structure } from './structure.js';
import type { TableKey, TableRecordMap } from './structure.js';
import type { TableActions } from './types.js';

export type ReloadTableData = <K extends TableKey>(tableKey: K) => void;

export function createRecordActions(reloadTableData: ReloadTableData): TableActions {
  return {
    async onEdit<K extends TableKey>(tableKey: K, ...pkValues: string[]) {
      try {
        const response = await fetch(`${API_BASE}/${tableKey}${getRecordPath(pkValues)}`);
        const record = (await response.json()) as TableRecordMap[K];
        showAnyForm(tableKey, { record, onSaved: reloadTableData });
      } catch (error) {
        console.error(`Error loading ${tableKey} for edit:`, error);
      }
    },

    async onDelete<K extends TableKey>(tableKey: K, ...pkValues: string[]) {
      const tableConfig = structure.tables[tableKey];
      const recordName = getLocalizedText(tableConfig.uiName).toLowerCase();

      if (!confirm(`¿Está seguro de que desea eliminar este ${recordName}? / Are you sure you want to delete this ${recordName}?`)) {
        return;
      }

      try {
        await fetch(`${API_BASE}/${tableKey}${getRecordPath(pkValues)}`, { method: 'DELETE' });
        reloadTableData(tableKey);
      } catch (error) {
        console.error(`Error deleting ${tableKey}:`, error);
      }
    },
  };
}

export function registerRecordActions(actions: TableActions): void {
  window.hideAnyForm = hideAnyForm;
  window.editRecord = actions.onEdit;
  window.deleteRecord = actions.onDelete;
}

declare global {
  interface Window {
    hideAnyForm: () => void;
    editRecord: <K extends TableKey>(tableKey: K, ...pkValues: string[]) => void;
    deleteRecord: <K extends TableKey>(tableKey: K, ...pkValues: string[]) => void;
  }
}
