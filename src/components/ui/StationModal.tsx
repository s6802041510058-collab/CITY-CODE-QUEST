/**
 * Station Modal - Interactive Learning & Inspection
 * Displays educational topic, real-world examples, and knowledge-check quiz.
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Sparkles, BookOpen, HelpCircle, 
  ArrowRight, Award, Lock, Unlock, ShieldAlert
} from 'lucide-react';
import { InteractiveStation, Quest } from '../../types/game';
import { audioService } from '../../services/audioService';

interface StationModalProps {
  station: InteractiveStation | null;
  isGate?: boolean;
  isGateUnlocked: boolean;
  onAnswerCorrect: (stationId: string) => void;
  onClose: () => void;
}

export const StationModal: React.FC<StationModalProps> = ({
  station,
  isGate = false,
  isGateUnlocked,
  onAnswerCorrect,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // If this is the gate
  if (isGate) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in pointer-events-auto">
        <div className="w-full max-w-lg bg-[#0a0f24] border-2 border-red-500/50 rounded-3xl p-6 text-white shadow-2xl shadow-red-950/40">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isGateUnlocked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              {isGateUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-cyber font-bold text-lg text-white">
                NETWORK GATEWAY [AREA 2]
              </h3>
              <p className="text-xs text-slate-400">ประตูด่านความปลอดภัยเชื่อมสู่เขตส่งผ่านข้อมูล</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm space-y-3 leading-relaxed">
            {isGateUnlocked ? (
              <div className="text-emerald-300">
                <p className="font-semibold text-base mb-1">🎉 ประตูปลดล็อกแล้ว!</p>
                <p className="text-xs text-slate-300">
                  คุณมีกุญแจ <b>Web Key</b> และผ่านการสำรวจ Web Central ครบถ้วนแล้ว 
                  พร้อมเดินทางสู่ AREA 2: NETWORK GATEWAY ในลำดับถัดไป!
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-red-300 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>ประตูด่านยังถูกล็อก (Security Locked)</span>
                </p>
                <p className="text-xs text-slate-300">
                  เงื่อนไขการปลดล็อก:
                </p>
                <ul className="text-xs text-slate-400 list-disc list-inside mt-1 space-y-1">
                  <li>ทำภารกิจ <b>MISSION 01: Explore Web City</b> ให้สำเร็จ</li>
                  <li>สำรวจและตอบคำถามสถานีความรู้ทั้ง 5 แห่งใน Web Central</li>
                  <li>ได้รับกุญแจ <b>Web Key</b></li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              audioService.playBlip(550);
              onClose();
            }}
            className="mt-5 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    );
  }

  if (!station) return null;

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    audioService.playBlip(600);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    audioService.playConfirm();
    const correct = selectedOption === station.quizQuestion.correctIndex;
    setIsCorrect(correct);
    setHasAnswered(true);

    if (correct) {
      audioService.playSuccess();
      onAnswerCorrect(station.id);
    } else {
      audioService.playError();
    }
  };

  const handleRetry = () => {
    setHasAnswered(false);
    setSelectedOption(null);
    audioService.playBlip(500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="w-full max-w-xl bg-[#0a0f24] border-2 border-cyan-500/50 rounded-3xl p-6 text-white shadow-2xl shadow-cyan-950/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cyber px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                INSPECTION STATION
              </span>
              {station.discovered && (
                <span className="text-[10px] font-cyber px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>บันทึกความรู้แล้ว</span>
                </span>
              )}
            </div>
            <h3 className="font-cyber font-bold text-xl text-cyan-300 mt-1">
              {station.name}
            </h3>
            <p className="text-xs text-slate-400">{station.subtitle}</p>
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

        {/* Content Section: Educational Info */}
        <div className="mt-4 space-y-3">
          {/* Topic Banner */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-cyan-200">{station.topic}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{station.description}</p>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {station.detailedInfo}
          </div>
        </div>

        {/* Knowledge Check Quiz */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h4 className="font-cyber font-semibold text-xs text-amber-300 tracking-wider">
              KNOWLEDGE CHECK // ตรวจสอบความเข้าใจ
            </h4>
          </div>

          <p className="text-xs text-slate-200 font-medium mb-3">
            {station.quizQuestion.question}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {station.quizQuestion.options.map((opt, idx) => {
              let optStyle = 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50 text-slate-300';

              if (hasAnswered) {
                if (idx === station.quizQuestion.correctIndex) {
                  optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-medium';
                } else if (idx === selectedOption) {
                  optStyle = 'bg-red-950/80 border-red-500 text-red-200';
                } else {
                  optStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                }
              } else if (selectedOption === idx) {
                optStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-medium';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${optStyle}`}
                >
                  <span>{opt}</span>
                  {hasAnswered && idx === station.quizQuestion.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {hasAnswered && idx === selectedOption && idx !== station.quizQuestion.correctIndex && (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Feedback */}
          {hasAnswered && (
            <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed ${
              isCorrect ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-red-950/60 border-red-500/50 text-red-200'
            }`}>
              <div className="font-semibold mb-0.5">
                {isCorrect ? '🎉 ยอดเยี่ยมมาก!' : '⚠️ ยังไม่ถูกต้อง ลองทบทวนดูอีกครั้ง'}
              </div>
              <div>{station.quizQuestion.explanation}</div>
            </div>
          )}

          {/* Footer Action */}
          <div className="mt-4 flex items-center justify-end gap-2">
            {!hasAnswered ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/30 transition cursor-pointer disabled:opacity-40"
              >
                ยืนยันคำตอบ
              </button>
            ) : isCorrect ? (
              <button
                onClick={() => {
                  audioService.playBlip(550);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-500/30 transition cursor-pointer"
              >
                บันทึกความคืบหน้าและปิด
              </button>
            ) : (
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition cursor-pointer"
              >
                ลองตอบใหม่อีกครั้ง
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
