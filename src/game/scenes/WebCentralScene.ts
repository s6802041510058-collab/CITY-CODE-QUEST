/**
 * Web Central Scene - Starting Area of Web City
 * Features WASD physics movement, 4-direction animations, solid collisions,
 * camera follow, NPC BYTE, interactive stations, and event emission.
 */

import Phaser from 'phaser';
import { generateGameTextures } from '../utils/textureGenerator';
import { gameEvents, GAME_EVENTS } from '../GameEvents';
import { WEB_CENTRAL_STATIONS } from '../../data/gameData';
import { GAME_CONFIG } from '../../config/gameConfig';
import { audioService } from '../../services/audioService';

export class WebCentralScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    e: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    m: Phaser.Input.Keyboard.Key;
    q: Phaser.Input.Keyboard.Key;
    esc: Phaser.Input.Keyboard.Key;
  };

  private byteNpc!: Phaser.GameObjects.Sprite;
  private byteGlow!: Phaser.GameObjects.Arc;
  private byteTime: number = 0;

  private stationsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;
  private promptContainer!: Phaser.GameObjects.Container;
  private promptText!: Phaser.GameObjects.Text;
  private nearbyTarget: { type: 'npc' | 'station' | 'gate'; id: string; name: string } | null = null;

  // Map dimensions
  private readonly MAP_WIDTH = 1600;
  private readonly MAP_HEIGHT = 1400;

  constructor() {
    super({ key: 'WebCentralScene' });
  }

  preload() {
    // Generate procedural textures
    generateGameTextures(this);
  }

  create() {
    // 1. Build City Ground & Pathways
    this.createMapEnvironment();

    // 2. Build Interactive Stations & Structures
    this.createStations();

    // 3. Create NPC BYTE
    this.createByteNPC();

    // 4. Create Player Character
    this.createPlayer();

    // 5. Setup Physics Collisions
    this.setupCollisions();

    // 6. Setup Camera Follow
    this.setupCamera();

    // 7. Setup Inputs (WASD + Action Keys)
    this.setupInputs();

    // 8. Setup In-Game Proximity Prompt
    this.createInteractionPrompt();

    // Animations setup
    this.createPlayerAnimations();
  }

  private createMapEnvironment() {
    // Fill background with cyber ground tiles
    const ground = this.add.tileSprite(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT, 'cyber_tile_ground');
    ground.setOrigin(0, 0);

    // Central Plaza paved area (large high-tech courtyard)
    const plazaGraphics = this.add.graphics();

    // Grand Cyber Plaza (Center)
    plazaGraphics.fillStyle(0x0f172a, 0.95);
    plazaGraphics.fillRoundedRect(350, 280, 900, 900, 24);
    plazaGraphics.lineStyle(2, 0x06b6d4, 0.4);
    plazaGraphics.strokeRoundedRect(350, 280, 900, 900, 24);

    // Inner glowing plaza ring
    plazaGraphics.lineStyle(2, 0x38bdf8, 0.6);
    plazaGraphics.strokeCircle(780, 700, 160);
    plazaGraphics.lineStyle(1, 0xa855f7, 0.4);
    plazaGraphics.strokeCircle(780, 700, 220);

    // Decorative cyber pathway lines
    plazaGraphics.lineStyle(4, 0x06b6d4, 0.3);
    // Pathway to Gateway
    plazaGraphics.beginPath();
    plazaGraphics.moveTo(780, 280);
    plazaGraphics.lineTo(780, 120);
    plazaGraphics.stroke();

    // Pathway to Left/Right
    plazaGraphics.beginPath();
    plazaGraphics.moveTo(350, 700);
    plazaGraphics.lineTo(200, 700);
    plazaGraphics.moveTo(1250, 700);
    plazaGraphics.lineTo(1400, 700);
    plazaGraphics.stroke();

    // Surrounding cyber trees
    const treePositions = [
      { x: 380, y: 320 }, { x: 1180, y: 320 },
      { x: 380, y: 1140 }, { x: 1180, y: 1140 },
      { x: 260, y: 550 }, { x: 1340, y: 550 },
      { x: 260, y: 850 }, { x: 1340, y: 850 },
    ];

    treePositions.forEach(pos => {
      this.add.image(pos.x, pos.y, 'cyber_tree').setDepth(pos.y);
    });

    // Streetlamps with glowing light cones
    const lampPositions = [
      { x: 620, y: 500 }, { x: 940, y: 500 },
      { x: 620, y: 950 }, { x: 940, y: 950 },
      { x: 780, y: 340 }
    ];

    lampPositions.forEach(pos => {
      this.add.image(pos.x, pos.y, 'cyber_lamp').setDepth(pos.y);
      // Soft light glow circle
      const glow = this.add.arc(pos.x, pos.y + 14, 45, 0, 360, false, 0x06b6d4, 0.08);
      glow.setDepth(1);
    });

    // Central Title Hologram Display on floor
    const titleText = this.add.text(780, 760, 'WEB CITY : WEB CENTRAL', {
      fontFamily: 'Chakra Petch, sans-serif',
      fontSize: '18px',
      color: '#38bdf8',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0.7);
    titleText.setDepth(2);

    const subTitle = this.add.text(780, 785, '< STARTING AREA - EXPLORE THE WEB >', {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      color: '#06b6d4',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0.6);
    subTitle.setDepth(2);
  }

  private createStations() {
    this.stationsGroup = this.physics.add.staticGroup();
    this.obstaclesGroup = this.physics.add.staticGroup();

    // Perimeter City Border Walls (Collision blockers)
    // Top, Bottom, Left, Right solid barriers
    this.createSolidWall(0, 0, this.MAP_WIDTH, 40); // Top
    this.createSolidWall(0, this.MAP_HEIGHT - 40, this.MAP_WIDTH, 40); // Bottom
    this.createSolidWall(0, 0, 40, this.MAP_HEIGHT); // Left
    this.createSolidWall(this.MAP_WIDTH - 40, 0, 40, this.MAP_HEIGHT); // Right

    // Perimeter Cyber Building Blocks (City skyline barriers)
    // Top-left buildings
    this.createBuildingBlock(100, 100, 220, 150, 'SERVER TOWER A');
    // Top-right buildings
    this.createBuildingBlock(1280, 100, 220, 150, 'DATA BANK B');
    // Bottom-left buildings
    this.createBuildingBlock(100, 1100, 220, 200, 'HTML FOUNDRY');
    // Bottom-right buildings
    this.createBuildingBlock(1280, 1100, 220, 200, 'DEBUG FACILITY');

    // 1. Browser Station
    const sBrowser = this.stationsGroup.create(480, 420, 'station_browser');
    sBrowser.setData('stationId', 'browser_station');
    sBrowser.setData('stationName', 'Browser Station (สถานีเบราว์เซอร์)');
    this.createStationLabel(480, 465, 'Browser Station', '#38bdf8');

    // 2. Web Server Station
    const sServer = this.stationsGroup.create(1080, 420, 'station_web_server');
    sServer.setData('stationId', 'web_server_station');
    sServer.setData('stationName', 'Web Server (สถานีแม่ข่ายเว็บ)');
    this.createStationLabel(1080, 465, 'Web Server', '#a855f7');

    // 3. Web Page Station
    const sPage = this.stationsGroup.create(480, 880, 'station_web_page');
    sPage.setData('stationId', 'web_page_station');
    sPage.setData('stationName', 'Web Page (สถานีเว็บเพจ)');
    this.createStationLabel(480, 925, 'Web Page', '#06b6d4');

    // 4. Homepage Station
    const sHome = this.stationsGroup.create(1080, 880, 'station_homepage');
    sHome.setData('stationId', 'homepage_station');
    sHome.setData('stationName', 'Homepage (สถานีโฮมเพจ)');
    this.createStationLabel(1080, 925, 'Homepage (index.html)', '#f59e0b');

    // 5. URL Board Station
    const sUrl = this.stationsGroup.create(780, 1120, 'station_url_board');
    sUrl.setData('stationId', 'url_board_station');
    sUrl.setData('stationName', 'URL Board (ป้ายระบุตำแหน่ง)');
    this.createStationLabel(780, 1165, 'URL Board', '#10b981');

    // 6. Network Gateway Gate (Top center exit to Area 2)
    const gate = this.stationsGroup.create(780, 160, 'gateway_gate');
    gate.setData('stationId', 'gateway_gate');
    gate.setData('stationName', 'Network Gateway (เชื่อมต่อ Area 2)');
    this.createStationLabel(780, 205, '[LOCKED] NETWORK GATEWAY', '#ef4444');

    // Make all stations solid collision obstacles so player doesn't walk into them
    (this.stationsGroup.getChildren() as Phaser.Physics.Arcade.Sprite[]).forEach((obj) => {
      obj.refreshBody();
      obj.setDepth(obj.y);
    });
  }

  private createSolidWall(x: number, y: number, width: number, height: number) {
    const wall = this.add.rectangle(x + width / 2, y + height / 2, width, height, 0x050814);
    this.physics.add.existing(wall, true);
    this.obstaclesGroup.add(wall);
  }

  private createBuildingBlock(x: number, y: number, width: number, height: number, label: string) {
    const rect = this.add.rectangle(x + width / 2, y + height / 2, width, height, 0x090d16);
    rect.setStrokeStyle(2, 0x1e293b);
    rect.setDepth(y + height);

    // Glowing window accents
    const g = this.add.graphics();
    g.fillStyle(0x06b6d4, 0.25);
    for (let row = y + 20; row < y + height - 20; row += 25) {
      for (let col = x + 20; col < x + width - 20; col += 35) {
        g.fillRect(col, row, 18, 12);
      }
    }
    g.setDepth(y + height);

    // Building label
    this.add.text(x + width / 2, y + height / 2, label, {
      fontFamily: 'Chakra Petch, sans-serif',
      fontSize: '11px',
      color: '#64748b'
    }).setOrigin(0.5).setDepth(y + height + 1);

    this.physics.add.existing(rect, true);
    this.obstaclesGroup.add(rect);
  }

  private createStationLabel(x: number, y: number, text: string, color: string) {
    const label = this.add.text(x, y, text, {
      fontFamily: 'Chakra Petch, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: color,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(y + 10);
    return label;
  }

  private createByteNPC() {
    // BYTE position (Just above center plaza)
    const byteX = 780;
    const byteY = 620;

    // Glowing aura behind BYTE
    this.byteGlow = this.add.arc(byteX, byteY, 32, 0, 360, false, 0x06b6d4, 0.25);
    this.byteGlow.setDepth(byteY - 1);

    this.byteNpc = this.add.sprite(byteX, byteY, 'byte_npc');
    this.byteNpc.setDepth(byteY);

    // Floating text label
    this.add.text(byteX, byteY - 32, 'BYTE [AI GUIDE]', {
      fontFamily: 'Chakra Petch, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#38bdf8',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5).setDepth(byteY + 1);
  }

  private createPlayer() {
    // Player spawn point
    const spawnX = 780;
    const spawnY = 700;

    this.player = this.physics.add.sprite(spawnX, spawnY, 'player_down_0');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(22, 16);
    this.player.setOffset(7, 30);
    this.player.setDepth(spawnY);
  }

  private setupCollisions() {
    // Collide with obstacle walls and buildings
    this.physics.add.collider(this.player, this.obstaclesGroup);
    // Collide with station physical structures
    this.physics.add.collider(this.player, this.stationsGroup);
  }

  private setupCamera() {
    this.cameras.main.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
    this.physics.world.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
    // Smooth camera follow
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.2);
  }

  private setupInputs() {
    // Standard arrows
    this.cursors = this.input.keyboard!.createCursorKeys();

    // WASD and custom keys
    this.wasdKeys = {
      w: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      e: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      space: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      m: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M),
      q: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      esc: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    };

    // Listen for single press action triggers
    this.wasdKeys.e.on('down', () => this.triggerInteraction());
    this.wasdKeys.space.on('down', () => this.triggerInteraction());
    this.wasdKeys.m.on('down', () => gameEvents.emit(GAME_EVENTS.PAUSE_GAME, 'world_map'));
    this.wasdKeys.q.on('down', () => gameEvents.emit(GAME_EVENTS.PAUSE_GAME, 'quest_log'));
    this.wasdKeys.esc.on('down', () => gameEvents.emit(GAME_EVENTS.PAUSE_GAME, 'menu'));
  }

  private createInteractionPrompt() {
    this.promptContainer = this.add.container(0, 0);
    this.promptContainer.setDepth(9999);
    this.promptContainer.setVisible(false);

    const bg = this.add.rectangle(0, 0, 130, 26, 0x0f172a, 0.95);
    bg.setStrokeStyle(1.5, 0x06b6d4);

    this.promptText = this.add.text(0, 0, '[E] ตรวจสอบ', {
      fontFamily: 'Kanit, sans-serif',
      fontSize: '11px',
      color: '#38bdf8',
      align: 'center'
    }).setOrigin(0.5);

    this.promptContainer.add([bg, this.promptText]);
  }

  private createPlayerAnimations() {
    // Down walk
    this.anims.create({
      key: 'walk_down',
      frames: [
        { key: 'player_down_1' },
        { key: 'player_down_0' },
        { key: 'player_down_2' },
        { key: 'player_down_0' }
      ],
      frameRate: 8,
      repeat: -1
    });

    // Up walk
    this.anims.create({
      key: 'walk_up',
      frames: [
        { key: 'player_up_1' },
        { key: 'player_up_0' },
        { key: 'player_up_2' },
        { key: 'player_up_0' }
      ],
      frameRate: 8,
      repeat: -1
    });

    // Side walk
    this.anims.create({
      key: 'walk_side',
      frames: [
        { key: 'player_side_1' },
        { key: 'player_side_0' },
        { key: 'player_side_2' },
        { key: 'player_side_0' }
      ],
      frameRate: 8,
      repeat: -1
    });
  }

  update(time: number, delta: number) {
    if (!this.player) return;

    // 1. Handle WASD Movement with vector normalization
    this.handlePlayerMovement();

    // 2. Animate BYTE NPC (gentle sine wave hover & glow pulsing)
    this.animateByteNPC(time);

    // 3. Dynamic depth sorting based on Y position
    this.player.setDepth(this.player.y);

    // 4. Check proximity to BYTE and stations
    this.checkProximities();

    // 5. Emit player position for React Mini-Map & HUD
    gameEvents.emit(GAME_EVENTS.PLAYER_MOVED, {
      x: this.player.x,
      y: this.player.y,
      mapWidth: this.MAP_WIDTH,
      mapHeight: this.MAP_HEIGHT
    });
  }

  private handlePlayerMovement() {
    const speed = GAME_CONFIG.PLAYER_SPEED;
    let vx = 0;
    let vy = 0;

    // Up / Down
    if (this.wasdKeys.w.isDown || this.cursors.up.isDown) {
      vy = -1;
    } else if (this.wasdKeys.s.isDown || this.cursors.down.isDown) {
      vy = 1;
    }

    // Left / Right
    if (this.wasdKeys.a.isDown || this.cursors.left.isDown) {
      vx = -1;
    } else if (this.wasdKeys.d.isDown || this.cursors.right.isDown) {
      vx = 1;
    }

    // Normalize diagonal movement vector so diagonal is not faster
    if (vx !== 0 && vy !== 0) {
      const length = Math.sqrt(vx * vx + vy * vy);
      vx /= length;
      vy /= length;
    }

    // Apply physics velocity
    this.player.setVelocity(vx * speed, vy * speed);

    // Handle character sprite animation & orientation
    if (vx === 0 && vy === 0) {
      // Idle state
      this.player.anims.stop();
      // Keep last facing direction frame
    } else {
      // Play walking footstep sound
      audioService.playFootstep();

      if (vy > 0) {
        this.player.anims.play('walk_down', true);
        this.player.setFlipX(false);
      } else if (vy < 0) {
        this.player.anims.play('walk_up', true);
        this.player.setFlipX(false);
      } else if (vx < 0) {
        this.player.anims.play('walk_side', true);
        this.player.setFlipX(true); // Flip for Left
      } else if (vx > 0) {
        this.player.anims.play('walk_side', true);
        this.player.setFlipX(false); // Right
      }
    }
  }

  private animateByteNPC(time: number) {
    this.byteTime += 0.04;
    const hoverY = 620 + Math.sin(this.byteTime) * 6;
    this.byteNpc.y = hoverY;
    this.byteGlow.y = hoverY;

    // Subtle scale pulsing
    const scalePulse = 1 + Math.sin(this.byteTime * 1.5) * 0.08;
    this.byteGlow.setScale(scalePulse);
  }

  private checkProximities() {
    const interactDist = GAME_CONFIG.INTERACTION_DISTANCE;
    let closestTarget: { type: 'npc' | 'station' | 'gate'; id: string; name: string } | null = null;
    let closestDist = interactDist;
    let targetX = 0;
    let targetY = 0;

    // Check BYTE distance
    const distToByte = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.byteNpc.x, this.byteNpc.y);
    if (distToByte < closestDist) {
      closestTarget = { type: 'npc', id: 'byte_npc', name: 'BYTE (AI Guide)' };
      closestDist = distToByte;
      targetX = this.byteNpc.x;
      targetY = this.byteNpc.y - 45;
    }

    // Check stations distance
    (this.stationsGroup.getChildren() as Phaser.Physics.Arcade.Sprite[]).forEach((station) => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, station.x, station.y);
      if (dist < closestDist) {
        const id = station.getData('stationId') || '';
        const name = station.getData('stationName') || '';
        const type = id === 'gateway_gate' ? 'gate' : 'station';
        closestTarget = { type, id, name };
        closestDist = dist;
        targetX = station.x;
        targetY = station.y - 45;
      }
    });

    if (closestTarget) {
      this.nearbyTarget = closestTarget;
      this.promptContainer.setPosition(targetX, targetY);
      this.promptContainer.setVisible(true);

      const label = closestTarget.type === 'npc' ? '[E] คุยกับ BYTE' :
                    closestTarget.type === 'gate' ? '[E] ตรวจสอบประตู' : '[E] ตรวจสอบสถานี';
      this.promptText.setText(label);

      gameEvents.emit(GAME_EVENTS.PROXIMITY_ENTER, closestTarget);
    } else {
      if (this.nearbyTarget) {
        this.nearbyTarget = null;
        this.promptContainer.setVisible(false);
        gameEvents.emit(GAME_EVENTS.PROXIMITY_LEAVE);
      }
    }
  }

  private triggerInteraction() {
    if (!this.nearbyTarget) return;

    // Emit event with interactable target data to React UI
    gameEvents.emit(GAME_EVENTS.INTERACT_TRIGGERED, this.nearbyTarget);
  }
}
