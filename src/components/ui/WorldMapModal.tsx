/**
 * World Map Modal [M]
 * Displays Web City's complete architectural map hierarchy of 8 districts with unlock status.
 */

import React from 'react';
import { Map, Lock, Unlock, Star, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { INITIAL_AREAS } from '../../data/gameData';
import { AreaInfo, PlayerProfile } from '../../types/game';
import { audioService } from '../../services/audioService';

interface WorldMapModalProps {
  player: PlayerProfile;
  unlockedAreaIds: string[];
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  player,
  unlockedAreaIds,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="w-full max-w-3xl bg-[#0a0f24] border-2 border-cyan-500/50 rounded-3xl p-6 text-white shadow-2xl shadow-cyan-950/60 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-lg text-cyan-300">
                WEB CITY // WORLD MAP [M]
              </h3>
              <p className="text-xs text-slate-400">ผังโครงสร้าง 8 เขตความรู้การสร้างเว็บไซต์</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>ดาวสะสม: <b>{player.star}</b> ดวง</span>
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
        </div>

        {/* City Hierarchy Diagram Visual */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="relative p-6 rounded-2xl bg-[#050814] border border-slate-800/80 min-h-[460px] flex flex-col items-center justify-between">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

            {/* Connecting Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/30" strokeWidth="2">
              {/* Creator Tower down to Debug District & AI Lab */}
              <line x1="50%" y1="12%" x2="25%" y2="28%" />
              <line x1="50%" y1="12%" x2="75%" y2="28%" />
              {/* Debug to AI Lab horizontal link */}
              <line x1="25%" y1="28%" x2="75%" y2="28%" strokeDasharray="4 4" />
              {/* Debug down to Tag Arena */}
              <line x1="25%" y1="28%" x2="25%" y2="48%" />
              {/* AI Lab down to Structure Lab */}
              <line x1="75%" y1="28%" x2="75%" y2="48%" />
              {/* Tag Arena & Structure Lab to HTML Factory */}
              <line x1="25%" y1="48%" x2="50%" y2="64%" />
              <line x1="75%" y1="48%" x2="50%" y2="64%" />
              {/* Tag Arena to Structure Lab horizontal link */}
              <line x1="25%" y1="48%" x2="75%" y2="48%" strokeDasharray="4 4" />
              {/* HTML Factory down to Network Gateway */}
              <line x1="50%" y1="64%" x2="50%" y2="78%" />
              {/* Network Gateway down to Web Central */}
              <line x1="50%" y1="78%" x2="50%" y2="92%" />
            </svg>

            {/* LEVEL 5 (Top): CREATOR TOWER */}
            <AreaNode 
              area={INITIAL_AREAS[7]} 
              isUnlocked={unlockedAreaIds.includes(INITIAL_AREAS[7].id)} 
              isFinal={true} 
            />

            {/* LEVEL 4: DEBUG DISTRICT & AI LAB */}
            <div className="w-full flex items-center justify-around z-10">
              <AreaNode 
                area={INITIAL_AREAS[5]} 
                isUnlocked={unlockedAreaIds.includes(INITIAL_AREAS[5].id)} 
              />
              <AreaNode 
                area={INITIAL_AREAS[6]} 
                isUnlocked={unlockedAreaIds.includes(INITIAL_AREAS[6].id)} 
                isOptional={true} 
              />
            </div>

            {/* LEVEL 3: TAG ARENA & STRUCTURE LAB */}
            <div className="w-full flex items-center justify-around z-10">
              <AreaNode 
                area={INITIAL_AREAS[4]} 
                isUnlocked={unlockedAreaIds.includes(INITIAL_AREAS[4].id)} 
              />
              <AreaNode 
                area={INITIAL_AREAS[3]} 
                isUnlocked={unlockedAreaIds.includes(INITIAL_AREAS[3].id)} 
              />
            </div>

            {/* LEVEL 2: HTML FACTORY */}
            <AreaNode 
              area={INITIAL_AREAS[2]} 
              isUnlocked={unlockedAreaIds.includes(INITIAL_AREAS[2].id)} 
            />

            {/* LEVEL 1: NETWORK GATEWAY */}
            <AreaNode 
              area={INITIAL_AREAS[1]} 
              isUnlocked={unlockedAreaIds.includes(INITIAL_AREAS[1].id)} 
            />

            {/* LEVEL 0 (Bottom): WEB CENTRAL (START) */}
            <AreaNode 
              area={INITIAL_AREAS[0]} 
              isUnlocked={true} 
              isCurrent={true} 
            />
          </div>
        </div>

        {/* Legend Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>ตำแหน่งปัจจุบัน (Web Central)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>ปลดล็อกแล้ว</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span>ล็อก (ยังไม่ผ่านเกณฑ์)</span>
            </span>
          </div>

          <button
            onClick={() => {
              audioService.playBlip(550);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
          >
            ปิดแผนที่ [M]
          </button>
        </div>
      </div>
    </div>
  );
};

interface AreaNodeProps {
  area: AreaInfo;
  isUnlocked: boolean;
  isCurrent?: boolean;
  isFinal?: boolean;
  isOptional?: boolean;
}

const AreaNode: React.FC<AreaNodeProps> = ({ area, isUnlocked, isCurrent, isFinal, isOptional }) => {
  return (
    <div className={`relative z-10 px-4 py-2.5 rounded-xl border text-center transition-all ${
      isCurrent 
        ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-500/50' 
        : isUnlocked 
        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-950/40' 
        : 'bg-slate-900/80 border-slate-700/60 text-slate-400 opacity-75'
    }`}>
      {/* Status badge */}
      <div className="flex items-center justify-center gap-1 mb-0.5">
        {isCurrent ? (
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            CURRENT (START)
          </span>
        ) : isUnlocked ? (
          <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
            <Unlock className="w-3 h-3" />
            UNLOCKED
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-500" />
            {area.requiredStars ? `${area.requiredStars}★ REQUIRED` : 'LOCKED'}
          </span>
        )}
      </div>

      <div className="font-cyber font-bold text-xs sm:text-sm tracking-wide">
        {area.name}
      </div>
      <div className="text-[10px] text-slate-400">
        {area.thaiName}
      </div>

      {isFinal && (
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 block mt-1">
          FINAL MISSION // PORTFOLIO
        </span>
      )}
      {isOptional && (
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 block mt-1">
          SPECIAL AREA (10★)
        </span>
      )}
    </div>
  );
};
