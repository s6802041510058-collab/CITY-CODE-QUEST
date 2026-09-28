/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { StartScreen } from './components/ui/StartScreen';
import { LoginScreen } from './components/ui/LoginScreen';
import { PhaserCanvas } from './components/game/PhaserCanvas';
import { GameHud } from './components/ui/GameHud';
import { MiniMap } from './components/ui/MiniMap';
import { DialogueModal } from './components/ui/DialogueModal';
import { StationModal } from './components/ui/StationModal';
import { QuestLogModal } from './components/ui/QuestLogModal';
import { WorldMapModal } from './components/ui/WorldMapModal';
import { PauseMenuModal } from './components/ui/PauseMenuModal';
import { CelebrationModal } from './components/ui/CelebrationModal';

import { gameEvents, GAME_EVENTS } from './game/GameEvents';
import { gasService } from './services/googleAppsScriptService';
import { audioService } from './services/audioService';
import { INITIAL_QUESTS, WEB_CENTRAL_STATIONS } from './data/gameData';
import { PlayerProfile, Quest, InteractiveStation } from './types/game';
import { GAME_CONFIG } from './config/gameConfig';

type AppGameState = 'start' | 'login' | 'playing';

export default function App() {
  const [gameState, setGameState] = useState<AppGameState>('start');
  const [player, setPlayer] = useState<PlayerProfile | null>(null);

  // Quests & World Progress
  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.QUESTS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  });

  const [unlockedAreas, setUnlockedAreas] = useState<string[]>(() => {
    return gasService.getLocalUnlockedAreas();
  });

  const [stations, setStations] = useState<InteractiveStation[]>(() => {
    return WEB_CENTRAL_STATIONS;
  });

  // Player position for MiniMap
  const [playerPos, setPlayerPos] = useState({
    x: 780,
    y: 700,
    mapWidth: 1600,
    mapHeight: 1400
  });

  // Modal Dialogs
  const [showDialogue, setShowDialogue] = useState(false);
  const [activeStation, setActiveStation] = useState<InteractiveStation | null>(null);
  const [isGateModal, setIsGateModal] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    title: string;
    subtitle: string;
    xpEarned: number;
    starsEarned: number;
    keyEarned?: string;
    badgeEarned?: string;
    unlockedAreaName?: string;
  } | null>(null);

  // Sync state
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Check cached login on mount
  useEffect(() => {
    const cachedPlayer = gasService.getLocalCachedPlayer();
    if (cachedPlayer) {
      setPlayer(cachedPlayer);
    }
  }, []);

  // Save quests to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    } catch {
      // ignore
    }
  }, [quests]);

  // Handle Event Bus from Phaser Scene
  useEffect(() => {
    const unsubMoved = gameEvents.on(GAME_EVENTS.PLAYER_MOVED, (pos) => {
      setPlayerPos(pos);
    });

    const unsubInteract = gameEvents.on(GAME_EVENTS.INTERACT_TRIGGERED, (target) => {
      audioService.playInteract();

      if (target.type === 'npc') {
        setShowDialogue(true);
      } else if (target.type === 'gate') {
        setIsGateModal(true);
        setActiveStation(null);
      } else if (target.type === 'station') {
        const found = stations.find((s) => s.id === target.id);
        if (found) {
          setActiveStation(found);
          setIsGateModal(false);
        }
      }
    });

    const unsubPause = gameEvents.on(GAME_EVENTS.PAUSE_GAME, (type) => {
      audioService.playBlip(600);
      if (type === 'world_map') setShowWorldMap((prev) => !prev);
      if (type === 'quest_log') setShowQuestLog((prev) => !prev);
      if (type === 'menu') setShowPauseMenu((prev) => !prev);
    });

    return () => {
      unsubMoved();
      unsubInteract();
      unsubPause();
    };
  }, [stations]);

  // Global Keydown Listeners for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      // When modal is open, avoid re-triggering except ESC
      if (e.key === 'Escape') {
        if (showDialogue) setShowDialogue(false);
        else if (activeStation || isGateModal) {
          setActiveStation(null);
          setIsGateModal(false);
        } else if (showQuestLog) setShowQuestLog(false);
        else if (showWorldMap) setShowWorldMap(false);
        else if (celebrationData) setCelebrationData(null);
        else setShowPauseMenu((prev) => !prev);
        return;
      }

      // If any modal is active, do not handle M/Q
      const anyModalOpen = showDialogue || activeStation || isGateModal || showQuestLog || showWorldMap || showPauseMenu || celebrationData;
      if (anyModalOpen) return;

      if (e.key.toLowerCase() === 'm') {
        audioService.playBlip(600);
        setShowWorldMap(true);
      } else if (e.key.toLowerCase() === 'q') {
        audioService.playBlip(600);
        setShowQuestLog(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showDialogue, activeStation, isGateModal, showQuestLog, showWorldMap, showPauseMenu, celebrationData]);

  // Login handler
  const handleLoginSuccess = (profile: PlayerProfile) => {
    setPlayer(profile);
    setGameState('playing');
    audioService.startBgm();

    // Auto log activity
    gasService.saveActivity({
      studentId: profile.studentId,
      action: 'LOGIN',
      area: 'WEB CENTRAL',
      missionId: 'M01',
      result: 'SUCCESS',
      detail: 'Student entered Web City Web Central Plaza'
    });
  };

  // Start game directly if player is cached
  const handleStartGame = () => {
    if (player) {
      setGameState('playing');
      audioService.startBgm();
    } else {
      setGameState('login');
    }
  };

  // Accept Quest
  const handleAcceptQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.questId === questId) {
          return { ...q, state: 'InProgress' };
        }
        return q;
      })
    );
    setShowDialogue(false);

    if (player) {
      gasService.saveMissionProgress(player.studentId, questId, 'web_central', 'InProgress');
    }
  };

  // Station Quiz Answer Correct
  const handleStationAnswerCorrect = useCallback((stationId: string) => {
    // 1. Mark station discovered
    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, discovered: true } : s))
    );

    // 2. Update player XP (+50 bonus)
    if (player) {
      const updatedPlayer: PlayerProfile = {
        ...player,
        xp: player.xp + 50,
        level: Math.floor((player.xp + 50) / GAME_CONFIG.BASE_XP_PER_LEVEL) + 1
      };
      setPlayer(updatedPlayer);
      gasService.savePlayer(updatedPlayer);
    }

    // 3. Update Quest M01 objectives
    setQuests((prevQuests) => {
      const current = prevQuests.find((q) => q.questId === 'M01');
      if (!current) return prevQuests;

      const updatedObjectives = current.objectivesList.map((obj) =>
        obj.id === stationId ? { ...obj, isCompleted: true } : obj
      );

      const allCompleted = updatedObjectives.every((obj) => obj.isCompleted);

      if (allCompleted && current.state !== 'Completed') {
        // MISSION 01 IS COMPLETED!
        const completedQuest: Quest = {
          ...current,
          objectivesList: updatedObjectives,
          state: 'Completed'
        };

        // Unlock Network Gateway
        const newUnlockedAreas = [...unlockedAreas, 'network_gateway'];
        setUnlockedAreas(newUnlockedAreas);
        gasService.recordLocalAreaUnlock('network_gateway');

        // Grant Web Key and Badge
        if (player) {
          const finalPlayer: PlayerProfile = {
            ...player,
            xp: player.xp + 50 + current.rewardXP,
            star: player.star + current.rewardStar,
            level: Math.floor((player.xp + 50 + current.rewardXP) / GAME_CONFIG.BASE_XP_PER_LEVEL) + 1,
            keys: {
              ...player.keys,
              webKey: true
            }
          };
          setPlayer(finalPlayer);
          gasService.savePlayer(finalPlayer);
          gasService.unlockArea(player.studentId, 'network_gateway', 'Completed Mission 01');
          gasService.saveBadge(player.studentId, 'Web Explorer', 'Web Explorer');
          gasService.completeMission({
            studentId: player.studentId,
            missionId: 'M01',
            score: current.rewardXP,
            star: current.rewardStar,
            attempt: 1,
            hintUsed: 0,
            timeSpent: 120
          });
        }

        // Trigger Celebration
        setTimeout(() => {
          setCelebrationData({
            title: 'MISSION 01 COMPLETED!',
            subtitle: 'ยินดีด้วย! คุณผ่านการสำรวจ Web Central ครบทั้ง 5 สถานีแล้ว',
            xpEarned: current.rewardXP + 50,
            starsEarned: current.rewardStar,
            keyEarned: current.rewardKey,
            badgeEarned: current.rewardBadge,
            unlockedAreaName: 'NETWORK GATEWAY (AREA 2)'
          });
        }, 600);

        return prevQuests.map((q) => (q.questId === 'M01' ? completedQuest : q));
      }

      return prevQuests.map((q) =>
        q.questId === 'M01' ? { ...q, objectivesList: updatedObjectives, state: 'InProgress' } : q
      );
    });
  }, [player, unlockedAreas]);

  // Retry Sync
  const handleRetrySync = async () => {
    const result = await gasService.retrySync();
    setIsOffline(gasService.getIsOfflineMode());
    setPendingSyncCount(gasService.getPendingQueueLength());
    if (result.succeeded > 0) {
      audioService.playSuccess();
    }
  };

  // Logout
  const handleLogout = () => {
    gasService.clearLocalPlayer();
    setPlayer(null);
    setShowPauseMenu(false);
    setGameState('start');
    audioService.stopBgm();
  };

  const activeQuest = quests.find((q) => q.questId === 'M01') || null;
  const isGateUnlocked = unlockedAreas.includes('network_gateway');

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050814] text-slate-100 font-sans select-none">
      {/* 1. START SCREEN */}
      {gameState === 'start' && (
        <StartScreen
          onStart={handleStartGame}
          onOpenLogin={() => setGameState('login')}
        />
      )}

      {/* 2. STUDENT LOGIN SCREEN */}
      {gameState === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setGameState('start')}
        />
      )}

      {/* 3. GAME ENGINE CANVAS & PLAYING HUD */}
      {gameState === 'playing' && player && (
        <>
          {/* Phaser 2D Game Canvas */}
          <PhaserCanvas />

          {/* Player HUD */}
          <GameHud
            player={player}
            currentQuest={activeQuest}
            onOpenWorldMap={() => setShowWorldMap(true)}
            onOpenQuestLog={() => setShowQuestLog(true)}
            onOpenMenu={() => setShowPauseMenu(true)}
            isOffline={isOffline}
            pendingSyncCount={pendingSyncCount}
            onRetrySync={handleRetrySync}
          />

          {/* Radar MiniMap */}
          <MiniMap playerPos={playerPos} />

          {/* NPC BYTE Dialogue Modal */}
          {showDialogue && (
            <DialogueModal
              player={player}
              quest={activeQuest}
              onAcceptQuest={handleAcceptQuest}
              onClose={() => setShowDialogue(false)}
            />
          )}

          {/* Station / Gateway Inspection Modal */}
          {(activeStation || isGateModal) && (
            <StationModal
              station={activeStation}
              isGate={isGateModal}
              isGateUnlocked={isGateUnlocked}
              onAnswerCorrect={handleStationAnswerCorrect}
              onClose={() => {
                setActiveStation(null);
                setIsGateModal(false);
              }}
            />
          )}

          {/* Quest Log Modal [Q] */}
          {showQuestLog && (
            <QuestLogModal
              quests={quests}
              onClose={() => setShowQuestLog(false)}
            />
          )}

          {/* World Map Modal [M] */}
          {showWorldMap && (
            <WorldMapModal
              player={player}
              unlockedAreaIds={unlockedAreas}
              onClose={() => setShowWorldMap(false)}
            />
          )}

          {/* Pause Menu Modal [ESC] */}
          {showPauseMenu && (
            <PauseMenuModal
              player={player}
              onResume={() => setShowPauseMenu(false)}
              onLogout={handleLogout}
              onRetrySync={handleRetrySync}
              isOffline={isOffline}
              pendingSyncCount={pendingSyncCount}
            />
          )}

          {/* Celebration / Mission Complete Modal */}
          {celebrationData && (
            <CelebrationModal
              {...celebrationData}
              onContinue={() => setCelebrationData(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
