/**
 * Procedural texture and sprite generator for WEB CITY
 * Generates cyberpunk pixel & vector style textures directly on Canvas.
 */

import Phaser from 'phaser';

export function generateGameTextures(scene: Phaser.Scene) {
  // 1. Player Sprites (Walk cycles in 4 directions)
  createPlayerTextures(scene);

  // 2. BYTE NPC Texture
  createByteTexture(scene);

  // 3. Station Textures
  createStationTextures(scene);

  // 4. City Environment & Building Textures
  createEnvironmentTextures(scene);
}

function createPlayerTextures(scene: Phaser.Scene) {
  const directions = ['down', 'up', 'side'];
  const frames = [0, 1, 2]; // 0=idle, 1=walk step 1, 2=walk step 2

  directions.forEach((dir) => {
    frames.forEach((frame) => {
      const key = `player_${dir}_${frame}`;
      if (scene.textures.exists(key)) return;

      const canvas = document.createElement('canvas');
      canvas.width = 36;
      canvas.height = 48;
      const ctx = canvas.getContext('2d')!;

      // Draw shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(18, 44, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Leg step offset
      const legOffset = frame === 0 ? 0 : frame === 1 ? -3 : 3;

      // Legs / Pants (Dark navy)
      ctx.fillStyle = '#0f172a';
      if (dir === 'side') {
        ctx.fillRect(15 + legOffset, 32, 7, 10);
        ctx.fillRect(13 - legOffset, 32, 7, 10);
      } else {
        ctx.fillRect(11, 32 + (frame === 1 ? -2 : 0), 5, 10);
        ctx.fillRect(20, 32 + (frame === 2 ? -2 : 0), 5, 10);
      }

      // Shoes (Cyan sneakers with white sole)
      ctx.fillStyle = '#06b6d4';
      if (dir === 'side') {
        ctx.fillRect(14 + legOffset, 40, 9, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(14 + legOffset, 42, 9, 2);
      } else {
        ctx.fillRect(10, 40 + (frame === 1 ? -2 : 0), 6, 3);
        ctx.fillRect(20, 40 + (frame === 2 ? -2 : 0), 6, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10, 42 + (frame === 1 ? -2 : 0), 6, 2);
        ctx.fillRect(20, 42 + (frame === 2 ? -2 : 0), 6, 2);
      }

      // Torso / Developer Hoodie (Deep blue & Cyan accents)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(10, 18, 16, 15);

      // Cyan neon chest strip / cyber logo
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(14, 21, 8, 3);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(16, 25, 4, 4);

      // Backpack on back
      if (dir === 'up') {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(12, 20, 12, 11);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(14, 23, 8, 3);
      } else if (dir === 'side') {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(8, 20, 5, 11);
      }

      // Arms
      ctx.fillStyle = '#334155';
      if (dir === 'side') {
        ctx.fillRect(16 - legOffset, 20, 5, 11);
      } else {
        ctx.fillRect(7, 20 + (frame === 1 ? 2 : -1), 4, 11);
        ctx.fillRect(25, 20 + (frame === 2 ? 2 : -1), 4, 11);
      }

      // Head & Skin
      ctx.fillStyle = '#ffd1a4';
      ctx.fillRect(11, 7, 14, 12);

      // Hair (Anime spike brown/dark)
      ctx.fillStyle = '#3b2f2f';
      ctx.fillRect(10, 4, 16, 6);
      ctx.fillRect(9, 7, 3, 5);
      ctx.fillRect(24, 7, 3, 5);

      // Face features
      if (dir === 'down') {
        // Eyes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(13, 11, 3, 3);
        ctx.fillRect(20, 11, 3, 3);
        // Eye reflections
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(14, 11, 1, 1);
        ctx.fillRect(21, 11, 1, 1);
      } else if (dir === 'side') {
        // Eye in profile
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(20, 11, 3, 3);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(21, 11, 1, 1);
      }

      // Cyber Developer Headset / Visor
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(8, 6, 20, 2); // Headband
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(8, 8, 3, 4); // Left earpiece
      ctx.fillRect(25, 8, 3, 4); // Right earpiece

      scene.textures.addCanvas(key, canvas);
    });
  });
}

function createByteTexture(scene: Phaser.Scene) {
  if (scene.textures.exists('byte_npc')) return;

  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext('2d')!;

  // Glowing cyber diamond / orb
  ctx.save();
  ctx.translate(24, 24);

  // Outer glow ring
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 19, 0, Math.PI * 2);
  ctx.stroke();

  // Floating orbiting nodes
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(17, 0, 3, 0, Math.PI * 2);
  ctx.arc(-17, 0, 3, 0, Math.PI * 2);
  ctx.arc(0, 17, 3, 0, Math.PI * 2);
  ctx.arc(0, -17, 3, 0, Math.PI * 2);
  ctx.fill();

  // Core Diamond Body
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(14, 0);
  ctx.lineTo(0, 14);
  ctx.lineTo(-14, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Eye / Visor (Smiling digital eye)
  ctx.fillStyle = '#22d3ee';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-2, -2, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  scene.textures.addCanvas('byte_npc', canvas);
}

function createStationTextures(scene: Phaser.Scene) {
  // 1. Browser Station
  if (!scene.textures.exists('station_browser')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Pedestal base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 48, 48, 12);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(12, 56, 40, 2);

    // Screen border
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 8, 52, 40);
    ctx.fillRect(6, 8, 52, 40);

    // Browser title bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 10, 48, 9);
    // Dots
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(13, 14, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(19, 14, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(25, 14, 2, 0, Math.PI * 2);
    ctx.fill();

    // URL bar
    ctx.fillStyle = '#334155';
    ctx.fillRect(30, 12, 24, 5);

    // Content area with glowing webpage preview
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(10, 22, 44, 22);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(14, 25, 20, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(14, 30, 36, 2);
    ctx.fillRect(14, 34, 30, 2);
    ctx.fillRect(14, 38, 22, 2);

    scene.textures.addCanvas('station_browser', canvas);
  }

  // 2. Web Server Station
  if (!scene.textures.exists('station_web_server')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Server Rack Cabinet
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 6, 44, 52);
    ctx.fillRect(10, 6, 44, 52);

    // Rack Units
    for (let i = 0; i < 4; i++) {
      const y = 12 + i * 11;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(14, y, 36, 8);

      // Blinking LEDs
      ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#06b6d4';
      ctx.fillRect(18, y + 3, 3, 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(24, y + 3, 3, 2);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(30, y + 3, 3, 2);

      // Ventilation Grill
      ctx.fillStyle = '#090d16';
      ctx.fillRect(36, y + 2, 10, 4);
    }

    scene.textures.addCanvas('station_web_server', canvas);
  }

  // 3. Web Page Station
  if (!scene.textures.exists('station_web_page')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Pedestal
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(16, 46, 32, 12);

    // Document Sheet
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(16, 8);
    ctx.lineTo(40, 8);
    ctx.lineTo(48, 16);
    ctx.lineTo(48, 46);
    ctx.lineTo(16, 46);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Folded corner
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(40, 8);
    ctx.lineTo(40, 16);
    ctx.lineTo(48, 16);
    ctx.closePath();
    ctx.fill();

    // HTML Code lines
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(20, 16, 12, 2); // <h1>
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(20, 22, 22, 2);
    ctx.fillRect(20, 27, 24, 2);
    ctx.fillStyle = '#059669';
    ctx.fillRect(20, 32, 16, 2); // <img>
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(20, 37, 20, 2); // <p>

    scene.textures.addCanvas('station_web_page', canvas);
  }

  // 4. Homepage Station
  if (!scene.textures.exists('station_homepage')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Golden Gateway Arch / Portal
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(12, 48, 40, 12);

    // Gateway frame
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 28, 20, Math.PI, 0, false);
    ctx.lineTo(52, 48);
    ctx.lineTo(12, 48);
    ctx.closePath();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.fill();
    ctx.stroke();

    // Home icon in center
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(32, 18);
    ctx.lineTo(44, 28);
    ctx.lineTo(20, 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(24, 28, 16, 14);

    // Door
    ctx.fillStyle = '#78350f';
    ctx.fillRect(29, 34, 6, 8);

    // Label index.html
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('index.html', 32, 57);

    scene.textures.addCanvas('station_homepage', canvas);
  }

  // 5. URL Board Station
  if (!scene.textures.exists('station_url_board')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Pole
    ctx.fillStyle = '#334155';
    ctx.fillRect(30, 32, 4, 26);
    ctx.fillRect(24, 56, 16, 6);

    // Signboard
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 10, 52, 24);
    ctx.fillRect(6, 10, 52, 24);

    // Glowing URL text icon
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('https://', 32, 21);
    ctx.fillStyle = '#6ee7b7';
    ctx.font = '7px monospace';
    ctx.fillText('webcity.edu', 32, 29);

    scene.textures.addCanvas('station_url_board', canvas);
  }

  // 6. Network Gateway Gate (Connecting to Area 2)
  if (!scene.textures.exists('gateway_gate')) {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 70;
    const ctx = canvas.getContext('2d')!;

    // Massive Cyber Pylons
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;

    // Left Tower
    ctx.strokeRect(8, 6, 24, 58);
    ctx.fillRect(8, 6, 24, 58);
    // Right Tower
    ctx.strokeRect(88, 6, 24, 58);
    ctx.fillRect(88, 6, 24, 58);

    // Archway Beam
    ctx.strokeRect(8, 6, 104, 16);
    ctx.fillRect(8, 6, 104, 16);

    // Laser barrier / forcefield
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.fillRect(32, 22, 56, 42);

    // Warning / Energy lines
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.5;
    for (let y = 26; y <= 60; y += 6) {
      ctx.beginPath();
      ctx.moveTo(34, y);
      ctx.lineTo(86, y);
      ctx.stroke();
    }

    // Sign
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NETWORK GATEWAY', 60, 17);

    scene.textures.addCanvas('gateway_gate', canvas);
  }
}

function createEnvironmentTextures(scene: Phaser.Scene) {
  // Road / Cyber ground tile
  if (!scene.textures.exists('cyber_tile_ground')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Deep slate blue base
    ctx.fillStyle = '#0a0f24';
    ctx.fillRect(0, 0, 64, 64);

    // Grid line
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 64, 64);

    // Subtle digital micro-dots
    ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.fillRect(8, 8, 2, 2);
    ctx.fillRect(40, 24, 2, 2);
    ctx.fillRect(24, 48, 2, 2);
    ctx.fillRect(56, 56, 2, 2);

    scene.textures.addCanvas('cyber_tile_ground', canvas);
  }

  // Neon Sidewalk / Plaza Tile
  if (!scene.textures.exists('cyber_tile_plaza')) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 64, 64);

    // Cyan circuit accent lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(64, 32);
    ctx.moveTo(32, 0);
    ctx.lineTo(32, 64);
    ctx.stroke();

    scene.textures.addCanvas('cyber_tile_plaza', canvas);
  }

  // Cyber Tree / Hologram Flora
  if (!scene.textures.exists('cyber_tree')) {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 54;
    const ctx = canvas.getContext('2d')!;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(24, 48, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk (Metallic carbon)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(21, 28, 6, 20);

    // Glowing foliage (Cyan translucent hexagon)
    ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(24, 20, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Core glow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(24, 20, 4, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('cyber_tree', canvas);
  }

  // Cyber Streetlamp
  if (!scene.textures.exists('cyber_lamp')) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#334155';
    ctx.fillRect(14, 16, 4, 28);
    ctx.fillRect(10, 44, 12, 4);

    // Glowing lamp top
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(16, 14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(16, 14, 2.5, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('cyber_lamp', canvas);
  }
}
