/**
 * Game HUD (Heads-Up Display)
 * Shows Player Profile, Level, XP, Stars, Keys, Active Mission, Sound controls, and GAS sync status.
 */

import React, { useState } from 'react';
import { 
  Star, Key, Award, Map, Scroll, Volume2, VolumeX, Music, RefreshCw, 
  ChevronDown, ChevronUp, CheckCircle, ShieldAlert, Sparkles, User
} from 'lucide-react';
import { PlayerProfile, Quest } from '../../types/game';
import { audioService } from '../../services/audioService';
import { GAME_CONFIG } from '../../config/gameConfig';

interface GameHudProps {
  player: PlayerProfile;
  currentQuest: Quest | null;
  onOpenWorldMap: () => void;
  onOpenQuestLog: () => void;
  onOpenMenu: () => void;
  isOffline: boolean;
  pendingSyncCount: number;
  onRetrySync: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  player,
  currentQuest,
  onOpenWorldMap,
  onOpenQuestLog,
  onOpenMenu,
  isOffline,
  pendingSyncCount,
  onRetrySync
}) => {
  const [isMissionExpanded, setIsMissionExpanded] = useState(true);
  const [sfxOn, setSfxOn] = useState(audioService.isSfxOn());
  const [bgmOn, setBgmOn] = useState(audioService.isBgmOn());
  const [isSyncing, setIsSyncing] = useState(false);

  // Level calculation
  const maxLevelXp = player.level * GAME_CONFIG.BASE_XP_PER_LEVEL;
  const currentLevelXp = player.xp % GAME_CONFIG.BASE_XP_PER_LEVEL;
  const xpPercentage = Math.min(100, Math.round((currentLevelXp / GAME_CONFIG.BASE_XP_PER_LEVEL) * 100));

  const handleToggleSfx = () => {
    const val = audioService.toggleSfx();
    setSfxOn(val);
    if (val) audioService.playBlip(700);
  };

  const handleToggleBgm = () => {
    const val = audioService.toggleBgm();
    setBgmOn(val);
  };

  const handleRetrySyncClick = async () => {
    setIsSyncing(true);
    audioService.playBlip(600);
    await onRetrySync();
    setIsSyncing(false);
  };

  // Keys count
  const keysCount = Object.values(player.keys).filter(Boolean).length;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-4">
      {/* Top Header Bar */}
      <div className="w-full flex items-start justify-between gap-3 pointer-events-auto">
        {/* Left: Player Profile Badge */}
        <div className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-[#0a0f24]/90 backdrop-blur-md border border-cyan-500/30 shadow-xl shadow-black/40">
          {/* Avatar Icon */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 p-0.5 shadow-md shadow-cyan-500/30">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-cyan-400 font-bold">
                <User className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-[10px] shadow-sm">
              LV.{player.level}
            </div>
          </div>

          {/* Details & XP Bar */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-cyber font-bold text-sm text-white tracking-wide">{player.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {player.className}
              </span>
            </div>

            {/* XP Bar */}
            <div className="mt-1 flex items-center gap-2">
              <div className="w-28 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500 shadow-sm shadow-cyan-400/50"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                {player.xp} XP
              </span>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
            {/* Stars */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span className="font-bold text-xs">{player.star}</span>
            </div>

            {/* Keys */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-xs">{keysCount}/6</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Controls & System Status */}
        <div className="flex items-center gap-2">
          {/* Offline / Sync Status Alert */}
          {isOffline && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs shadow-lg backdrop-blur-md">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="hidden md:inline">โหมดออฟไลน์</span>
              <button
                onClick={handleRetrySyncClick}
                disabled={isSyncing}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[10px] font-medium cursor-pointer transition ml-1"
                title="ลองบันทึกลง Google Sheets อีกครั้ง"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>ลองซิงค์ ({pendingSyncCount})</span>
              </button>
            </div>
          )}

          {/* Audio Controls */}
          <div className="flex items-center rounded-xl bg-[#0a0f24]/90 backdrop-blur-md border border-slate-700/60 p-1 shadow-md">
            <button
              onClick={handleToggleBgm}
              className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                bgmOn ? 'text-cyan-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
              }`}
              title={bgmOn ? 'ปิดเพลงประกอบ (BGM Off)' : 'เปิดเพลงประกอบ (BGM On)'}
            >
              <Music className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleSfx}
              className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                sfxOn ? 'text-cyan-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
              }`}
              title={sfxOn ? 'ปิดเสียงเอฟเฟกต์ (SFX Off)' : 'เปิดเสียงเอฟเฟกต์ (SFX On)'}
            >
              {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Map & Quest Buttons */}
          <button
            onClick={() => {
              audioService.playBlip(600);
              onOpenWorldMap();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a0f24]/90 hover:bg-slate-800 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs shadow-md transition cursor-pointer active:scale-95"
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline font-cyber">MAP [M]</span>
          </button>

          <button
            onClick={() => {
              audioService.playBlip(600);
              onOpenQuestLog();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a0f24]/90 hover:bg-slate-800 backdrop-blur-md border border-purple-500/40 text-purple-300 text-xs shadow-md transition cursor-pointer active:scale-95"
          >
            <Scroll className="w-4 h-4" />
            <span className="hidden sm:inline font-cyber">QUEST [Q]</span>
          </button>
        </div>
      </div>

      {/* Middle-Right: Active Quest Tracker Card */}
      {currentQuest && (
        <div className="self-end mt-3 pointer-events-auto max-w-xs sm:max-w-sm w-full">
          <div className="bg-[#0a0f24]/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-3.5 shadow-xl shadow-black/50 transition-all">
            {/* Header */}
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsMissionExpanded(!isMissionExpanded)}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-cyber font-bold text-xs text-cyan-400 tracking-wider">
                  CURRENT MISSION
                </span>
              </div>
              <button className="text-slate-400 hover:text-white">
                {isMissionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Body */}
            {isMissionExpanded && (
              <div className="mt-2 text-xs">
                <h4 className="font-semibold text-slate-100 text-sm mb-1">{currentQuest.questName}</h4>
                <p className="text-slate-400 text-xs mb-2 leading-relaxed">{currentQuest.objective}</p>

                {/* Checklist */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {currentQuest.objectivesList.map((obj) => (
                    <div key={obj.id} className="flex items-center gap-2 text-[11px]">
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${
                        obj.isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-600 border border-slate-700'
                      }`}>
                        {obj.isCompleted && <CheckCircle className="w-3 h-3 fill-emerald-400 text-slate-950" />}
                      </div>
                      <span className={obj.isCompleted ? 'text-slate-400 line-through' : 'text-slate-300'}>
                        {obj.description}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rewards preview */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>รางวัล:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300">+{currentQuest.rewardXP} XP</span>
                    <span className="text-amber-400">★ +{currentQuest.rewardStar}</span>
                    {currentQuest.rewardKey && (
                      <span className="text-purple-300">🔑 {currentQuest.rewardKey}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Bar: Action Hint Guide */}
      <div className="w-full flex items-end justify-between pointer-events-auto">
        {/* Controls Quick Hints */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400 shadow-md">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">W</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">S</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">D</kbd>
            <span className="ml-1 text-slate-300">เดิน</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">E</kbd>
            <span className="text-slate-300">สำรวจ/คุย</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[10px]">Space</kbd>
            <span className="text-slate-300">ยืนยัน</span>
          </div>
        </div>

        {/* Location Indicator */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-xs font-cyber flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold">AREA 1:</span>
          <span className="text-slate-200">WEB CENTRAL</span>
        </div>
      </div>
    </div>
  );
};
