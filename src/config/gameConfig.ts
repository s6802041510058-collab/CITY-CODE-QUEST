/**
 * WEB CITY: CODE QUEST
 * Central Game Configuration
 */

export const GAME_CONFIG = {
  // Google Sheets & Apps Script Configuration
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || "1Okz3y7m5EYnFGgrC2b9Yb5W4Dt2xRG4AvbtD_EGztB4",
  APPS_SCRIPT_URL: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzChU-geN-Z-Xj8NxjplYhKKyeGweBNFy3x_Pxf8wlwkxP8gRF7Q4hUyt_-OSAT2saf/exec",
  
  // Game Meta
  GAME_TITLE: "WEB CITY: CODE QUEST",
  TAGLINE: "Explore the City. Master the Web.",
  VERSION: "1.0.0 (Phase 1)",
  COURSE_NAME: "การสร้างเว็บไซต์ (Website Creating) - ปวช.1",
  
  // Gameplay Balancing
  BASE_XP_PER_LEVEL: 500,
  PLAYER_SPEED: 180,
  INTERACTION_DISTANCE: 70,
  
  // LocalStorage Keys
  STORAGE_KEYS: {
    PLAYER: "webcity_player_data",
    QUESTS: "webcity_quests_data",
    UNLOCKED_AREAS: "webcity_unlocked_areas",
    BADGES: "webcity_badges",
    SETTINGS: "webcity_settings",
    SYNC_QUEUE: "webcity_offline_sync_queue",
  }
};
