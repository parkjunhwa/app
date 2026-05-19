import { waitForDevExtreme } from './devextreme-init.js';
import { handleRoute, navigate, startRouter } from './router.js';
import { renderGnb, setShellCallbacks } from './shell.js';

const AUTH_KEY = 'evs-auth';

function isAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

function guardAuth() {
  if (!isAuthed()) {
    window.location.replace('login.html');
    return false;
  }
  return true;
}

async function boot() {
  if (!guardAuth()) return;

  setShellCallbacks({ logout });

  if (!globalThis.lucide) {
    console.warn('[EVS] lucide.min.js가 로드되지 않았습니다. GNB·NavHeader 아이콘이 표시되지 않습니다.');
  }

  try {
    await waitForDevExtreme();
  } catch (e) {
    console.warn('[EVS] DevExtreme:', e.message);
  }

  // dxMenu 사용 — waitForDevExtreme 이후에 초기화해야 $.fn.dxMenu 보장
  renderGnb((route) => navigate(route));

  await startRouter();
}

boot();
