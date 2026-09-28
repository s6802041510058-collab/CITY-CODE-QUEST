/**
 * Quest Log Modal [Q]
 * Displays active missions, objectives breakdown, completed missions, and future unlocked areas.
 */

import React from 'react';
import { Scroll, CheckCircle2, Circle, Star, Key, Award, Lock, Sparkles } from 'lucide-react';
import { Quest } from '../../types/game';
import { audioService } from '../../services/audioService';

interface QuestLogModalProps {
  quests: Quest[];
  onClose: () => void;
}

export const QuestLogModal: React.FC<QuestLogModalProps> = ({ quests, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="w-full max-w-2xl bg-[#0a0f24] border-2 border-purple-500/50 rounded-3xl p-6 text-white shadow-2xl shadow-purple-950/50 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-lg text-purple-300">
                QUEST LOG // สมุดบันทึกภารกิจ
              </h3>
              <p className="text-xs text-slate-400">เป้าหมายการเรียนรู้และภารกิจการสร้างเว็บไซต์</p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playBlip(500);
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quests List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {quests.map((quest) => {
            const isCompleted = quest.state === 'Completed';
            const isActive = quest.state === 'InProgress' || quest.state === 'Accepted';
            const isNotStarted = quest.state === 'NotStarted';

            return (
              <div 
                key={quest.questId}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted 
                    ? 'bg-emerald-950/20 border-emerald-500/40' 
                    : isActive 
                    ? 'bg-slate-900/90 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                }`}
              >
                {/* Title & Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-cyber px-2 py-0.5 rounded font-bold ${
                      isCompleted 
                        ? 'bg-emerald-900/80 text-emerald-300' 
                        : isActive 
                        ? 'bg-cyan-900/80 text-cyan-300 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {quest.questId}
                    </span>
                    <h4 className="font-semibold text-sm text-slate-100">{quest.questName}</h4>
                  </div>

                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : isActive 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isCompleted ? '✓ สำเร็จแล้ว' : isActive ? 'กำลังดำเนินภารกิจ' : 'ยังไม่ได้เริ่ม'}
                  </span>
                </div>

                {/* Objective Description */}
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {quest.objective}
                </p>

                {/* Sub-objectives */}
                {quest.objectivesList.length > 0 && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 mb-3 text-xs">
                    {quest.objectivesList.map((obj) => (
                      <div key={obj.id} className="flex items-center gap-2 text-[11px]">
                        {obj.isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        )}
                        <span className={obj.isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {obj.description}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rewards Footer */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                  <span>รางวัลเมื่อสำเร็จ:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400">+{quest.rewardXP} XP</span>
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      +{quest.rewardStar}
                    </span>
                    {quest.rewardKey && (
                      <span className="text-purple-300 flex items-center gap-0.5">
                        <Key className="w-3 h-3" />
                        {quest.rewardKey}
                      </span>
                    )}
                    {quest.rewardBadge && (
                      <span className="text-emerald-300 flex items-center gap-0.5">
                        <Award className="w-3 h-3" />
                        {quest.rewardBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              audioService.playBlip(550);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            ปิดสมุดเควสต์ [Q]
          </button>
        </div>
      </div>
    </div>
  );
};
