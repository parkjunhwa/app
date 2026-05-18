import { disposePageWidgets, hideDxLicenseBanner } from './devextreme-init.js';
import { bindLucideIcons } from './page-utils.js';
import { setGnbActive, setupNavHeaders } from './shell.js';

const ROUTES = {
  '#/home': { partial: 'pages/home.html', gnb: 'home', init: () => import('./pages/home.js') },
  '#/expense/inbox': { partial: 'pages/expense-inbox.html', gnb: 'expense', init: () => import('./pages/expense-inbox.js') },
  '#/expense/receipt': { partial: 'pages/expense-receipt.html', gnb: 'expense', init: () => import('./pages/expense-receipt.js') },
  '#/report': { partial: 'pages/report.html', gnb: 'report', init: () => import('./pages/report.js') },
  '#/approve': { partial: 'pages/approve.html', gnb: 'approve', init: () => import('./pages/approve.js') },
};

let currentDispose = null;

function parseHash() {
  const raw = window.location.hash || '#/home';
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  return { path, params };
}

export function navigate(hash) {
  if (!hash.startsWith('#')) hash = `#${hash}`;
  window.location.hash = hash;
}

export async function handleRoute() {
  const { path, params } = parseHash();
  const route = ROUTES[path] || ROUTES['#/home'];

  if (currentDispose) {
    currentDispose();
    currentDispose = null;
  }

  const main = document.getElementById('app-main');
  if (!main) return;

  const res = await fetch(route.partial);
  if (!res.ok) {
    main.innerHTML = `<p style="padding:16px">화면을 불러올 수 없습니다: ${route.partial}</p>`;
    return;
  }

  const html = await res.text();
  disposePageWidgets(main);
  main.innerHTML = html;
  bindLucideIcons(main);
  setupNavHeaders(main);
  setGnbActive(route.gnb);

  const mod = await route.init();
  if (mod?.initPage) {
    currentDispose = mod.initPage(main, params) || null;
  }

  hideDxLicenseBanner();
  requestAnimationFrame(hideDxLicenseBanner);

  main.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = el.getAttribute('data-nav');
      if (target) {
        e.preventDefault();
        navigate(target);
      }
    });
  });

  main.querySelectorAll('[data-back]').forEach((el) => {
    el.addEventListener('click', () => {
      window.history.back();
    });
  });
}

export function startRouter() {
  window.addEventListener('hashchange', () => handleRoute());
  return handleRoute();
}
