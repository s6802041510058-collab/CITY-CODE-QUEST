/**
 * Celebration Modal
 * Confetti fanfare and reward summary on mission completion or badge unlock.
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Star, Key, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface CelebrationModalProps {
  title: string;
  subtitle: string;
  xpEarned: number;
  starsEarned: number;
  keyEarned?: string;
  badgeEarned?: string;
  unlockedAreaName?: string;
  onContinue: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  title,
  subtitle,
  xpEarned,
  starsEarned,
  keyEarned,
  badgeEarned,
  unlockedAreaName,
  onContinue
}) => {
  useEffect(() => {
    // Fire confetti bursts
    audioService.playFanfare();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      const timeoutId = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-md bg-[#0a0f24] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-amber-950/50 text-center relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-xl shadow-amber-500/40 mb-4 animate-bounce">
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-amber-400">
            <Award className="w-10 h-10" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-cyber font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400">
          {title}
        </h3>
        <p className="text-xs text-slate-300 mt-1 mb-6">{subtitle}</p>

        {/* Rewards Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 mb-6">
          <div className="text-[11px] font-cyber text-slate-400 tracking-wider">
            REWARDS RECEIVED // รางวัลที่ได้รับ
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-cyan-300">+{xpEarned} XP</div>
                <div className="text-[10px] text-slate-400">ค่าประสบการณ์</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-300">+{starsEarned} Star</div>
                <div className="text-[10px] text-slate-400">ดาวสะสม</div>
              </div>
            </div>
          </div>

          {keyEarned && (
            <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-center gap-2.5 text-left">
              <Key className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-cyan-200">ปลดล็อก: {keyEarned}</div>
                <div className="text-[10px] text-slate-300">กุญแจสำหรับเปิดประตูผ่านทาง</div>
              </div>
            </div>
          )}

          {badgeEarned && (
            <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/40 flex items-center gap-2.5 text-left">
              <Award className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-purple-200">ตราสัญลักษณ์: {badgeEarned}</div>
                <div className="text-[10px] text-slate-300">บันทึกลงในโปรไฟล์นักเรียน</div>
              </div>
            </div>
          )}

          {unlockedAreaName && (
            <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center gap-2.5 text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-200">เปิดพื้นที่ใหม่: {unlockedAreaName}</div>
                <div className="text-[10px] text-slate-300">สามารถเดินทางต่อไปยังด่านที่ 2 ได้แล้ว</div>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            audioService.playBlip(650);
            onContinue();
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>รับรางวัลและผจญภัยต่อ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
