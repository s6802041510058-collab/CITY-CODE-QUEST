/**
 * Mini Map Component
 * Displays real-time tactical overview of Web Central, showing player, NPC, and station positions.
 */

import React, { useState } from 'react';
import { Compass, Maximize2, Minimize2 } from 'lucide-react';
import { WEB_CENTRAL_STATIONS } from '../../data/gameData';

interface MiniMapProps {
  playerPos: { x: number; y: number; mapWidth: number; mapHeight: number };
}

export const MiniMap: React.FC<MiniMapProps> = ({ playerPos }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Map coordinate transformation
  const width = isExpanded ? 240 : 130;
  const height = isExpanded ? 210 : 115;

  const mapW = playerPos.mapWidth || 1600;
  const mapH = playerPos.mapHeight || 1400;

  // Convert game world coords to mini-map pixel coords
  const toMiniX = (worldX: number) => (worldX / mapW) * width;
  const toMiniY = (worldY: number) => (worldY / mapH) * height;

  const pX = toMiniX(playerPos.x);
  const pY = toMiniY(playerPos.y);

  // BYTE position
  const byteX = toMiniX(780);
  const byteY = toMiniY(620);

  // Gateway Gate position
  const gateX = toMiniX(780);
  const gateY = toMiniY(160);

  return (
    <div className="absolute bottom-12 left-4 z-20 pointer-events-auto select-none">
      <div className="relative rounded-2xl overflow-hidden bg-[#0a0f24]/90 backdrop-blur-md border border-cyan-500/40 shadow-xl shadow-black/50 transition-all duration-300">
        {/* Header bar */}
        <div className="px-2.5 py-1 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1 text-cyan-400 font-cyber font-semibold">
            <Compass className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>RADAR</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white transition"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>

        {/* Radar Screen */}
        <div 
          className="relative bg-[#050814] overflow-hidden"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />

          {/* Central Plaza boundaries */}
          <div 
            className="absolute rounded-lg border border-cyan-500/20 bg-cyan-950/10 pointer-events-none"
            style={{
              left: `${toMiniX(350)}px`,
              top: `${toMiniY(280)}px`,
              width: `${toMiniX(900)}px`,
              height: `${toMiniY(900)}px`
            }}
          />

          {/* Network Gateway Exit */}
          <div 
            className="absolute w-3.5 h-1.5 -translate-x-1/2 -translate-y-1/2 bg-red-500/80 rounded-sm border border-red-400"
            style={{ left: `${gateX}px`, top: `${gateY}px` }}
            title="Gateway Gate"
          />

          {/* Stations pins */}
          {WEB_CENTRAL_STATIONS.map((station) => {
            const sX = toMiniX(station.x);
            const sY = toMiniY(station.y);
            return (
              <div
                key={station.id}
                className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80"
                style={{ left: `${sX}px`, top: `${sY}px` }}
                title={station.name}
              />
            );
          })}

          {/* BYTE NPC pin */}
          <div 
            className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 bg-sky-300 rotate-45 border border-white shadow-sm shadow-sky-400/80 animate-pulse"
            style={{ left: `${byteX}px`, top: `${byteY}px` }}
            title="BYTE (AI Guide)"
          />

          {/* Player Beacon */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-75"
            style={{ left: `${pX}px`, top: `${pY}px` }}
          >
            {/* Radar ripple */}
            <div className="absolute w-5 h-5 rounded-full bg-cyan-400/30 animate-ping" />
            {/* Player dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-md shadow-emerald-400" />
          </div>
        </div>

        {/* Legend */}
        {isExpanded && (
          <div className="p-2 bg-slate-950/90 border-t border-slate-800 text-[9px] text-slate-400 grid grid-cols-2 gap-1 font-cyber">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ผู้เล่น (YOU)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-sky-300 rotate-45" />
              <span>BYTE (AI)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>สถานีความรู้</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-1 bg-red-500" />
              <span>ประตูด่าน</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
