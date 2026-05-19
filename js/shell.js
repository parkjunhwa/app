import { createLucideIcon } from './icons.js';

const GNB_ITEMS = [
  { key: 'home',    label: '홈',    icon: 'home',      route: '#/home' },
  { key: 'expense', label: '경비',  icon: 'wallet',    route: '#/expense/inbox' },
  { key: 'report',  label: '보고서', icon: 'file-text', route: '#/report' },
  { key: 'approve', label: '승인',  icon: 'user',      route: '#/approve' },
];

let onLogout = () => {};

export function setShellCallbacks(callbacks) {
  if (callbacks.logout) onLogout = callbacks.logout;
}

/** 라우터가 화면 전환 후 호출 — data-gnb-key 일치 항목에 active 클래스 적용 */
export function setGnbActive(key) {
  document.querySelectorAll('#app-gnb .evs-gnb-item').forEach((item) => {
    const isActive = item.dataset.gnbKey === key;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-current', isActive ? 'page' : 'false');
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

/**
 * 하단 GNB를 dxMenu로 렌더링합니다.
 * — waitForDevExtreme() 이후에 호출해야 합니다.
 * — 아이콘·레이블은 itemTemplate 으로 커스터마이즈하고,
 *   active 상태는 setGnbActive() 에서 CSS 클래스로 관리합니다.
 */
export function renderGnb(onNavigate) {
  const el = document.getElementById('app-gnb');
  if (!el || typeof $ === 'undefined' || !$.fn?.dxMenu) return;

  $(el).dxMenu({
    dataSource: GNB_ITEMS,
    displayExpr: 'label',
    orientation: 'horizontal',
    hideSubmenuOnMouseLeave: true,

    itemTemplate(data) {
      const iconHtml = createLucideIcon(data.icon, 24, 'currentColor', 'evs-gnb-item__icon');
      const $item = $('<div>')
        .addClass('evs-gnb-item')
        .attr({ 'data-gnb-key': data.key, 'aria-current': 'false' });

      if (iconHtml) $item.append($(iconHtml));
      $item.append($('<span>').text(data.label));
      return $item;
    },

    onItemClick(e) {
      if (e.itemData?.route) onNavigate(e.itemData.route);
    },
  });
}
