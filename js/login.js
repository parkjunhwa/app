import { hideDxLicenseBanner, waitForDevExtreme } from './devextreme-init.js';

const AUTH_KEY = 'evs-auth';

function goHome() {
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

  bindLoginActions();

  try {
    await waitForDevExtreme();
    $('#loginUserId').dxTextBox({
      placeholder: '사번 또는 이메일',
      value: 'kim.woongjin',
    });
    $('#loginPassword').dxTextBox({
      mode: 'password',
      placeholder: '비밀번호',
      value: 'password',
    });
    $('#loginRemember').dxCheckBox({
      value: true,
      text: '아이디 저장',
    });
    hideDxLicenseBanner();
    requestAnimationFrame(hideDxLicenseBanner);
  } catch (e) {
    console.warn('[EVS] DevExtreme login inputs fallback:', e.message);
  }
}

boot();
