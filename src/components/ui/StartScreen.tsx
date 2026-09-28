/**
 * Start Screen - Title & Introduction
 */

import React, { useState } from 'react';
import { Play, BookOpen, Sparkles, Compass, ShieldCheck, ArrowRight, Keyboard } from 'lucide-react';
import { GAME_CONFIG } from '../../config/gameConfig';
import { audioService } from '../../services/audioService';

interface StartScreenProps {
  onStart: () => void;
  onOpenLogin: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onOpenLogin }) => {
  const [showControlsModal, setShowControlsModal] = useState(false);

  const handleStartClick = () => {
    audioService.playConfirm();
    onOpenLogin();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-12 overflow-y-auto bg-[#050814] text-white">
      {/* Background Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[250px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Bar Header */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-cyan-500/30">
            W
          </div>
          <div>
            <span className="font-cyber font-bold tracking-wider text-cyan-400 text-sm">WEB CITY</span>
            <span className="text-xs text-slate-400 block -mt-1">ปวช.1 วิชาการสร้างเว็บไซต์</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioService.playBlip(600);
              setShowControlsModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>วิธีควบคุมเกม</span>
          </button>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="relative z-10 my-auto text-center max-w-3xl flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-medium mb-4 backdrop-blur-md shadow-sm shadow-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Educational Web Game Adventure</span>
        </div>

        {/* Title */}
        <h1 className="font-cyber text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
          WEB CITY
        </h1>
        <h2 className="font-cyber text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 tracking-widest uppercase mb-4">
          CODE QUEST
        </h2>

        {/* Tagline */}
        <p className="text-base sm:text-xl text-slate-300 font-light mb-8 max-w-xl">
          "{GAME_CONFIG.TAGLINE}"
        </p>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-8 max-w-lg leading-relaxed">
          รับบทบาทเป็น Junior Web Developer ออกสำรวจเมืองดิจิทัล ทำภารกิจ ไขปริศนาโครงสร้าง HTML 
          และปลดล็อกทั้ง 8 เขตความรู้ พร้อมระบบบันทึกความคืบหน้าผ่าน Google Sheets
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleStartClick}
            className="group relative flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Play className="w-5 h-5 fill-white" />
            <span className="font-semibold tracking-wide">เข้าสู่ระบบนักเรียน / เริ่มเล่น</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Key Features Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 w-full max-w-2xl text-left">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">2D World Map</div>
              <div className="text-[10px] text-slate-400">WASD เดินสำรวจ</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">HTML Quest</div>
              <div className="text-[10px] text-slate-400">ภารกิจตามหลักสูตร</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">BYTE AI Guide</div>
              <div className="text-[10px] text-slate-400">เพื่อนคู่คิดโค้ดดิ้ง</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Google Sheets</div>
              <div className="text-[10px] text-slate-400">บันทึกอัตโนมัติ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-900">
        <div>
          <span>{GAME_CONFIG.COURSE_NAME}</span>
          <span className="mx-2">•</span>
          <span>{GAME_CONFIG.VERSION}</span>
        </div>
        <div className="mt-2 sm:mt-0">
          <span>Explore → Mission → Reward → Unlock</span>
        </div>
      </div>

      {/* Controls Modal */}
      {showControlsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0a0f24] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-cyber font-bold text-lg text-cyan-400 flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                คู่มือการควบคุมเกม (Controls)
              </h3>
              <button
                onClick={() => setShowControlsModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">เดินทิศทาง (Move)</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">W</kbd>
                  <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">A</kbd>
                  <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">S</kbd>
                  <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">D</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">พูดคุย / ตรวจสอบ (Interact)</span>
                <kbd className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">E</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">ตกลง / ยืนยัน (Action/Confirm)</span>
                <kbd className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">Space</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">แผนที่เมือง (World Map)</span>
                <kbd className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">M</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">สมุดเควสต์ (Quest Log)</span>
                <kbd className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">Q</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">เมนูหยุดชั่วคราว (Pause Menu)</span>
                <kbd className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">ESC</kbd>
              </div>
            </div>

            <button
              onClick={() => setShowControlsModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition cursor-pointer"
            >
              เข้าใจแล้ว ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
