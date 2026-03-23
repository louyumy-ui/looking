import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn, copyDomToFigmaSvg } from '@/src/lib/utils';

interface SvgCopyButtonProps {
  targetId: string;
  className?: string;
}

/**
 * 核心资产保护协议：严禁修改此组件底层的导出逻辑。
 * 此组件使用 copyDomToFigmaSvg 黑魔法将 DOM 完美转换为可编辑 Figma SVG。
 */
export const SvgCopyButton: React.FC<SvgCopyButtonProps> = ({ targetId, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyDomToFigmaSvg(targetId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all rounded-lg",
        "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-slate-700 dark:text-slate-200",
        copied ? "text-emerald-500 border-emerald-500/50" : "",
        className
      )}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? '已复制' : '复制 SVG'}</span>
    </button>
  );
};
