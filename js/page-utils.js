import { createLucideIcon, hydrateLucideIcons } from './icons.js';

const LUCIDE_SLOTS = {
  'data-lucide-back': ['chevron-left', 22],
  'data-lucide-filter': ['funnel', 18],
  'data-lucide-info': ['info', 14],
  'data-lucide-plus': ['plus', 22],
};

export function bindLucideIcons(root) {
  if (!root) return;
  Object.entries(LUCIDE_SLOTS).forEach(([attr, [name, size]]) => {
    root.querySelectorAll(`[${attr}]`).forEach((el) => {
      const svg = createLucideIcon(name, size);
      if (svg) el.innerHTML = svg;
    });
  });
  hydrateLucideIcons(root);
}
