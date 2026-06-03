import { getLocalizedText } from './localization.js';
import type { MenuConfig } from './types.js';

export function renderAnyMenuOption(menuContainer: HTMLElement, cfg: MenuConfig): void {
  const selectEl = document.createElement('select');
  selectEl.id = cfg.id;
  selectEl.classList.add('picker');

  const initialValue = typeof cfg.initial === 'function' ? cfg.initial() : cfg.initial;

  cfg.options.forEach((opt) => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = getLocalizedText(opt.label);

    if (opt.value === initialValue) {
      optionEl.selected = true;
    }

    selectEl.appendChild(optionEl);
  });

  selectEl.addEventListener('change', (e) => {
    cfg.handler((e.target as HTMLSelectElement).value);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'picker-wrapper';

  const label = document.createElement('label');
  label.htmlFor = cfg.id;
  label.textContent = getLocalizedText(cfg.title);

  wrapper.appendChild(label);
  wrapper.appendChild(selectEl);
  menuContainer.appendChild(wrapper);
}

export function renderMenu(menuContainer: HTMLElement, menuConfigs: MenuConfig[]): void {
  menuContainer.innerHTML = '';
  menuConfigs.forEach((cfg) => renderAnyMenuOption(menuContainer, cfg));
}
