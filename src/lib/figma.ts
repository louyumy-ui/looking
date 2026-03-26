import { elementToSVG } from 'dom-to-svg';

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
    
    // 2. 修正表单实时状态（dom-to-svg 默认不抓取 input/select 的当前值）
    const originalInputs = targetElement.querySelectorAll('input, select, textarea');
    const clonedInputs = clone.querySelectorAll('input, select, textarea');
    
    originalInputs.forEach((el, index) => {
      const clonedEl = clonedInputs[index] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        clonedEl.setAttribute('value', (el as HTMLInputElement).value);
      } else if (el instanceof HTMLSelectElement) {
        // Select 需要手动标记选中项
        const selectedOption = el.options[el.selectedIndex];
        if (selectedOption) {
          const clonedOptions = (clonedEl as HTMLSelectElement).options;
          for (let i = 0; i < clonedOptions.length; i++) {
            if (clonedOptions[i].value === selectedOption.value) {
              clonedOptions[i].setAttribute('selected', 'selected');
            }
          }
        }
      }
    });

    // 3. 规范化图层名称（Figma 识别机制，使用中文）
    clone.querySelectorAll('*').forEach(el => {
      const element = el as HTMLElement;
      const figmaName = element.getAttribute('data-figma-name') || 
                       element.id || 
                       (element.tagName === 'H2' || element.tagName === 'H3' ? `标题: ${element.textContent?.trim()}` : '') ||
                       (element.classList.contains('bg-white') ? '卡片容器' : '');
      if (figmaName) {
        element.setAttribute('data-name', figmaName);
      }
    });

    // 4. 转换 SVG
    const svgDocument = elementToSVG(clone);
    const svgString = new XMLSerializer().serializeToString(svgDocument);

    // 5. 写入剪贴板
    await navigator.clipboard.writeText(svgString);
    return true;
  } catch (error) {
    console.error('Figma Export Error:', error);
    return false;
  }
};
