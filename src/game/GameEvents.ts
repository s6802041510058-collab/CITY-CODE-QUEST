/**
 * Event bus bridging Phaser Game Engine with React UI
 */

type EventCallback = (...args: any[]) => void;

class GameEventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  emit(event: string, ...args: any[]) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(...args);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }
}

export const gameEvents = new GameEventBus();

export const GAME_EVENTS = {
  PLAYER_MOVED: 'player_moved',
  PROXIMITY_ENTER: 'proximity_enter',
  PROXIMITY_LEAVE: 'proximity_leave',
  INTERACT_TRIGGERED: 'interact_triggered',
  STATION_DISCOVERED: 'station_discovered',
  QUEST_UPDATED: 'quest_updated',
  REWARD_EARNED: 'reward_earned',
  PAUSE_GAME: 'pause_game',
  RESUME_GAME: 'resume_game'
};
