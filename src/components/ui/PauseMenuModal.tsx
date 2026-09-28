/**
 * Pause Menu Modal [ESC]
 * System settings, controls recap, Google Sheets sync, sound toggles, and logout.
 */

import React, { useState } from 'react';
import { 
  Play, Volume2, VolumeX, Music, RefreshCw, LogOut, 
  Keyboard, ShieldCheck, GraduationCap, X
} from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { audioService } from '../../services/audioService';

interface PauseMenuModalProps {
  player: PlayerProfile;
  onResume: () => void;
  onLogout: () => void;
  onRetrySync: () => void;
  isOffline: boolean;
  pendingSyncCount: number;
}

export const PauseMenuModal: React.FC<PauseMenuModalProps> = ({
  player,
  onResume,
  onLogout,
  onRetrySync,
  isOffline,
  pendingSyncCount
}) => {
  const [sfxOn, setSfxOn] = useState(audioService.isSfxOn());
  const [bgmOn, setBgmOn] = useState(audioService.isBgmOn());
  const [sfxVolume, setSfxVolume] = useState(audioService.getSfxVolume());
  const [bgmVolume, setBgmVolume] = useState(audioService.getBgmVolume());
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggleSfx = () => {
    const val = audioService.toggleSfx();
    setSfxOn(val);
    if (val) audioService.playConfirm();
  };

  const handleToggleBgm = () => {
    const val = audioService.toggleBgm();
    setBgmOn(val);
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVolume(val);
    audioService.setSfxVolume(val);
    if (!sfxOn && val > 0) {
      setSfxOn(true);
      audioService.toggleSfx();
    }
  };

  const handleBgmVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBgmVolume(val);
    audioService.setBgmVolume(val);
    if (!bgmOn && val > 0) {
      setBgmOn(true);
      audioService.toggleBgm();
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    audioService.playConfirm();
    await onRetrySync();
    setIsSyncing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-md bg-[#0a0f24] border-2 border-slate-700/80 rounded-3xl p-6 text-white shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h3 className="font-cyber font-bold text-lg text-slate-100">
              PAUSE MENU // หยุดชั่วคราว
            </h3>
          </div>
          <button
            onClick={() => {
              audioService.playBlip(500);
              onResume();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player Profile Summary */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-200">{player.name}</div>
            <div className="text-xs text-slate-400 font-mono">
              ID: {player.studentId} • {player.className} • LV.{player.level}
            </div>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="mt-5 space-y-2.5">
          {/* Resume */}
          <button
            onClick={() => {
              audioService.playBlip(600);
              onResume();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-md shadow-cyan-500/25"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>กลับเข้าสู่เกม (Resume)</span>
          </button>

          {/* Audio Settings Panel */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-cyber text-slate-300">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-cyan-400" />
                <span>AUDIO SETTINGS // ตั้งค่าเสียง</span>
              </span>
            </div>

            {/* BGM Toggle & Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleToggleBgm}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    bgmOn ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>เพลง BGM: {bgmOn ? 'เปิด (ON)' : 'ปิด (OFF)'}</span>
                </button>
                <span className="text-[11px] font-mono text-slate-400">
                  {Math.round(bgmVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgmVolume}
                onChange={handleBgmVolumeChange}
                disabled={!bgmOn}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* SFX Toggle & Slider */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleToggleSfx}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    sfxOn ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {sfxOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>เสียง SFX: {sfxOn ? 'เปิด (ON)' : 'ปิด (OFF)'}</span>
                </button>
                <span className="text-[11px] font-mono text-slate-400">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={handleSfxVolumeChange}
                disabled={!sfxOn}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
              />
            </div>
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>
              ซิงค์ข้อมูล Google Sheets ({isOffline ? `ออฟไลน์ - ค้างส่ง ${pendingSyncCount}` : 'เชื่อมต่อปกติ'})
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              audioService.playBlip(500);
              onLogout();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-xs text-red-300 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>สลับบัญชีผู้เล่น / ออกจากระบบ</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
          WEB CITY: CODE QUEST • Phase 1
        </div>
      </div>
    </div>
  );
};
