/**
 * Student Login Screen
 * Authenticates or creates student profile via Google Apps Script / Sheets.
 */

import React, { useState } from 'react';
import { User, GraduationCap, IdCard, LogIn, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { gasService } from '../../services/googleAppsScriptService';
import { audioService } from '../../services/audioService';

interface LoginScreenProps {
  onLoginSuccess: (profile: PlayerProfile) => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onBack }) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('ปวช. 1/1');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Quick fill preset
  const handleQuickPreset = (presetId: string, presetName: string, presetClass: string) => {
    setStudentId(presetId);
    setName(presetName);
    setClassName(presetClass);
    audioService.playBlip(700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !name.trim()) {
      setIsError(true);
      setStatusMessage('กรุณากรอกรหัสนักศึกษาและชื่อ-นามสกุลให้ครบถ้วน');
      audioService.playError();
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setStatusMessage('กำลังเชื่อมต่อฐานข้อมูล Google Apps Script...');
    audioService.playConfirm();

    try {
      // 1. Try to load existing player
      const loadRes = await gasService.loadPlayer(studentId);

      if (loadRes.success && loadRes.data) {
        // Player exists -> LOAD PLAYER
        setStatusMessage(`ยินดีต้อนรับกลับ คุณ ${loadRes.data.name}! กำลังเข้าสู่เมือง...`);
        audioService.playSuccess();
        setTimeout(() => {
          onLoginSuccess(loadRes.data!);
        }, 800);
        return;
      }

      // 2. Player doesn't exist -> CREATE PLAYER
      setStatusMessage('สร้างโปรไฟล์นักเรียนใหม่ลงในระบบ...');
      const createRes = await gasService.createPlayer(studentId, name, className);

      if (createRes.data) {
        setStatusMessage(`ลงทะเบียนสำเร็จ ยินดีต้อนรับสู่ Web City คุณ ${name}!`);
        audioService.playSuccess();
        setTimeout(() => {
          onLoginSuccess(createRes.data!);
        }, 800);
      } else {
        throw new Error(createRes.message || 'ไม่สามารถลงทะเบียนได้');
      }
    } catch (err: any) {
      console.warn('Login error:', err);
      // Fallback local creation
      const localProfile: PlayerProfile = {
        studentId: studentId.trim(),
        name: name.trim(),
        className: className.trim(),
        level: 1,
        xp: 0,
        star: 0,
        keys: {
          webKey: false,
          networkKey: false,
          htmlKey: false,
          structureKey: false,
          arenaKey: false,
          debugKey: false
        },
        currentMission: 'M01',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      gasService.cachePlayerLocally(localProfile);
      setStatusMessage('เชื่อมต่อเครือข่ายขัดข้อง เข้าสู่ระบบในโหมดออฟไลน์...');
      audioService.playSuccess();
      setTimeout(() => {
        onLoginSuccess(localProfile);
      }, 900);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#050814] text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#0a0f24]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50">
        {/* Back Button */}
        <button
          onClick={() => {
            audioService.playBlip(500);
            onBack();
          }}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 mb-6 transition cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าแรก</span>
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="font-cyber font-bold text-2xl text-white">เข้าสู่ระบบนักเรียน</h2>
          <p className="text-xs text-slate-400 mt-1">
            ระบุข้อมูลเพื่อบันทึกคะแนนและภารกิจลงใน Google Sheets
          </p>
        </div>

        {/* Status / Alert Message */}
        {statusMessage && (
          <div className={`mb-5 p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
            isError ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
          }`}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0 text-cyan-400" />
            ) : isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            ) : (
              <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student ID */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <IdCard className="w-3.5 h-3.5 text-cyan-400" />
              <span>รหัสนักศึกษา (Student ID)</span>
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="เช่น 6802041510058 หรือ ST001"
              disabled={isLoading}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition font-mono"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>ชื่อ - นามสกุล (Full Name)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น คาตะ ช่างคิด หรือ ธนากร ใจดี"
              disabled={isLoading}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>ระดับชั้น / ห้อง (Class)</span>
            </label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white transition cursor-pointer"
            >
              <option value="ปวช. 1/1">ปวช. 1/1 (แผนกคอมพิวเตอร์ธุรกิจ)</option>
              <option value="ปวช. 1/2">ปวช. 1/2 (แผนกเทคโนโลยีสารสนเทศ)</option>
              <option value="ปวช. 1/3">ปวช. 1/3 (แผนกคอมพิวเตอร์กราฟิก)</option>
              <option value="ปวช. 1/ทั่วไป">ปวช. 1 (ทั่วไป)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังประมวลผล...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ Web City</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Test Accounts Presets */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>บัญชีทดสอบด่วน (Click to use preset):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('6802041510058', 'KATA Developer', 'ปวช. 1/1')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-cyan-300 font-mono transition cursor-pointer"
            >
              6802041510058 (KATA)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('ST001', 'กิตติศักดิ์ โค้ดเก่ง', 'ปวช. 1/1')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300 font-mono transition cursor-pointer"
            >
              ST001 (กิตติศักดิ์)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('TEST-GUEST', 'Junior Coder', 'ปวช. 1/2')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-400 font-mono transition cursor-pointer"
            >
              TEST-GUEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
