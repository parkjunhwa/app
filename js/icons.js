/**
 * Lucide 아이콘 → SVG 문자열 (레이아웃 전용, DevForm 제외)
 * lucide.min.js는 window.lucide 로드 (ES module에서는 globalThis 사용)
 */
function getLucide() {
  return typeof globalThis !== 'undefined' ? globalThis.lucide : undefined;
}

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Lucide v0.5xx 노드: ['tag', attrs, children?] */
function renderIconNode(node) {
  if (!Array.isArray(node) || node.length < 2) return '';
  const [tag, attrs = {}, children] = node;
  let html = `<${tag}`;
  if (attrs && typeof attrs === 'object') {
    Object.keys(attrs).forEach((key) => {
      const val = attrs[key];
      if (val != null && val !== '') {
        html += ` ${key}="${String(val).replace(/"/g, '&quot;')}"`;
      }
    });
  }
  if (children && children.length) {
    html += '>';
    children.forEach((child) => {
      html += renderIconNode(child);
    });
    html += `</${tag}>`;
  } else {
    html += ' />';
  }
  return html;
}

/** 구버전 AST(경로 배열만) → svg 래핑 */
function legacyPathsToSvg(paths, size, color, className) {
  let svg = `<svg width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  if (className) svg += ` class="${className}"`;
  svg += '>';
  paths.forEach((element) => {
    if (Array.isArray(element) && element.length >= 2) {
      const [tag, attrs] = element;
      let elementStr = `<${tag}`;
      if (attrs && typeof attrs === 'object') {
        Object.keys(attrs).forEach((key) => {
          elementStr += ` ${key}="${attrs[key]}"`;
        });
      }
      elementStr += ' />';
      svg += elementStr;
    }
  });
  svg += '</svg>';
  return svg;
}

function resolveIconDef(iconName) {
  const lib = getLucide();
  if (!lib) return null;

  const pascal = toPascalCase(iconName);

  if (lib[pascal]) return lib[pascal];

  if (lib.icons) {
    return lib.icons[iconName] || lib.icons[pascal] || null;
  }

  return null;
}

export function createLucideIcon(iconName, size = 20, color = 'currentColor', className = '') {
  const iconDef = resolveIconDef(iconName);
  if (!iconDef) {
    console.warn(`Lucide 아이콘 "${iconName}"을 찾을 수 없습니다. (globalThis.lucide 로드 여부 확인)`);
    return '';
  }

  if (Array.isArray(iconDef) && iconDef[0] === 'svg') {
    const [, baseAttrs = {}, children] = iconDef;
    return renderIconNode([
      'svg',
      {
        ...baseAttrs,
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: baseAttrs.viewBox || '0 0 24 24',
        fill: 'none',
        stroke: color,
        'stroke-width': baseAttrs['stroke-width'] ?? 2,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        class: [className, baseAttrs.class].filter(Boolean).join(' ') || undefined,
      },
      children,
    ]);
  }

  /* v0.561: lucide.Home = [['path',…], …] */
  return legacyPathsToSvg(iconDef, size, color, className);
}

/** [data-lucide="home"] 형태 요소 치환 */
export function hydrateLucideIcons(root) {
  if (!root?.querySelectorAll) return;
  root.querySelectorAll('[data-lucide]').forEach((el) => {
    if (el.querySelector('svg')) return;
    const name = el.getAttribute('data-lucide');
    const size = Number(el.getAttribute('data-lucide-size')) || 22;
    if (name) {
      const svg = createLucideIcon(name, size);
      if (svg) el.innerHTML = svg;
    }
  });
}
