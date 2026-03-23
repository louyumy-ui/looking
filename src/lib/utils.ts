import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { elementToSVG } from 'dom-to-svg';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 核心黑魔法：将指定 DOM 转换为兼容 Figma 的 SVG 并写入剪贴板
 * @param targetId 需要导出的容器 ID (如 main 或 table)
 */
export const copyDomToFigmaSvg = async (targetId: string): Promise<boolean> => {
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return false;

  try {
    // 1. 深度克隆 DOM（不在原页面上操作，防止破坏 UI）
    const clone = targetElement.cloneNode(true) as HTMLElement;
    
    // 2. 黑魔法：同步真实的表单值（解决 input/select 导出为空白的问题）
    const originalInputs = targetElement.querySelectorAll('input, select, textarea');
    const clonedInputs = clone.querySelectorAll('input, select, textarea');
    
    originalInputs.forEach((orig, i) => {
      const cloned = clonedInputs[i] as HTMLElement;
      const original = orig as any;
      const style = window.getComputedStyle(original);
      
      // 创建一个伪装的 span 来替代实际的输入框
      const replacement = document.createElement('span');
      replacement.style.cssText = `
        display: inline-block;
        width: ${style.width};
        height: ${style.height};
        padding: ${style.padding};
        font-size: ${style.fontSize};
        font-family: ${style.fontFamily};
        color: ${style.color};
        line-height: ${style.lineHeight};
        vertical-align: middle;
      `;
      
      if (original.tagName === 'SELECT') {
        replacement.textContent = original.options[original.selectedIndex]?.text || '';
        // 伪装下拉小箭头
        const arrow = document.createElement('span');
        arrow.textContent = '▼';
        arrow.style.cssText = 'position: absolute; right: 8px; top: 50%; transform: translateY(-50%) scale(0.7); font-size: 10px; color: #999;';
        replacement.style.position = 'relative';
        replacement.appendChild(arrow);
      } else if (original.tagName === 'INPUT' && (original.type === 'checkbox' || original.type === 'radio')) {
        replacement.textContent = original.checked ? '✓' : '';
        replacement.style.textAlign = 'center';
      } else {
        replacement.textContent = original.value || original.placeholder || '';
      }
      
      if (cloned.parentNode) cloned.parentNode.replaceChild(replacement, cloned);
    });

    // 3. 将克隆体短暂放入页面以计算真实样式（但隐藏在视口外）
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.width = targetElement.offsetWidth + 'px';
    document.body.appendChild(clone);

    // 4. 使用第三方库或自定义转换器生成 SVG XML
    const svgDocument = elementToSVG(clone);
    document.body.removeChild(clone);

    // 5. 写入系统剪贴板（Figma 识别机制）
    const svgString = new XMLSerializer().serializeToString(svgDocument);
    await navigator.clipboard.writeText(svgString);
    
    return true;
  } catch (err) {
    console.error('Figma SVG 导出失败:', err);
    return false;
  }
};
