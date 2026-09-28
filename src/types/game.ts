/**
 * Type definitions for WEB CITY: CODE QUEST
 */

export interface PlayerProfile {
  studentId: string;
  name: string;
  className: string;
  level: number;
  xp: number;
  star: number;
  keys: {
    webKey: boolean;
    networkKey: boolean;
    htmlKey: boolean;
    structureKey: boolean;
    arenaKey: boolean;
    debugKey: boolean;
  };
  currentMission: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export type QuestState = 'NotStarted' | 'Accepted' | 'InProgress' | 'Completed' | 'Failed' | 'Retry';

export type AreaState = 'Locked' | 'Unlocked' | 'Active' | 'Completed';

export interface QuestObjective {
  id: string;
  description: string;
  isCompleted: boolean;
  targetCount?: number;
  currentCount?: number;
}

export interface Quest {
  questId: string;
  questName: string;
  areaId: string;
  npcId: string;
  objective: string;
  objectivesList: QuestObjective[];
  taskType: 'EXPLORATION' | 'PACKET_DELIVERY' | 'TAG_MATCH' | 'STRUCTURE_BUILD' | 'TAG_BATTLE' | 'BUG_HUNT' | 'FINAL_WEBSITE';
  rewardXP: number;
  rewardStar: number;
  rewardKey?: string;
  rewardBadge?: string;
  unlockArea?: string;
  completionCondition: string;
  state: QuestState;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface AreaInfo {
  id: string;
  name: string;
  thaiName: string;
  description: string;
  state: AreaState;
  requiredStars?: number;
  requiredBadges?: string[];
  coordinates: { x: number; y: number };
}

export interface InteractiveStation {
  id: string;
  name: string;
  subtitle: string;
  topic: string;
  description: string;
  detailedInfo: string;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  x: number;
  y: number;
  discovered: boolean;
}

export interface DialogueMessage {
  speaker: string;
  speakerRole: string;
  text: string;
  expression?: 'normal' | 'happy' | 'thinking' | 'alert' | 'proud';
  choices?: {
    text: string;
    action: () => void;
  }[];
}

export interface ActivityLogEntry {
  timestamp: string;
  studentId: string;
  action: string;
  area: string;
  missionId: string;
  result: string;
  detail: string;
}

export interface GameSummary {
  studentId: string;
  totalPlayTime: number;
  completedMissions: number;
  totalMissions: number;
  accuracy: number;
  totalHintUsed: number;
  totalAttempt: number;
  totalStar: number;
  level: number;
  gameCompleted: boolean;
}

// Google Apps Script API Types
export interface GasApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  level?: number;
  xp?: number;
  star?: number;
  newArea?: string;
}

export interface CompleteMissionPayload {
  studentId: string;
  missionId: string;
  score: number;
  star: number;
  attempt: number;
  hintUsed: number;
  timeSpent: number;
}
