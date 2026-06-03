//#region Imports
import { getRecordPath, hideAnyForm, initForms, showAnyForm } from './forms.js';
import { getLanguage, getLocalizedText, isLanguage, setLanguage } from './localization.js';
import { createRecordActions, registerRecordActions } from './recordActions.js';
import type { Language, MenuConfig, AppElements } from './types.js';
import { structure, tableKeys } from './structure.js';
import type { TableActions} from './table.js';
import  { loadTableData} from './table.js';
import type { TableKey} from './structure.js';
import { renderMenu } from './menu.js';
//#endregion 

//#region Variables  
const DEFAULT_THEME = 'light';
const TABLE_NAV_BUTTONS = {} as Record<TableKey, HTMLButtonElement>;
const menuConfigs: MenuConfig[] = [
  {
    title: { es: 'Tema', en: 'Theme' },
    id: 'theme-picker',
    handler: (value: string) => {
      try {
        if (!value) throw new Error('Theme value is required');
        document.body.setAttribute('data-theme', value);
        localStorage.setItem('theme', value);
      } catch (err) {
        console.error('Error changing theme:', err);
      }
    },
    options: [
      { value: 'light', label: { es: 'Claro', en: 'Light' } },
      { value: 'dark', label: { es: 'Oscuro', en: 'Dark' } },
    ],
    initial: () => localStorage.getItem('theme') || DEFAULT_THEME,
  },
  {
    title: { es: 'Idioma', en: 'Language' },
    id: 'language-picker',
    handler: (value: string) => {
      try {
        if (!value || !isLanguage(value)) throw new Error('Invalid language value');
        setLanguage(value as Language);
        updateNavButtonsText();
        showSection(activeTableKey);
        renderMenu(appElements.menuRoot, menuConfigs);
        updateAppTitle();
      } catch (err) {
        console.error('Error changing language:', err);
      }
    },
    options: [
      { value: 'es', label: { es: 'Español', en: 'Spanish' } },
      { value: 'en', label: { es: 'Inglés', en: 'English' } },
    ],
    initial: () => getLanguage(),
  },
];

let activeTableKey: TableKey = tableKeys[0];
let appElements: AppElements;
let recordActions: TableActions;
//#endregion


//#region Getters 
function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id} element in DOM`);
  return element as T;
}

function getAppElements(): AppElements {
  return {
    viewTitle: getRequiredElement('view-title'),
    addRecordBtn: getRequiredElement('add-record-btn'),
    formContainer: getRequiredElement('record-form'),
    sharedTable: getRequiredElement('records-table'),
    navRoot: getRequiredElement('table-nav'),
    menuRoot: getRequiredElement('menu-nav'),
  };
}
//#endregion 

//#region setters 
function updateAppTitle(): void {
  const appTitleEl = document.getElementById('app-title');
  if (appTitleEl) appTitleEl.textContent = getLocalizedText(structure.commonText.appTitle);
}

function updateNavButtonsText(): void {
  tableKeys.forEach((key) => {
    const cfg = structure.tables[key];
    TABLE_NAV_BUTTONS[key].textContent = getLocalizedText(cfg.title) || getLocalizedText(cfg.uiName) || key;
  });
}
//#endregion 

//#region UI 
function reloadTableData<K extends TableKey>(tableKey: K): Promise<void> {
  return loadTableData(appElements.sharedTable, tableKey, recordActions);
}

function showSection(section: TableKey): void {
  activeTableKey = section;

  Object.entries(TABLE_NAV_BUTTONS).forEach(([key, button]) => {
    button.classList.toggle('active', key === section);
  });

  const tableConfig = structure.tables[section];
  appElements.viewTitle.textContent = getLocalizedText(tableConfig.title);
  appElements.addRecordBtn.textContent =
    getLocalizedText(tableConfig.addButtonLabel) ||
    `Agregar ${getLocalizedText(tableConfig.uiName)} / Add ${getLocalizedText(tableConfig.uiName)}`;
  hideAnyForm();
  reloadTableData(section);
}
//#endregion 


//#region Initialization
function initNavigation(): void {
  tableKeys.forEach((key) => {
    const cfg = structure.tables[key];
    const btn = document.createElement('button');
    btn.id = `${key}-btn`;
    btn.textContent = getLocalizedText(cfg.title) || getLocalizedText(cfg.uiName) || key;
    btn.addEventListener('click', () => showSection(key));

    appElements.navRoot.appendChild(btn);
    TABLE_NAV_BUTTONS[key] = btn;
  });
}

function initRecordActions(): void {
  recordActions = createRecordActions(reloadTableData);
  registerRecordActions(recordActions);
}

function initAddRecordButton(): void {
  appElements.addRecordBtn.addEventListener('click', () => showAnyForm(activeTableKey, { onSaved: reloadTableData }));
}

function initTheme(): void {
  document.body.setAttribute('data-theme', localStorage.getItem('theme') || DEFAULT_THEME);
}

function initApp(): void {
  appElements = getAppElements();

  initForms(appElements.formContainer);
  initRecordActions();
  initNavigation();
  initAddRecordButton();
  initTheme();
  updateAppTitle();

  showSection(activeTableKey);
  renderMenu(appElements.menuRoot, menuConfigs);
}

initApp();
//#endregion 

//#region exports
export { getRecordPath, hideAnyForm, showAnyForm, getLanguage, getLocalizedText, setLanguage };
//#endregion