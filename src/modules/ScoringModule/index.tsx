import React, { useState } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  MoreHorizontal,
  MessageSquare,
  Tag,
  Activity,
  FileText,
  User
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

export const ScoringModule: React.FC = () => {
  const [status, setStatus] = useState<'connected' | 'missed'>('connected');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const radarData = [
    { subject: '语速', A: 85 },
    { subject: '礼貌', A: 95 },
    { subject: '准确性', A: 70 },
    { subject: '情绪', A: 90 },
    { subject: '解决率', A: 80 },
  ];

  const transcript = [
    { role: 'ai', text: '您好，这里是XX客服，请问有什么可以帮您？', time: '00:02', tags: ['标准问候'] },
    { role: 'customer', text: '我想咨询一下关于上个月账单的问题，感觉扣费不太对。', time: '00:08' },
    { role: 'ai', text: '好的，请您提供一下您的手机号码，我为您查询一下。', time: '00:12', tags: ['身份核验'] },
    { role: 'customer', text: '13800138000，姓王。', time: '00:15' },
    { role: 'ai', text: '王先生您好，查询到您上个月有一笔增值业务扣费，可能是您之前误触订购的。', time: '00:25', tags: ['业务解释'] },
  ];

  const handleCopy = () => {
    const text = transcript.map(t => `[${t.time}] ${t.role === 'ai' ? 'AI' : '客户'}: ${t.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setStatus('connected')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all",
              status === 'connected' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Phone className="w-4 h-4" />
            已接通
          </button>
          <button 
            onClick={() => setStatus('missed')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all",
              status === 'missed' ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <PhoneOff className="w-4 h-4" />
            未接通
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {status === 'missed' ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-4 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
            <PhoneOff className="w-10 h-10" />
          </div>
          <p className="text-lg font-medium">暂无接通记录，请检查外呼状态</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* 左侧对话流 */}
          <div className="xl:col-span-7 flex flex-col h-[75vh] bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                对话详情
              </h3>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制全文'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
              {transcript.map((item, idx) => (
                <div key={idx} className={cn("flex flex-col", item.role === 'ai' ? "items-start" : "items-end")}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-3xl relative group",
                    item.role === 'ai' 
                      ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none" 
                      : "bg-blue-600 text-white rounded-tr-none"
                  )}>
                    <p className="text-sm leading-relaxed">{item.text}</p>
                    {item.tags && (
                      <div className="flex gap-2 mt-3">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className={cn(
                      "absolute -bottom-6 text-[10px] font-bold text-slate-400",
                      item.role === 'ai' ? "left-0" : "right-0"
                    )}>
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-900 text-white">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all shrink-0 shadow-lg shadow-blue-600/40"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
                </button>
                <div className="flex-1 space-y-2">
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/3" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>00:45</span>
                    <span>02:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧 Bento 卡片 */}
          <div className="xl:col-span-5 grid grid-cols-2 gap-6">
            <div className="col-span-2 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4" />
                综合诊断
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                    <Radar dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex flex-col justify-between">
              <Tag className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-3xl font-black text-blue-700">88</p>
                <p className="text-xs font-bold text-blue-600/60 uppercase mt-1">综合评分</p>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 flex flex-col justify-between">
              <Activity className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-3xl font-black text-emerald-700">A+</p>
                <p className="text-xs font-bold text-emerald-600/60 uppercase mt-1">质检等级</p>
              </div>
            </div>

            <div className="col-span-2 bg-slate-900 p-8 rounded-[32px] text-white space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" />
                AI 诊断结论
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                “该通通话整体表现优秀。坐席在身份核验环节非常严谨，业务解释清晰易懂。但在通话结束前未主动询问是否有其他需求，建议在后续培训中加强收尾话术的规范性。”
              </p>
              <div className="pt-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-400">质检员：AI 智能助手</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
