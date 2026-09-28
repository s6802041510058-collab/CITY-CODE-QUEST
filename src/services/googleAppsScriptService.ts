/**
 * Google Apps Script Web App Integration Service
 * Manages communication with Google Sheets backend via GAS Web App.
 * Includes LocalStorage fallback, offline queue, and retry mechanisms.
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { 
  PlayerProfile, 
  CompleteMissionPayload, 
  GasApiResponse, 
  ActivityLogEntry, 
  GameSummary,
  AreaState 
} from '../types/game';

class GoogleAppsScriptService {
  private url: string;
  private isOfflineMode: boolean = false;
  private offlineQueue: Array<{ action: string; payload: unknown; timestamp: string }> = [];

  constructor() {
    this.url = GAME_CONFIG.APPS_SCRIPT_URL;
    this.loadOfflineQueue();
  }

  private loadOfflineQueue() {
    try {
      const stored = localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.SYNC_QUEUE);
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
      }
    } catch {
      this.offlineQueue = [];
    }
  }

  private saveOfflineQueue() {
    try {
      localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.offlineQueue));
    } catch {
      // ignore
    }
  }

  /**
   * Generic request executor with timeout, json-mode, and offline queueing
   */
  private async executeAction<T>(action: string, payload: Record<string, unknown>): Promise<GasApiResponse<T>> {
    const body = {
      action,
      sheetId: GAME_CONFIG.SHEET_ID,
      timestamp: new Date().toISOString(),
      ...payload
    };

    // Attempt network request
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      // Google Apps Script requires text/plain or application/x-www-form-urlencoded to prevent CORS preflight in some setups,
      // or standard POST with redirect follow.
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.isOfflineMode = false;
      return data as GasApiResponse<T>;
    } catch (err: unknown) {
      console.warn(`[GAS Service] Action "${action}" failed, switching to local cache fallback:`, err);
      this.isOfflineMode = true;

      // Queue action for syncing later if it alters data
      if (action !== 'loadPlayer') {
        this.offlineQueue.push({
          action,
          payload,
          timestamp: new Date().toISOString()
        });
        this.saveOfflineQueue();
      }

      return {
        success: false,
        message: 'ไม่สามารถติดต่อ Google Apps Script ได้ในขณะนี้ ข้อมูลถูกบันทึกในเครื่องของคุณแล้ว'
      };
    }
  }

  /**
   * Create new player in Google Sheet & LocalStorage
   */
  async createPlayer(studentId: string, name: string, className: string): Promise<GasApiResponse<PlayerProfile>> {
    const initialProfile: PlayerProfile = {
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

    // Always cache locally first
    this.cachePlayerLocally(initialProfile);

    const res = await this.executeAction<PlayerProfile>('createPlayer', {
      studentId: initialProfile.studentId,
      name: initialProfile.name,
      className: initialProfile.className,
      level: initialProfile.level,
      xp: initialProfile.xp,
      star: initialProfile.star,
      currentMission: initialProfile.currentMission
    });

    if (res.success && res.data) {
      this.cachePlayerLocally(res.data);
      return res;
    }

    // Return local version as successful fallback
    return {
      success: true,
      message: 'สร้างโปรไฟล์ผู้เล่นเรียบร้อย (บันทึกในอุปกรณ์)',
      data: initialProfile
    };
  }

  /**
   * Load player by Student ID
   */
  async loadPlayer(studentId: string): Promise<GasApiResponse<PlayerProfile>> {
    const trimmedId = studentId.trim();

    // Try online first
    const onlineRes = await this.executeAction<PlayerProfile>('loadPlayer', { studentId: trimmedId });
    if (onlineRes.success && onlineRes.data) {
      this.cachePlayerLocally(onlineRes.data);
      return onlineRes;
    }

    // Check LocalStorage cache
    const cached = this.getLocalCachedPlayer();
    if (cached && cached.studentId.toLowerCase() === trimmedId.toLowerCase()) {
      return {
        success: true,
        message: 'โหลดข้อมูลผู้เล่นจากหน่วยความจำในเครื่อง',
        data: cached
      };
    }

    return {
      success: false,
      message: 'ไม่พบข้อมูลผู้เล่นในระบบ'
    };
  }

  /**
   * Save player state
   */
  async savePlayer(profile: PlayerProfile): Promise<GasApiResponse<void>> {
    profile.updatedAt = new Date().toISOString();
    this.cachePlayerLocally(profile);

    return this.executeAction<void>('savePlayer', {
      studentId: profile.studentId,
      name: profile.name,
      className: profile.className,
      level: profile.level,
      xp: profile.xp,
      star: profile.star,
      currentMission: profile.currentMission,
      keys: profile.keys
    });
  }

  /**
   * Save mission progress
   */
  async saveMissionProgress(
    studentId: string, 
    missionId: string, 
    area: string, 
    status: string, 
    score: number = 0,
    star: number = 0
  ): Promise<GasApiResponse<void>> {
    return this.executeAction<void>('saveMissionProgress', {
      studentId,
      missionId,
      area,
      status,
      score,
      star
    });
  }

  /**
   * Complete mission and calculate rewards
   */
  async completeMission(payload: CompleteMissionPayload): Promise<GasApiResponse<{ level: number; xp: number; star: number; newArea?: string }>> {
    const res = await this.executeAction<{ level: number; xp: number; star: number; newArea?: string }>('completeMission', {
      ...payload
    });

    // Update local cached profile rewards
    const cached = this.getLocalCachedPlayer();
    if (cached && cached.studentId === payload.studentId) {
      cached.star += payload.star;
      cached.xp += payload.score;
      cached.updatedAt = new Date().toISOString();
      this.cachePlayerLocally(cached);
    }

    return res;
  }

  /**
   * Unlock area record
   */
  async unlockArea(studentId: string, areaId: string, reason: string): Promise<GasApiResponse<void>> {
    this.recordLocalAreaUnlock(areaId);
    return this.executeAction<void>('unlockArea', {
      studentId,
      areaId,
      unlocked: true,
      unlockReason: reason
    });
  }

  /**
   * Save badge unlocked
   */
  async saveBadge(studentId: string, badgeId: string, badgeName: string): Promise<GasApiResponse<void>> {
    this.recordLocalBadge(badgeId);
    return this.executeAction<void>('saveBadge', {
      studentId,
      badgeId,
      badgeName,
      unlockedAt: new Date().toISOString()
    });
  }

  /**
   * Save activity log entry
   */
  async saveActivity(log: Omit<ActivityLogEntry, 'timestamp'>): Promise<GasApiResponse<void>> {
    return this.executeAction<void>('saveActivity', {
      ...log,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Save final game summary
   */
  async saveGameSummary(summary: GameSummary): Promise<GasApiResponse<void>> {
    return this.executeAction<void>('saveGameSummary', {
      ...summary
    });
  }

  /**
   * Retry syncing pending offline queue
   */
  async retrySync(): Promise<{ succeeded: number; failed: number }> {
    if (this.offlineQueue.length === 0) {
      return { succeeded: 0, failed: 0 };
    }

    const itemsToSync = [...this.offlineQueue];
    let succeeded = 0;
    let failed = 0;

    for (const item of itemsToSync) {
      try {
        const res = await this.executeAction(item.action, item.payload as Record<string, unknown>);
        if (res.success) {
          succeeded++;
          this.offlineQueue = this.offlineQueue.filter(q => q !== item);
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    this.saveOfflineQueue();
    return { succeeded, failed };
  }

  // --- Local Storage Helpers ---

  cachePlayerLocally(profile: PlayerProfile): void {
    try {
      localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.PLAYER, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  getLocalCachedPlayer(): PlayerProfile | null {
    try {
      const data = localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.PLAYER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  clearLocalPlayer(): void {
    try {
      localStorage.removeItem(GAME_CONFIG.STORAGE_KEYS.PLAYER);
    } catch {
      // ignore
    }
  }

  recordLocalAreaUnlock(areaId: string): void {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.UNLOCKED_AREAS) || '["web_central"]');
      if (!list.includes(areaId)) {
        list.push(areaId);
        localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.UNLOCKED_AREAS, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  }

  getLocalUnlockedAreas(): string[] {
    try {
      return JSON.parse(localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.UNLOCKED_AREAS) || '["web_central"]');
    } catch {
      return ['web_central'];
    }
  }

  recordLocalBadge(badgeId: string): void {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.BADGES) || '[]');
      if (!list.includes(badgeId)) {
        list.push(badgeId);
        localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.BADGES, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  }

  getLocalBadges(): string[] {
    try {
      return JSON.parse(localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.BADGES) || '[]');
    } catch {
      return [];
    }
  }

  getIsOfflineMode(): boolean {
    return this.isOfflineMode;
  }

  getPendingQueueLength(): number {
    return this.offlineQueue.length;
  }
}

export const gasService = new GoogleAppsScriptService();
