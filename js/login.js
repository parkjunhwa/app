import { hideDxLicenseBanner, waitForDevExtreme } from './devextreme-init.js';

const AUTH_KEY = 'evs-auth';
const REMEMBER_KEY = 'evs-remember-user-id';
const SAVED_USER_KEY = 'evs-saved-user-id';

function readRememberState() {
  try {
    const remember = localStorage.getItem(REMEMBER_KEY) === '1';
    const userId = (localStorage.getItem(SAVED_USER_KEY) || '').trim();
    return { remember, userId };
  } catch {
    return { remember: false, userId: '' };
  }
}

function persistRememberState(remember, userId) {
  try {
    if (remember && userId) {
      localStorage.setItem(REMEMBER_KEY, '1');
      localStorage.setItem(SAVED_USER_KEY, userId);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(SAVED_USER_KEY);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

function goHome() {
  let userId = '';
  let remember = false;
  try {
    const uidInst = $('#loginUserId').dxTextBox('instance');
    if (uidInst) userId = String(uidInst.option('value') ?? '').trim();
  } catch {
    /* 위젯 미초기화 */
  }
  const rememberInput = document.getElementById('loginRememberInput');
  if (rememberInput) remember = rememberInput.checked;

  persistRememberState(remember, userId);

  sessionStorage.setItem(AUTH_KEY, '1');
  window.location.assign('index.html#/home');
}

function bindLoginActions() {
  const btn = document.getElementById('loginSubmit');
  btn?.addEventListener('click', goHome);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') goHome();
  });
}

async function boot() {
  if (sessionStorage.getItem(AUTH_KEY) === '1') {
    window.location.replace('index.html#/home');
    return;
  }

  const { remember: rememberPref, userId: savedUserId } = readRememberState();

  try {
    await waitForDevExtreme();
    $('#loginUserId').dxTextBox({
      placeholder: '사번 또는 이메일',
      value: rememberPref ? savedUserId : '',
    });
    $('#loginPassword').dxTextBox({
      mode: 'password',
      placeholder: '비밀번호',
      value: '',
    });
    const rememberInput = document.getElementById('loginRememberInput');
    if (rememberInput) rememberInput.checked = rememberPref;

    hideDxLicenseBanner();
    requestAnimationFrame(hideDxLicenseBanner);
  } catch (e) {
    console.warn('[EVS] DevExtreme login inputs fallback:', e.message);
  }

  bindLoginActions();
}

boot();
