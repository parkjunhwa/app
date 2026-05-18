import { bindLucideIcons } from '../page-utils.js';
import { waitForDevExtreme } from '../devextreme-init.js';
import { createLucideIcon } from '../icons.js';

const MAX_RECEIPT_IMAGES = 8;
const ACCEPT_IMAGES = 'image/*';
const ACCEPT_DOCS = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.txt,.csv';
const ACCEPT_ATTACH = `${ACCEPT_IMAGES},${ACCEPT_DOCS}`;
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic|heif|bmp)$/i;

/** 추가정보 필드가 비어 있는지 판별 (null·undefined·공백 문자열) */
function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (value instanceof Date) return false;
  return false;
}

function isImageFile(file) {
  if (file.type?.startsWith('image/')) return true;
  return IMAGE_EXT.test(file.name);
}

function fileIconFor(file) {
  if (isImageFile(file)) return 'image';
  return 'file-text';
}

function bindFileRowCloseButtons(root) {
  root.querySelectorAll('.receipt-file-row__close').forEach((btn) => {
    btn.innerHTML = createLucideIcon('x', 18, 'var(--w-ink-4)');
  });
}

function bindImageCloseButtons(root) {
  root.querySelectorAll('.receipt-image-carousel__close').forEach((btn) => {
    btn.innerHTML = createLucideIcon('x', 14, '#fff');
  });
}

function openFilePicker({ accept, capture, multiple = true }) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    if (capture) input.setAttribute('capture', capture);
    if (multiple) input.multiple = true;
    input.style.cssText = 'position:fixed;left:-9999px;opacity:0';
    const done = (files) => {
      input.remove();
      resolve(files);
    };
    input.addEventListener('change', () => done(input.files?.length ? [...input.files] : []));
    document.body.appendChild(input);
    input.click();
  });
}

function searchField(selector, placeholder, onValueChanged, value) {
  return $(selector)
    .dxTextBox({
      placeholder,
      value,
      onValueChanged,
      buttons: [
        {
          name: 'search',
          location: 'after',
          options: {
            icon: 'search',
            type: 'normal',
            stylingMode: 'text',
            focusStateEnabled: false,
            hoverStateEnabled: false,
            activeStateEnabled: false,
          },
        },
      ],
    })
    .dxTextBox('instance');
}

