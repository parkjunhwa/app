import { createLucideIcon } from './icons.js';

const GNB_ITEMS = [
  { key: 'home', label: '홈', icon: 'home', route: '#/home' },
  { key: 'expense', label: '경비', icon: 'wallet', route: '#/expense/inbox' },
  { key: 'report', label: '보고서', icon: 'file-text', route: '#/report' },
  { key: 'approve', label: '승인', icon: 'user', route: '#/approve' },
];

let onLogout = () => {};

export function setShellCallbacks(callbacks) {
  if (callbacks.logout) onLogout = callbacks.logout;
}

export function setGnbActive(key) {
  document.querySelectorAll('.evs-gnb-item').forEach((btn) => {
    const isActive = btn.dataset.gnb === key;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

function navHeaderActionsHtml() {
  return [
    '<button type="button" class="evs-iconbtn" aria-label="알림">',
    createLucideIcon('bell', 22),
    '<span class="dot"></span>',
    '</button>',
    '<button type="button" class="evs-iconbtn" id="btn-logout" aria-label="로그아웃">',
    createLucideIcon('log-out', 22),
    '</button>',
  ].join('');
}

export function setupNavHeaders(root) {
  if (!root) return;

  root.querySelectorAll('.nav-header__actions').forEach((el) => {
    el.innerHTML = navHeaderActionsHtml();
  });

  root.querySelector('#btn-logout')?.addEventListener('click', onLogout);
}

export function renderGnb(onNavigate) {
  const el = document.getElementById('app-gnb');
  if (!el) return;
  el.innerHTML = GNB_ITEMS.map(
    (item) =>
      `<button type="button" class="evs-gnb-item" data-gnb="${item.key}" data-route="${item.route}">` +
      `${createLucideIcon(item.icon, 24, 'currentColor', 'evs-gnb-item__icon')}` +
      `<span>${item.label}</span></button>`,
  ).join('');

  el.querySelectorAll('.evs-gnb-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.getAttribute('data-route');
      if (route && onNavigate) onNavigate(route);
    });
  });
}
