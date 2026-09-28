/**
 * Dialogue Modal - Interaction with NPC BYTE
 * Features animated typing, voice chirps, character avatar, choices, and quest dispatch.
 */

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { PlayerProfile, Quest } from '../../types/game';
import { audioService } from '../../services/audioService';

interface DialogueModalProps {
  player: PlayerProfile;
  quest: Quest | null;
  onAcceptQuest: (questId: string) => void;
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  player,
  quest,
  onAcceptQuest,
  onClose
}) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Scripted dialogue sequence
  const isQuestAccepted = quest && quest.state !== 'NotStarted';

  const script = isQuestAccepted
    ? [
        {
          speaker: 'BYTE',
          role: 'AI Learning Companion',
          text: `สวัสดีอีกครั้ง คุณ ${player.name}! ตอนนี้คุณกำลังทำภารกิจ "${quest?.questName}" อยู่`,
        },
        {
          speaker: 'BYTE',
          role: 'AI Learning Companion',
          text: `เดินสำรวจและกด [E] ตรวจสอบสถานีความรู้ทั้ง 5 แห่งรอบพลาซ่า ได้แก่:\n1. Browser Station\n2. Web Server\n3. Web Page\n4. Homepage (index.html)\n5. URL Board\n\nเมื่อตอบคำถามครบทุกสถานี ประตูสู่ Network Gateway จะปลดล็อกทันที!`,
        }
      ]
    : [
        {
          speaker: 'BYTE',
          role: 'AI Learning Companion',
          text: `สวัสดีครับคุณ ${player.name} จากห้อง ${player.className}! ผมคือ BYTE เป็น AI ประจำเมือง Web City ยินดีต้อนรับสู่โลกดิจิทัล!`,
        },
        {
          speaker: 'BYTE',
          role: 'AI Learning Companion',
          text: `ในฐานะ Junior Web Developer ภารกิจแรกของคุณคือเรียนรู้โครงสร้างพื้นฐานของระบบเว็บไซต์ ก่อนที่เราจะออกเดินทางสู่ด่านต่อๆ ไปอย่าง Network Gateway และ HTML Factory`,
        },
        {
          speaker: 'BYTE',
          role: 'AI Learning Companion',
          text: `ผมได้เตรียมภารกิจ "${quest?.questName}" ไว้ให้แล้ว! คุณต้องเดินสำรวจสถานีความรู้ทั้ง 5 แห่งใน Web Central ตอบคำถามสั้นๆ เพื่อรับ 300 XP, 1 Star และกุญแจ Web Key พร้อมปลดล็อกพื้นที่ใหม่!`,
        }
      ];

  const currentDialogue = script[dialogueIndex] || script[0];

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setIsTyping(true);
    setDisplayedText('');

    const interval = setInterval(() => {
      if (index < currentDialogue.text.length) {
        setDisplayedText(currentDialogue.text.slice(0, index + 1));
        if (index % 3 === 0) {
          audioService.playVoiceChirp(460);
        }
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [dialogueIndex, currentDialogue.text]);

  const handleNext = () => {
    if (isTyping) {
      // Instant reveal
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      return;
    }

    if (dialogueIndex < script.length - 1) {
      audioService.playBlip(650);
      setDialogueIndex(dialogueIndex + 1);
    } else {
      // End of dialogue
      if (!isQuestAccepted && quest) {
        audioService.playSuccess();
        onAcceptQuest(quest.questId);
      } else {
        audioService.playBlip(550);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="w-full max-w-2xl bg-[#0a0f24]/95 border-2 border-cyan-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-950/80 text-white relative">
        {/* Hologram Corner Accents */}
        <div className="absolute top-2 left-3 text-[10px] font-cyber text-cyan-400/80 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
          <span>BYTE AI PROTOCOL // ONLINE</span>
        </div>

        {/* Content Layout */}
        <div className="flex items-start gap-4 mt-3">
          {/* BYTE Animated Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 p-0.5 shadow-xl shadow-cyan-500/40">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
                {/* Circuit lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
                <Bot className="w-9 h-9 sm:w-11 sm:h-11 text-cyan-300 animate-bounce" style={{ animationDuration: '2.5s' }} />
              </div>
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>

          {/* Dialogue Body */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-cyber font-bold text-base text-cyan-300">{currentDialogue.speaker}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                {currentDialogue.role}
              </span>
            </div>

            {/* Message with white-space preservation */}
            <div className="text-sm sm:text-base text-slate-200 leading-relaxed min-h-[70px] whitespace-pre-line font-light">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <span>กด</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">Space</kbd>
            <span>หรือคลิก เพื่อดำเนินการต่อ</span>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/30 transition cursor-pointer active:scale-95"
          >
            {dialogueIndex < script.length - 1 ? (
              <>
                <span>ต่อไป</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : !isQuestAccepted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>รับเควสต์ (Accept Quest)</span>
              </>
            ) : (
              <>
                <span>เข้าใจแล้ว ปิดหน้าต่าง</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