function setupImageCarousel(root, { onAdd }) {
  const viewport = root.querySelector('#receiptImageViewport');
  const track = root.querySelector('#receiptImageTrack');
  const prevBtn = root.querySelector('#receiptImagePrev');
  const nextBtn = root.querySelector('#receiptImageNext');
  if (!viewport || !track || !prevBtn || !nextBtn) return () => {};

  let selectedIndex = 0;
  let scrollIndex = 0;

  const getSlides = () => [...track.querySelectorAll('.receipt-image-carousel__slide')];
  const getAddBtn = () => track.querySelector('.receipt-image-carousel__add');

  const getStep = () => {
    const slides = getSlides();
    if (!slides.length) return 80;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 8;
    return slides[0].offsetWidth + gap;
  };

  const getMaxScrollIndex = () => {
    const slides = getSlides();
    const addBtn = getAddBtn();
    const step = getStep();
    const itemCount = slides.length + (addBtn ? 1 : 0);
    const visibleCount = Math.max(1, Math.floor(viewport.clientWidth / step));
    return Math.max(0, itemCount - visibleCount);
  };

  const applyCarousel = () => {
    const slides = getSlides();
    if (!slides.length) {
      track.style.transform = 'translateX(0)';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    selectedIndex = Math.min(selectedIndex, slides.length - 1);
    const maxScroll = getMaxScrollIndex();
    scrollIndex = Math.max(0, Math.min(scrollIndex, maxScroll));
    track.style.transform = `translateX(-${scrollIndex * getStep()}px)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === selectedIndex);
    });
    prevBtn.disabled = scrollIndex <= 0;
    nextBtn.disabled = scrollIndex >= maxScroll;
  };

  const onPrev = () => {
    scrollIndex -= 1;
    if (selectedIndex > 0 && scrollIndex < selectedIndex) {
      selectedIndex -= 1;
    }
    applyCarousel();
  };

  const onNext = () => {
    const slides = getSlides();
    scrollIndex += 1;
    if (selectedIndex < slides.length - 1 && scrollIndex > selectedIndex) {
      selectedIndex += 1;
    }
    applyCarousel();
  };

  const onResize = () => applyCarousel();

  prevBtn.addEventListener('click', onPrev);
  nextBtn.addEventListener('click', onNext);
  window.addEventListener('resize', onResize);

  track.addEventListener('click', (e) => {
    if (e.target.closest('.receipt-image-carousel__close')) return;
    const slide = e.target.closest('.receipt-image-carousel__slide');
    if (slide) {
      const slides = getSlides();
      selectedIndex = slides.indexOf(slide);
      const maxScroll = getMaxScrollIndex();
      scrollIndex = Math.min(selectedIndex, maxScroll);
      applyCarousel();
      return;
    }
    if (e.target.closest('.receipt-image-carousel__add')) {
      onAdd?.();
    }
  });

  requestAnimationFrame(() => applyCarousel());

  return () => {
    prevBtn.removeEventListener('click', onPrev);
    nextBtn.removeEventListener('click', onNext);
    window.removeEventListener('resize', onResize);
  };
}

export function initPage(root) {
  bindLucideIcons(root);
  const widgets = [];
  let teardownCarousel = () => {};
  let postSaveFieldsReady = false;
  let addInfoWidgets = [];

  /** @type {{ id: number; name: string; url?: string }[]} */
  let receiptImages = [
    { id: 1001, name: '영수증_001.jpg' },
    { id: 1002, name: '영수증_002.jpg' },
  ];
  /** @type {{ id: number; name: string; icon: string }[]} */
  let receiptFiles = [
    { id: 2001, name: '영수증_20260511.pdf', icon: 'file-text' },
    { id: 2002, name: '카드매출전표_20260511.jpg', icon: 'image' },
    { id: 2003, name: '회의록_20260511.docx', icon: 'file-text' },
  ];

  const fabToggle = root.querySelector('#fabToggle');
  const fabMenu = root.querySelector('#fabMenu');
  const imageSection = root.querySelector('#receiptImageSection');
  const imageCountEl = root.querySelector('#receiptImageCount');
  const imageTrack = root.querySelector('#receiptImageTrack');
  const fileSection = root.querySelector('#receiptFileSection');
  const fileCountEl = root.querySelector('#receiptFileCount');
  const fileList = root.querySelector('#receiptFileList');
  const addInfo = root.querySelector('#receiptAddInfo');
  const addInfoActions = root.querySelector('#receiptAddInfoActions');
  const addInfoToggle = root.querySelector('#receiptAddInfoToggle');
  const fabAddInfo = root.querySelector('#fabAddInfo');
  const fabAttachFile = root.querySelector('#fabAttachFile');
  const fabCamera = root.querySelector('#fabCamera');

  const closeFab = () => {
    fabMenu?.classList.remove('is-open');
    fabToggle?.classList.remove('is-open');
    fabToggle?.setAttribute('aria-expanded', 'false');
    fabMenu?.setAttribute('aria-hidden', 'true');
  };

  const openFab = () => {
    fabMenu?.classList.add('is-open');
    fabToggle?.classList.add('is-open');
    fabToggle?.setAttribute('aria-expanded', 'true');
    fabMenu?.setAttribute('aria-hidden', 'false');
    bindLucideIcons(fabMenu);
  };

  const revokeImageUrl = (image) => {
    if (image?.url) URL.revokeObjectURL(image.url);
  };

  /** 추가정보: 하나라도 값이 있으면 true */
  const hasAddInfoValues = () => addInfoWidgets.some((w) => !isEmptyValue(w.option('value')));

  /**
   * 추가정보(#receiptAddInfo): 모든 필드가 null/비어 있으면 감춤(hidden).
   * 값이 하나라도 있으면 표시하고, 기본은 펼침(is-open). 토글로 접기 가능.
   */
  const updateAddInfoVisibility = () => {
    if (!addInfo || !addInfoActions) return;
    const hasValues = hasAddInfoValues();
    addInfo.hidden = !hasValues;
    addInfoActions.hidden = !hasValues;
    if (hasValues) {
      addInfo.classList.add('is-open');
    } else {
      addInfo.classList.remove('is-open');
    }
    bindLucideIcons(addInfo);
  };

  const onAddInfoFieldChange = () => {
    updateAddInfoVisibility();
  };

  const removeReceiptImage = (id) => {
    const index = receiptImages.findIndex((img) => img.id === id);
    if (index === -1) return;
    revokeImageUrl(receiptImages[index]);
    receiptImages.splice(index, 1);
    renderReceiptImages();
  };

  const removeReceiptFile = (id) => {
    receiptFiles = receiptFiles.filter((file) => file.id !== id);
    renderReceiptFiles();
  };

  /** 첨부 이미지(#receiptImageSection): 0장이면 감춤, 1장 이상이면 표시 (최대 8장, n/8) */
  const renderReceiptImages = () => {
    if (!imageSection || !imageTrack || !imageCountEl) return;

    const count = receiptImages.length;
    imageCountEl.textContent = String(count);
    imageSection.hidden = count === 0;

    imageTrack.innerHTML = '';
    receiptImages.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = `receipt-image-carousel__slide${index === 0 ? ' is-active' : ''}`;
      slide.dataset.id = String(image.id);
      slide.setAttribute('role', 'button');
      slide.tabIndex = 0;

      const badge = document.createElement('span');
      badge.className = 'receipt-image-carousel__badge';
      badge.textContent = String(index + 1);

      const thumb = document.createElement('span');
      thumb.className = 'receipt-image-carousel__thumb';
      thumb.setAttribute('aria-hidden', 'true');
      if (image.url) {
        thumb.classList.add('receipt-image-carousel__thumb--photo');
        thumb.style.backgroundImage = `url("${image.url}")`;
      }

      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'receipt-image-carousel__close';
      closeBtn.setAttribute('aria-label', '이미지 삭제');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeReceiptImage(image.id);
      });

      slide.append(badge, thumb, closeBtn);
      imageTrack.appendChild(slide);
    });

    if (count < MAX_RECEIPT_IMAGES) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'receipt-image-carousel__add';
      addBtn.setAttribute('aria-label', '이미지 추가');
      addBtn.innerHTML = '<span data-lucide="plus" data-lucide-size="28"></span>';
      imageTrack.appendChild(addBtn);
    }

    teardownCarousel();
    teardownCarousel = setupImageCarousel(root, { onAdd: pickAttachFiles });
    bindImageCloseButtons(root);
    bindLucideIcons(imageSection);
  };

  const addReceiptImageFromFile = (file) => {
    if (receiptImages.length >= MAX_RECEIPT_IMAGES) return false;
    receiptImages.push({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
    });
    return true;
  };

  const addReceiptFileFromFile = (file) => {
    receiptFiles.push({
      id: Date.now() + Math.random(),
      name: file.name,
      icon: fileIconFor(file),
    });
  };

  const processSelectedFiles = (files) => {
    if (!files.length) return;

    let imageSkipped = false;
    files.forEach((file) => {
      if (isImageFile(file)) {
        if (!addReceiptImageFromFile(file)) imageSkipped = true;
      } else {
        addReceiptFileFromFile(file);
      }
    });

    renderReceiptImages();
    renderReceiptFiles();

    if (imageSkipped) {
      alert(`첨부 이미지는 최대 ${MAX_RECEIPT_IMAGES}장까지 등록할 수 있습니다.`);
    }
  };

  const pickAttachFiles = async () => {
    const files = await openFilePicker({ accept: ACCEPT_ATTACH, multiple: true });
    processSelectedFiles(files);
  };

  const pickCameraPhoto = async () => {
    const files = await openFilePicker({ accept: ACCEPT_IMAGES, capture: 'environment', multiple: false });
    processSelectedFiles(files);
  };

  /** 첨부 파일(#receiptFileSection): 0개이면 감춤, 1개 이상이면 표시 */
  const renderReceiptFiles = () => {
    if (!fileSection || !fileList || !fileCountEl) return;

    const count = receiptFiles.length;
    fileCountEl.textContent = String(count);
    fileSection.hidden = count === 0;

    fileList.innerHTML = '';
    receiptFiles.forEach((file) => {
      const row = document.createElement('div');
      row.className = 'receipt-file-row';
      row.innerHTML = `
        <span data-lucide="${file.icon}" data-lucide-size="20"></span>
        <span class="receipt-file-row__name"></span>
        <button type="button" class="receipt-file-row__close" aria-label="첨부 삭제"></button>
      `;
      row.querySelector('.receipt-file-row__name').textContent = file.name;
      row.querySelector('.receipt-file-row__close').addEventListener('click', (e) => {
        e.stopPropagation();
        removeReceiptFile(file.id);
      });
      fileList.appendChild(row);
    });

    bindFileRowCloseButtons(root);
    bindLucideIcons(fileSection);
  };

  const initPostSaveFields = () => {
    if (postSaveFieldsReady) return;
    const change = onAddInfoFieldChange;
    const register = (instance) => {
      widgets.push(instance);
      addInfoWidgets.push(instance);
      return instance;
    };
    register(searchField('#dxVendor', '거래처 검색', change, '(주)샘플거래처'));
    register(searchField('#dxAsset', '자산 검색', change));
    register(searchField('#dxVehicle', '차량번호 검색', change, '12가3456'));
    register(
      $('#dxVehicleCost')
        .dxSelectBox({
          items: ['유류비', '통행료', '주차비'],
          placeholder: '비용유형 선택',
          onValueChanged: change,
        })
        .dxSelectBox('instance'),
    );
    register($('#dxDriverId').dxTextBox({ placeholder: '운전자 ID', onValueChanged: change }).dxTextBox('instance'));
    register($('#dxDriverName').dxTextBox({ placeholder: '운전자명', onValueChanged: change }).dxTextBox('instance'));
    register(
      $('#dxEntertainmentPlace')
        .dxTextBox({ placeholder: '사용처/장소', onValueChanged: change })
        .dxTextBox('instance'),
    );
    register(
      $('#dxEntertainmentAmount').dxTextBox({ placeholder: '금액', onValueChanged: change }).dxTextBox('instance'),
    );
    register(
      $('#dxEntertainmentCurrency')
        .dxSelectBox({
          items: ['KRW', 'USD', 'EUR'],
          placeholder: 'Sel...',
          onValueChanged: change,
        })
        .dxSelectBox('instance'),
    );
    postSaveFieldsReady = true;
    updateAddInfoVisibility();
  };

  const scrollToAddInfo = () => {
    const focusFirst = () => {
      addInfoWidgets[0]?.focus();
      addInfo?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    if (!postSaveFieldsReady) {
      waitForDevExtreme().then(() => {
        initPostSaveFields();
        focusFirst();
      });
      return;
    }
    focusFirst();
  };

  fabToggle?.addEventListener('click', () => {
    if (fabMenu?.classList.contains('is-open')) closeFab();
    else openFab();
  });

  addInfoToggle?.addEventListener('click', () => {
    if (addInfo?.hidden) return;
    addInfo.classList.toggle('is-open');
    bindLucideIcons(addInfo);
  });

  fabAddInfo?.addEventListener('click', () => {
    scrollToAddInfo();
    closeFab();
  });

  fabAttachFile?.addEventListener('click', () => {
    closeFab();
    pickAttachFiles();
  });

  fabCamera?.addEventListener('click', () => {
    closeFab();
    pickCameraPhoto();
  });

  root.querySelector('#receiptSaveAddInfo')?.addEventListener('click', () => {
    alert('추가정보 저장 (목업)');
  });

  renderReceiptImages();
  renderReceiptFiles();
  updateAddInfoVisibility();

  waitForDevExtreme().then(() => {
    widgets.push($('#dxMemo').dxTextBox({ placeholder: '비고를 입력하세요', value: '스타벅스 강남점' }).dxTextBox('instance'));
    widgets.push($('#dxAmount').dxTextBox({ value: '4,500' }).dxTextBox('instance'));
    widgets.push(
      $('#dxDate').dxDateBox({ value: new Date(2026, 4, 11), displayFormat: 'yyyy-MM-dd' }).dxDateBox('instance'),
    );
    widgets.push($('#dxPurpose').dxSelectBox({ items: ['식대', '교통비', '숙박비'], value: '식대' }).dxSelectBox('instance'));
    widgets.push(
      $('#dxCostCenter')
        .dxSelectBox({ items: ['마케팅팀 (1001)'], value: '마케팅팀 (1001)' })
        .dxSelectBox('instance'),
    );
    widgets.push(
      $('#dxBudgetCenter')
        .dxSelectBox({ items: ['마케팅 운영비 (A1001)'], value: '마케팅 운영비 (A1001)' })
        .dxSelectBox('instance'),
    );
    initPostSaveFields();
  });

  return () => {
    teardownCarousel();
    receiptImages.forEach(revokeImageUrl);
    widgets.forEach((w) => {
      try {
        w?.dispose();
      } catch (_) {
        /* ignore */
      }
    });
  };
}
