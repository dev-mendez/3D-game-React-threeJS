// main.js - Neon Horizon 3D Engine (1P, 2P & 3P Modes)

class NeonHorizonGame {
  constructor() {
    this.container = document.getElementById('canvas-container');
    
    // HUD Displays
    this.p1ScoreDisplay = document.getElementById('p1-score-display');
    this.p1DistDisplay = document.getElementById('p1-dist-display');
    this.p1StatusBadge = document.getElementById('p1-status-badge');

    this.p2ScoreDisplay = document.getElementById('p2-score-display');
    this.p2DistDisplay = document.getElementById('p2-dist-display');
    this.p2StatusBadge = document.getElementById('p2-status-badge');

    this.p3ScoreDisplay = document.getElementById('p3-score-display');
    this.p3DistDisplay = document.getElementById('p3-dist-display');
    this.p3StatusBadge = document.getElementById('p3-status-badge');

    this.p1Hud = document.getElementById('p1-hud');
    this.p2Hud = document.getElementById('p2-hud');
    this.p3Hud = document.getElementById('p3-hud');
    this.singleRecordHud = document.getElementById('single-record-hud');
    this.goalContainer = document.getElementById('goal-container');

    this.highscoreDisplay = document.getElementById('highscore-display');
    this.coresDisplay = document.getElementById('cores-collected-display');
    this.speedDisplay = document.getElementById('speed-display');
    this.boostBar = document.getElementById('boost-bar');
    this.boostStatus = document.getElementById('boost-status');
    this.missileHudLabel = document.getElementById('missile-hud-label');
    this.missileStatusText = document.getElementById('missile-status-text');
    this.missileCooldownBar = document.getElementById('missile-cooldown-bar');

    this.startScreen = document.getElementById('start-screen');
    this.pauseScreen = document.getElementById('pause-screen');
    this.gameoverScreen = document.getElementById('gameover-screen');
    this.gameoverTitle = document.getElementById('gameover-title');
    this.gameoverSubtitle = document.getElementById('gameover-subtitle');

    this.singleResultBox = document.getElementById('single-result-box');
    this.p2ResultBox = document.getElementById('p2-result-box');
    this.p3FinalBox = document.getElementById('p3-final-box');
    this.finalScore = document.getElementById('final-score');
    this.finalCores = document.getElementById('final-cores');
    this.p1FinalScore = document.getElementById('p1-final-score');
    this.p2FinalScore = document.getElementById('p2-final-score');
    this.p3FinalScore = document.getElementById('p3-final-score');

    this.damageFlash = document.getElementById('damage-flash');
    this.btnStart = document.getElementById('btn-start');
    this.btnRestart = document.getElementById('btn-restart');
    this.btnBackToEditor = document.getElementById('btn-back-to-editor');
    this.btnResume = document.getElementById('btn-resume');
    this.btnPause = document.getElementById('btn-pause');
    this.btnAudio = document.getElementById('btn-audio');
    this.btnToggleObstaclesFloat = document.getElementById('btn-toggle-obstacles-float');
    this.btnToggleObstaclesMenu = document.getElementById('btn-toggle-obstacles-menu');
    this.menuObstacleText = document.getElementById('menu-obstacle-text');
    this.btnHomeFloat = document.getElementById('btn-home-float');
    this.btnMenuGameover = document.getElementById('btn-menu-gameover');
    this.btnFullscreen = document.getElementById('btn-fullscreen');

    // Controles Táctiles en Pantalla para Móviles
    this.mobileControls = document.getElementById('mobile-controls');
    this.touchBtnLeft = document.getElementById('touch-btn-left');
    this.touchBtnRight = document.getElementById('touch-btn-right');
    this.touchBtnTurbo = document.getElementById('touch-btn-turbo');
    this.touchBtnLaser = document.getElementById('touch-btn-laser');
    this.touchBtnMissile = document.getElementById('touch-btn-missile');
    this.touchMissileFill = document.getElementById('touch-missile-fill');
    this.touchMissileText = document.getElementById('touch-missile-text');
    this.mobileModeHint = document.getElementById('mobile-mode-hint');
    this.laserTouchInterval = null;
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Elementos DOM del Editor de Mapas 3D
    this.editorUi = document.getElementById('editor-ui');
    this.btnOpenEditor = document.getElementById('btn-open-editor');
    this.btnEditorFloat = document.getElementById('btn-editor-float');
    this.btnEditorPlay = document.getElementById('btn-editor-play');
    this.btnEditorSave = document.getElementById('btn-editor-save');
    this.btnEditorLoad = document.getElementById('btn-editor-load');
    this.btnEditorClear = document.getElementById('btn-editor-clear');
    this.btnEditorExit = document.getElementById('btn-editor-exit');
    this.editorCoordDisplay = document.getElementById('editor-coord-display');
    this.editorCountDisplay = document.getElementById('editor-count-display');
    this.btnToolPlace = document.getElementById('btn-tool-place');
    this.btnToolDelete = document.getElementById('btn-tool-delete');
    this.chkGridSnap = document.getElementById('chk-grid-snap');
    this.paletteItems = document.querySelectorAll('.palette-item');

    // Estado del Editor de Mapas
    this.editorPlacedItems = [];
    this.editorSelectedType = 'speed_ring';
    this.editorTool = 'place';
    this.editorGridSnap = true;
    this.editorCameraZ = -30;
    this.isCustomMapMode = false;
    this.customMapFinishZ = -300;
    this.editorRaycaster = new THREE.Raycaster();
    this.editorMouse = new THREE.Vector2();
    this.editorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.editorGhostMesh = null;
    this.editorPointerPos = new THREE.Vector3(0, 0, -30);
    this.editorKeys = { forward: false, backward: false };

    // Nuevas entidades interactivas en gameplay
    this.speedRings = [];
    this.jumpPads = [];
    this.turretBullets = [];
    this.finishArch = null;

    // Estado de Obstáculos (persistente en localStorage)
    this.obstaclesEnabled = localStorage.getItem('neon_horizon_obstacles') !== 'false';

    // Botones de Modo
    this.btnMode1p = document.getElementById('btn-mode-1p');
    this.btnMode2p = document.getElementById('btn-mode-2p');
    this.btnMode3p = document.getElementById('btn-mode-3p');
    this.instructions1p = document.getElementById('instructions-1p');
    this.instructions2p = document.getElementById('instructions-2p');
    this.instructions3p = document.getElementById('instructions-3p');
    this.rulesBanner2p = document.getElementById('rules-banner-2p');
    this.rulesBanner3p = document.getElementById('rules-banner-3p');

    // Divisores de Pantalla
    this.divider2p = document.getElementById('splitscreen-divider-1');
    this.divider3pLeft = document.getElementById('splitscreen-divider-3p-left');
    this.divider3pRight = document.getElementById('splitscreen-divider-3p-right');

    // Game Mode: '1P', '2P' o '3P'
    this.gameMode = '1P';

    // Game state
    this.state = 'START';
    this.highScore = parseInt(localStorage.getItem('neon_horizon_highscore') || '0', 10);
    this.distance = 0;

    // Metas
    this.GOAL_POINTS = 10000;
    this.GOAL_METERS = 5000;

    // Movement & Speed
    this.baseSpeed = 0.85;
    this.currentSpeed = this.baseSpeed;
    this.maxSpeed = 1.9;
    this.roadWidth = 14; // 1P: 14, 2P: 28, 3P: 42 (3 vías amplias)

    // Three.js instances
    this.scene = null;
    this.camera = null;    // 1P
    this.cameraP1 = null;  // 2P / 3P
    this.cameraP2 = null;  // 2P / 3P
    this.cameraP3 = null;  // 3P
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Player 1 (Cian)
    this.p1 = {
      ship: null,
      shipLight: null,
      targetX: 0,
      currentX: 0,
      targetZ: 0,
      currentZ: 0,
      roll: 0,
      score: 0,
      distance: 0,
      speed: 0.85,
      alive: true,
      boostEnergy: 60,
      isBoosting: false,
      lastShotTime: 0,
      missileCooldown: 1.5,
      missileTimer: 0
    };

    // Player 2 (Magenta)
    this.p2 = {
      ship: null,
      shipLight: null,
      targetX: 0,
      currentX: 0,
      targetZ: 0,
      currentZ: 0,
      roll: 0,
      score: 0,
      distance: 0,
      speed: 0.85,
      alive: true,
      boostEnergy: 60,
      isBoosting: false,
      lastShotTime: 0,
      missileCooldown: 1.5,
      missileTimer: 0
    };

    // Player 3 (Amarillo - Vía 3)
    this.p3 = {
      ship: null,
      shipLight: null,
      targetX: 0,
      currentX: 0,
      targetZ: 0,
      currentZ: 0,
      roll: 0,
      score: 0,
      distance: 0,
      speed: 0.85,
      alive: true,
      boostEnergy: 60,
      isBoosting: false,
      lastShotTime: 0,
      missileCooldown: 1.5,
      missileTimer: 0
    };

    // Scene objects
    this.roadSegments = [];
    this.obstacles = [];
    this.collectibles = [];
    this.projectiles = [];
    this.particles = null;

    // Keys State
    this.keys = {
      // P1: A, D, W, Space
      p1Left: false,
      p1Right: false,
      p1Boost: false,
      // P2: Left, Right, Up, Enter
      p2Left: false,
      p2Right: false,
      p2Boost: false,
      // P3: J, L, I
      p3Left: false,
      p3Right: false,
      p3Boost: false
    };

    this.initThree();
    this.createRoad();
    this.createShips();
    this.createParticleField();
    this.setupEvents();
    this.setMode('1P');
    this.updateHUD();
    this.updateObstaclesUI();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050512, 0.007);

    const fullAspect = window.innerWidth / window.innerHeight;
    const halfAspect = (window.innerWidth / 2) / window.innerHeight;
    const thirdAspect = (window.innerWidth / 3) / window.innerHeight;

    const isPortrait = window.innerWidth < window.innerHeight;

    // Cámara 1P (FOV dinámico para móviles en portrait)
    this.camera = new THREE.PerspectiveCamera(isPortrait ? 78 : 62, fullAspect, 0.1, 450);
    this.camera.position.set(0, 4.2, 9.2);
    this.camera.lookAt(0, 1.0, -18);

    // Cámaras 2P / 3P (Perspectiva elevada desde arriba)
    this.cameraP1 = new THREE.PerspectiveCamera(72, halfAspect, 0.1, 450);
    this.cameraP1.position.set(-4.5, 4.8, 9.6);
    this.cameraP1.lookAt(-4.5, 0.8, -20);

    this.cameraP2 = new THREE.PerspectiveCamera(72, halfAspect, 0.1, 450);
    this.cameraP2.position.set(4.5, 4.8, 9.6);
    this.cameraP2.lookAt(4.5, 0.8, -20);

    this.cameraP3 = new THREE.PerspectiveCamera(86, thirdAspect, 0.1, 450);
    this.cameraP3.position.set(14, 8.2, 11.8);
    this.cameraP3.lookAt(14, 0.2, -28);

    // Cámara Editor 3D (Perspectiva isométrica/cenital inclinada de construcción)
    this.editorCamera = new THREE.PerspectiveCamera(60, fullAspect, 0.1, 900);
    this.editorCamera.position.set(0, 16, this.editorCameraZ + 20);
    this.editorCamera.lookAt(0, 0, this.editorCameraZ - 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.autoClear = false;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x281840, 1.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    dirLight.position.set(20, 40, -20);
    this.scene.add(dirLight);

    const pinkLight = new THREE.PointLight(0xff007f, 3.5, 70);
    pinkLight.position.set(0, 6, -10);
    this.scene.add(pinkLight);

    // Texturas personalizadas para barreras según diseños de referencia
    // Barreras amarillas: Se rompen solo con misiles
    this.yellowBarrierTexture = this.createHazardTexture('#ffe600', '#e62020');
    // Barreras rojas: Se rompen con disparos normales (y misiles)
    this.redBarrierTexture = this.createHazardTexture('#9c3d9c', '#e62020');
    this.destructibleBarrierTexture = this.yellowBarrierTexture;
    this.indestructibleBarrierTexture = this.redBarrierTexture;
  }

  createHazardTexture(bgColor, stripeColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    // 1. Fondo base
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Franjas diagonales rojas inclinadas con bordes negros (inclinación /)
    const stripeWidth = 65;
    const slope = 80;
    const stripePositions = [25, 260, 495];

    for (const x of stripePositions) {
      ctx.beginPath();
      ctx.moveTo(x, canvas.height);
      ctx.lineTo(x + stripeWidth, canvas.height);
      ctx.lineTo(x + stripeWidth + slope, 0);
      ctx.lineTo(x + slope, 0);
      ctx.closePath();

      // Relleno de franja
      ctx.fillStyle = stripeColor;
      ctx.fill();

      // Bordes negros de cada franja diagonal
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    }

    // 3. Borde negro exterior de todo el rectángulo
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  buildYellowBarrierGroup(laneX, z = -220) {
    const barrierGroup = new THREE.Group();

    // Viga principal con diseño de franjas amarillas y rojas (se rompe con misil)
    const beamGeo = new THREE.BoxGeometry(3.6, 0.72, 0.22);
    const beamMat = new THREE.MeshBasicMaterial({
      map: this.yellowBarrierTexture
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 0;
    barrierGroup.add(beamMesh);

    // Marco posterior de refuerzo metálico oscuro
    const frameGeo = new THREE.BoxGeometry(3.7, 0.78, 0.16);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x111118,
      metalness: 0.9,
      roughness: 0.3
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.z = -0.04;
    barrierGroup.add(frameMesh);

    // Postes laterales de soporte
    const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.8, 10);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      metalness: 0.8,
      roughness: 0.2
    });

    const postLeft = new THREE.Mesh(postGeo, postMat);
    postLeft.position.set(-1.85, 0, 0);
    barrierGroup.add(postLeft);

    const postRight = new THREE.Mesh(postGeo, postMat);
    postRight.position.set(1.85, 0, 0);
    barrierGroup.add(postRight);

    // Balizas amarillas en la cúspide de los postes
    const beaconGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });

    const beaconLeft = new THREE.Mesh(beaconGeo, beaconMat);
    beaconLeft.position.set(-1.85, 0.95, 0);
    barrierGroup.add(beaconLeft);

    const beaconRight = new THREE.Mesh(beaconGeo, beaconMat);
    beaconRight.position.set(1.85, 0.95, 0);
    barrierGroup.add(beaconRight);

    // Luz de advertencia ámbar
    const warningLight = new THREE.PointLight(0xffaa00, 1.4, 7);
    warningLight.position.set(0, 0.4, 0.3);
    barrierGroup.add(warningLight);

    barrierGroup.position.set(laneX, 1.1, z);
    return barrierGroup;
  }

  createYellowBarrier(laneX) {
    const barrierGroup = this.buildYellowBarrierGroup(laneX, -220);
    this.scene.add(barrierGroup);
    return barrierGroup;
  }

  buildRedBarrierGroup(laneX, z = -220) {
    const barrierGroup = new THREE.Group();

    // Viga principal con diseño de franjas rojas (se rompe con disparos)
    const beamGeo = new THREE.BoxGeometry(3.6, 0.72, 0.22);
    const beamMat = new THREE.MeshBasicMaterial({
      map: this.redBarrierTexture
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 0;
    barrierGroup.add(beamMesh);

    // Marco posterior de refuerzo metálico oscuro blindado
    const frameGeo = new THREE.BoxGeometry(3.7, 0.78, 0.16);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0e0e14,
      metalness: 0.95,
      roughness: 0.15
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.z = -0.04;
    barrierGroup.add(frameMesh);

    // Postes laterales reforzados de acero
    const postGeo = new THREE.CylinderGeometry(0.19, 0.23, 1.8, 10);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f28,
      metalness: 0.85,
      roughness: 0.2
    });

    const postLeft = new THREE.Mesh(postGeo, postMat);
    postLeft.position.set(-1.85, 0, 0);
    barrierGroup.add(postLeft);

    const postRight = new THREE.Mesh(postGeo, postMat);
    postRight.position.set(1.85, 0, 0);
    barrierGroup.add(postRight);

    // Balizas rojas brillantes de peligro en la cúspide de los postes
    const beaconGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });

    const beaconLeft = new THREE.Mesh(beaconGeo, beaconMat);
    beaconLeft.position.set(-1.85, 0.95, 0);
    barrierGroup.add(beaconLeft);

    const beaconRight = new THREE.Mesh(beaconGeo, beaconMat);
    beaconRight.position.set(1.85, 0.95, 0);
    barrierGroup.add(beaconRight);

    // Luz de advertencia roja de neón
    const warningLight = new THREE.PointLight(0xff0044, 1.4, 7);
    warningLight.position.set(0, 0.4, 0.3);
    barrierGroup.add(warningLight);

    barrierGroup.position.set(laneX, 1.1, z);
    return barrierGroup;
  }

  createRedBarrier(laneX) {
    const barrierGroup = this.buildRedBarrierGroup(laneX, -220);
    this.scene.add(barrierGroup);
    return barrierGroup;
  }

  createDestructibleBarrier(laneX) {
    return this.createYellowBarrier(laneX);
  }

  createIndestructibleBarrier(laneX) {
    return this.createRedBarrier(laneX);
  }

  // =========================================================================
  // CREADORES 3D DE ELEMENTOS DEL MODO EDITOR
  // =========================================================================

  // 1. ⚡ Anillo de Hipervelocidad (Speed Ring): Duplica velocidad y 100% turbo
  createSpeedRing(x, z) {
    const group = new THREE.Group();

    // Aro exterior de neón cian
    const outerGeo = new THREE.TorusGeometry(2.4, 0.16, 16, 36);
    const outerMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerMesh.position.y = 2.4;
    group.add(outerMesh);

    // Anillo concéntrico interior de aceleración amarillo
    const innerGeo = new THREE.TorusGeometry(1.85, 0.08, 12, 28);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.position.y = 2.4;
    group.add(innerMesh);

    // 4 Módulos inductores magnéticos en el anillo
    for (let i = 0; i < 4; i++) {
      const podGeo = new THREE.BoxGeometry(0.35, 0.35, 0.65);
      const podMat = new THREE.MeshStandardMaterial({ color: 0x181a28, metalness: 0.9, roughness: 0.2 });
      const pod = new THREE.Mesh(podGeo, podMat);
      const angle = (i * Math.PI) / 2;
      pod.position.set(Math.cos(angle) * 2.4, 2.4 + Math.sin(angle) * 2.4, 0);
      group.add(pod);
    }

    // Pilones laterales de soporte anclados al pavimento
    const pylonGeo = new THREE.CylinderGeometry(0.12, 0.18, 2.4, 8);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x141624, metalness: 0.85 });

    const pLeft = new THREE.Mesh(pylonGeo, pylonMat);
    pLeft.position.set(-2.4, 1.2, 0);
    group.add(pLeft);

    const pRight = new THREE.Mesh(pylonGeo, pylonMat);
    pRight.position.set(2.4, 1.2, 0);
    group.add(pRight);

    // Luz ambiental del anillo
    const ringLight = new THREE.PointLight(0x00f0ff, 2.4, 12);
    ringLight.position.set(0, 2.4, 0);
    group.add(ringLight);

    group.position.set(x, 0, z);
    group.userData = { outerMesh, innerMesh, ringLight };
    return group;
  }

  // 2. 🔼 Rampa de Salto Cuántica (Jump Pad): Catapulta la nave por los aires
  createJumpPad(x, z) {
    const group = new THREE.Group();

    // Rampa inclinada aerodinámica
    const baseGeo = new THREE.BoxGeometry(3.4, 0.32, 3.2);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0d1220, metalness: 0.9, roughness: 0.25 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, 0.16, 0);
    baseMesh.rotation.x = 0.14;
    group.add(baseMesh);

    // 3 Flechas luminosas chevron de propulsión hacia arriba
    for (let c = -1; c <= 1; c++) {
      const chevGeo = new THREE.BoxGeometry(2.2, 0.08, 0.3);
      const chevMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa });
      const chev = new THREE.Mesh(chevGeo, chevMat);
      chev.position.set(0, 0.34, c * 0.85);
      chev.rotation.x = 0.14;
      group.add(chev);
    }

    // Bordes laterales reflectantes cian
    const edgeGeo = new THREE.BoxGeometry(0.12, 0.44, 3.2);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const eLeft = new THREE.Mesh(edgeGeo, edgeMat);
    eLeft.position.set(-1.65, 0.22, 0);
    eLeft.rotation.x = 0.14;
    group.add(eLeft);

    const eRight = new THREE.Mesh(edgeGeo, edgeMat);
    eRight.position.set(1.65, 0.22, 0);
    eRight.rotation.x = 0.14;
    group.add(eRight);

    // Halo lumínico verde esmeralda
    const padLight = new THREE.PointLight(0x00ffaa, 2.0, 9);
    padLight.position.set(0, 0.5, 0);
    group.add(padLight);

    group.position.set(x, 0, z);
    return group;
  }

  // 3. 🎯 Torreta Láser Centinela (Turret): Apunta y dispara proyectiles hacia el jugador
  createTurret(x, z) {
    const group = new THREE.Group();

    // Base octagonal blindada
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.8, 0.65, 8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x161826, metalness: 0.95, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.32;
    group.add(base);

    // Cúpula esférica giratoria
    const domeGeo = new THREE.SphereGeometry(0.8, 12, 12);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0x24101c, metalness: 0.85, roughness: 0.15 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.85;
    group.add(dome);

    // Cañones gemelos de plasma
    for (const off of [-0.32, 0.32]) {
      const barrelGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.5, 8);
      barrelGeo.rotateX(Math.PI / 2);
      const barrelMat = new THREE.MeshStandardMaterial({ color: 0x0f1118, metalness: 0.95 });
      const barrel = new THREE.Mesh(barrelGeo, barrelMat);
      barrel.position.set(off, 0.85, 0.9);
      group.add(barrel);

      // Bocacha incandescente roja
      const tipGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.2, 8);
      tipGeo.rotateX(Math.PI / 2);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(off, 0.85, 1.65);
      group.add(tip);
    }

    // Rayo láser guía de apuntado hacia adelante
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 22, 6);
    beamGeo.rotateX(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0033, transparent: true, opacity: 0.4 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 0.85, 11.5);
    group.add(beam);

    // Luz roja de advertencia de centinela
    const turretLight = new THREE.PointLight(0xff0044, 2.5, 11);
    turretLight.position.set(0, 1.2, 0.6);
    group.add(turretLight);

    group.position.set(x, 0, z);
    group.userData = { dome, beam, turretLight };
    return group;
  }

  // 4. 🌀 Vórtice Gravitatorio (Gravity Well): Atrae vehículos a su núcleo
  createGravityWell(x, z) {
    const group = new THREE.Group();

    // Núcleo singular negro/púrpura
    const coreGeo = new THREE.SphereGeometry(0.85, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x050010,
      emissive: 0x330033,
      metalness: 0.9,
      roughness: 0.1
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 1.3;
    group.add(core);

    // Anillo de acreción magenta inclinado 1
    const r1Geo = new THREE.TorusGeometry(1.9, 0.12, 8, 28);
    const r1Mat = new THREE.MeshBasicMaterial({ color: 0xff00cc });
    const ring1 = new THREE.Mesh(r1Geo, r1Mat);
    ring1.position.y = 1.3;
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    // Anillo de acreción púrpura inclinado 2
    const r2Geo = new THREE.TorusGeometry(2.5, 0.08, 8, 32);
    const r2Mat = new THREE.MeshBasicMaterial({ color: 0x9d00ff });
    const ring2 = new THREE.Mesh(r2Geo, r2Mat);
    ring2.position.y = 1.3;
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // Espiral de vórtice sobre el pavimento
    const groundGeo = new THREE.RingGeometry(0.5, 2.8, 16);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x660099, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
    const groundRing = new THREE.Mesh(groundGeo, groundMat);
    groundRing.position.y = 0.05;
    group.add(groundRing);

    // Luz puntual violeta pulsante
    const vortexLight = new THREE.PointLight(0xcc00ff, 3.2, 14);
    vortexLight.position.set(0, 1.3, 0);
    group.add(vortexLight);

    group.position.set(x, 0, z);
    group.userData = { ring1, ring2, groundRing, vortexLight };
    return group;
  }

  // Barrera Amarilla (solo destruible con misiles) para colocar en coordenadas exactas
  createYellowBarrierMesh(x, z) {
    return this.buildYellowBarrierGroup(x, z);
  }

  // Barrera Roja (destruible con balas y misiles) para colocar en coordenadas exactas
  createRedBarrierMesh(x, z) {
    return this.buildRedBarrierGroup(x, z);
  }

  // Planeta / Mina para colocar en coordenadas exactas
  createPlanetMesh(x, z) {
    const mineGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mineGroup.add(coreMesh);

    const ringGeo = new THREE.TorusGeometry(1.4, 0.1, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    mineGroup.add(ringMesh);

    mineGroup.position.set(x, 1.2, z);
    mineGroup.userData = { ring: ringMesh };
    return mineGroup;
  }

  // Núcleo de Energía (Orbe) para colocar en coordenadas exactas
  createEnergyCoreMesh(x, z) {
    const coreGroup = new THREE.Group();
    const gemGeo = new THREE.OctahedronGeometry(0.7, 0);
    const gemMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    coreGroup.add(gem);

    const haloGeo = new THREE.RingGeometry(0.85, 1.15, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    coreGroup.add(halo);

    coreGroup.position.set(x, 1.1, z);
    coreGroup.userData = { halo };
    return coreGroup;
  }

  // Arco Holográfico de Meta / Llegada para circuitos personalizados
  createFinishArch(z) {
    const group = new THREE.Group();
    const archWidth = this.roadWidth + 4;

    // Postes laterales neón
    const pillarGeo = new THREE.BoxGeometry(0.7, 10, 0.7);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x121422, metalness: 0.9 });

    const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
    pLeft.position.set(-archWidth / 2, 5, 0);
    group.add(pLeft);

    const pRight = new THREE.Mesh(pillarGeo, pillarMat);
    pRight.position.set(archWidth / 2, 5, 0);
    group.add(pRight);

    // Tiras luminosas en postes
    const stripeGeo = new THREE.BoxGeometry(0.1, 9.8, 0.75);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const sLeft = new THREE.Mesh(stripeGeo, stripeMat);
    sLeft.position.set(-archWidth / 2 + 0.35, 5, 0);
    group.add(sLeft);

    const sRight = new THREE.Mesh(stripeGeo, stripeMat);
    sRight.position.set(archWidth / 2 - 0.35, 5, 0);
    group.add(sRight);

    // Viga superior horizontal
    const beamGeo = new THREE.BoxGeometry(archWidth, 1.2, 1.0);
    const beam = new THREE.Mesh(beamGeo, pillarMat);
    beam.position.set(0, 9.5, 0);
    group.add(beam);

    // Cartel luminoso "FINISH / META"
    const signGeo = new THREE.PlaneGeometry(archWidth * 0.65, 1.4);
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const sctx = signCanvas.getContext('2d');
    sctx.fillStyle = '#0a0a18';
    sctx.fillRect(0, 0, 512, 128);
    sctx.strokeStyle = '#ffe600';
    sctx.lineWidth = 8;
    sctx.strokeRect(4, 4, 504, 120);
    sctx.fillStyle = '#ffe600';
    sctx.font = 'bold 36px Orbitron, monospace, sans-serif';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.fillText('🏆 META DEL EDITOR 🏆', 256, 64);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, 8.5, 0.55);
    group.add(signMesh);

    // Cortina láser de meta
    const curtainGeo = new THREE.PlaneGeometry(this.roadWidth, 6);
    const curtainMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    const curtain = new THREE.Mesh(curtainGeo, curtainMat);
    curtain.position.set(0, 3, 0);
    group.add(curtain);

    const archLight = new THREE.PointLight(0x00f0ff, 4.0, 30);
    archLight.position.set(0, 8, 0);
    group.add(archLight);

    group.position.set(0, 0, z);
    return group;
  }

  // Fábrica para construir el mesh visual según el tipo de objeto
  buildItemMesh(type, x, z) {
    switch (type) {
      case 'speed_ring': return this.createSpeedRing(x, z);
      case 'jump_pad': return this.createJumpPad(x, z);
      case 'turret': return this.createTurret(x, z);
      case 'gravity_well': return this.createGravityWell(x, z);
      case 'yellow_barrier': return this.createYellowBarrierMesh(x, z);
      case 'red_barrier': return this.createRedBarrierMesh(x, z);
      case 'planet': return this.createPlanetMesh(x, z);
      case 'energy_core': return this.createEnergyCoreMesh(x, z);
      default: return this.createSpeedRing(x, z);
    }
  }

  // Crea el cursor holográfico / fantasma semitransparente del elemento seleccionado
  createGhostMesh(type) {
    if (this.editorGhostMesh) {
      this.scene.remove(this.editorGhostMesh);
      this.editorGhostMesh = null;
    }

    const ghostGroup = new THREE.Group();
    let geo;

    if (type === 'speed_ring') {
      geo = new THREE.TorusGeometry(2.3, 0.16, 12, 24);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.6 }));
      m.position.y = 2.4;
      ghostGroup.add(m);
    } else if (type === 'jump_pad') {
      geo = new THREE.BoxGeometry(3.4, 0.32, 3.2);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x00ffaa, wireframe: true, transparent: true, opacity: 0.6 }));
      m.position.y = 0.16;
      m.rotation.x = 0.14;
      ghostGroup.add(m);
    } else if (type === 'turret') {
      geo = new THREE.CylinderGeometry(1.4, 1.8, 0.65, 8);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff0044, wireframe: true, transparent: true, opacity: 0.6 }));
      m.position.y = 0.32;
      ghostGroup.add(m);
    } else if (type === 'gravity_well') {
      geo = new THREE.SphereGeometry(0.85, 12, 12);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xcc00ff, wireframe: true, transparent: true, opacity: 0.6 }));
      m.position.y = 1.3;
      ghostGroup.add(m);
    } else if (type === 'yellow_barrier' || type === 'red_barrier') {
      geo = new THREE.BoxGeometry(3.6, 0.72, 0.22);
      const col = (type === 'yellow_barrier') ? 0xffe600 : 0xff0033;
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.6 }));
      m.position.y = 1.1;
      ghostGroup.add(m);
    } else if (type === 'planet') {
      geo = new THREE.IcosahedronGeometry(0.9, 1);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff9900, wireframe: true, transparent: true, opacity: 0.6 }));
      m.position.y = 1.2;
      ghostGroup.add(m);
    } else {
      geo = new THREE.OctahedronGeometry(0.7, 0);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.6 }));
      m.position.y = 1.1;
      ghostGroup.add(m);
    }

    // Indicador circular de suelo para posición exacta
    const floorGeo = new THREE.RingGeometry(0.3, 1.6, 16);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMesh = new THREE.Mesh(floorGeo, new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 }));
    floorMesh.position.y = 0.05;
    ghostGroup.add(floorMesh);

    this.scene.add(ghostGroup);
    this.editorGhostMesh = ghostGroup;
  }

  updateGhostMesh() {
    this.createGhostMesh(this.editorSelectedType);
  }

  // =========================================================================
  // GESTIÓN Y CICLO DE VIDA DEL EDITOR
  // =========================================================================

  enterEditor() {
    this.state = 'EDITOR';
    this.updateMobileControlsVisibility();
    window.audioManager.stopMusic();

    // Ocultar menús y HUD regular
    this.startScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
    this.gameoverScreen.classList.add('hidden');
    const hud = document.getElementById('hud');
    if (hud) hud.style.display = 'none';

    // Mostrar overlay del Editor
    if (this.editorUi) {
      this.editorUi.classList.remove('hidden');
    }

    // Ocultar naves durante la edición
    if (this.p1.ship) this.p1.ship.visible = false;
    if (this.p2.ship) this.p2.ship.visible = false;
    if (this.p3.ship) this.p3.ship.visible = false;

    // Limpiar entidades de juego activas
    for (const obj of [...this.obstacles, ...this.collectibles, ...this.projectiles, ...this.speedRings, ...this.jumpPads, ...this.turretBullets]) {
      if (obj && obj.mesh) this.scene.remove(obj.mesh);
    }
    this.obstacles = [];
    this.collectibles = [];
    this.projectiles = [];
    this.speedRings = [];
    this.jumpPads = [];
    this.turretBullets = [];
    if (this.finishArch) {
      this.scene.remove(this.finishArch);
      this.finishArch = null;
    }

    // Centrar cámara del editor
    this.editorCameraZ = -40;
    this.editorCamera.position.set(0, 16, this.editorCameraZ + 20);
    this.editorCamera.lookAt(0, 0, this.editorCameraZ - 8);

    // Asegurar carretera de 1 carril para diseño estándar
    this.roadWidth = 14;
    this.createRoad();
    this.updateEditorRoad();

    // Cargar mapa previo si no hay items colocados en memoria
    if (this.editorPlacedItems.length === 0) {
      this.loadCustomMap();
    } else {
      // Re-agregar a la escena los items colocados
      for (const item of this.editorPlacedItems) {
        if (!item.mesh) {
          item.mesh = this.buildItemMesh(item.type, item.x, item.z);
        }
        this.scene.add(item.mesh);
      }
    }

    this.updateGhostMesh();
    this.updateEditorCount();
  }

  exitEditor() {
    if (this.editorGhostMesh) {
      this.scene.remove(this.editorGhostMesh);
      this.editorGhostMesh = null;
    }

    // Remover visuales de items colocados de la escena para no interferir en menú
    for (const item of this.editorPlacedItems) {
      if (item.mesh) {
        this.scene.remove(item.mesh);
        item.mesh = null;
      }
    }

    if (this.editorUi) {
      this.editorUi.classList.add('hidden');
    }
    const hud = document.getElementById('hud');
    if (hud) hud.style.display = 'block';

    this.openStartScreen();
  }

  saveCustomMap() {
    const data = this.editorPlacedItems.map(item => ({
      type: item.type,
      x: Number(item.x.toFixed(2)),
      z: Number(item.z.toFixed(2))
    }));

    try {
      localStorage.setItem('neon_horizon_custom_map', JSON.stringify(data));
      if (this.btnEditorSave) {
        const originalText = this.btnEditorSave.innerText;
        this.btnEditorSave.innerText = '✔ GUARDADO';
        this.btnEditorSave.style.background = 'rgba(0, 255, 136, 0.35)';
        setTimeout(() => {
          this.btnEditorSave.innerText = originalText;
          this.btnEditorSave.style.background = '';
        }, 1200);
      }
    } catch (e) {
      console.warn('Error guardando mapa personalizado:', e);
    }
  }

  loadCustomMap() {
    let items = [];
    try {
      const raw = localStorage.getItem('neon_horizon_custom_map');
      if (raw) items = JSON.parse(raw);
    } catch (e) {
      items = [];
    }

    if (!items || items.length === 0) {
      items = this.getDefaultStarterCourse();
    }

    this.clearCustomMap(false);

    for (const item of items) {
      this.placeItem(item.type, item.x, item.z);
    }

    if (this.btnEditorLoad) {
      const originalText = this.btnEditorLoad.innerText;
      this.btnEditorLoad.innerText = '✔ CARGADO';
      this.btnEditorLoad.style.background = 'rgba(0, 240, 255, 0.35)';
      setTimeout(() => {
        this.btnEditorLoad.innerText = originalText;
        this.btnEditorLoad.style.background = '';
      }, 1200);
    }
  }

  clearCustomMap(confirmUser = true) {
    if (confirmUser && this.editorPlacedItems.length > 0) {
      const confirmClear = window.confirm('¿Deseas vaciar todos los objetos de la pista?');
      if (!confirmClear) return;
    }

    for (const item of this.editorPlacedItems) {
      if (item.mesh) {
        this.scene.remove(item.mesh);
      }
    }
    this.editorPlacedItems = [];
    this.updateEditorCount();
  }

  playCustomMap() {
    if (this.editorPlacedItems.length === 0) {
      this.loadCustomMap();
    }

    this.saveCustomMap();
    this.isCustomMapMode = true;

    if (this.editorGhostMesh) {
      this.scene.remove(this.editorGhostMesh);
      this.editorGhostMesh = null;
    }

    // Quitar los meshes de edición (se crearán como entidades activas del juego)
    for (const item of this.editorPlacedItems) {
      if (item.mesh) {
        this.scene.remove(item.mesh);
        item.mesh = null;
      }
    }

    if (this.editorUi) {
      this.editorUi.classList.add('hidden');
    }
    const hud = document.getElementById('hud');
    if (hud) hud.style.display = 'block';

    // Lanzar partida en 1P con el circuito diseñado
    this.setMode('1P');
    this.startGame();
  }

  setEditorTool(tool) {
    this.editorTool = tool;
    if (this.btnToolPlace) this.btnToolPlace.classList.toggle('active', tool === 'place');
    if (this.btnToolDelete) this.btnToolDelete.classList.toggle('active', tool === 'delete');
    if (this.editorGhostMesh) {
      this.editorGhostMesh.visible = (tool === 'place');
    }
  }

  selectPaletteType(type) {
    this.editorSelectedType = type;
    this.paletteItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-type') === type);
    });
    this.setEditorTool('place');
    this.updateGhostMesh();
  }

  placeItem(type, x, z) {
    // Si ya hay un elemento muy cerca en esa posición, removerlo primero
    const existing = this.editorPlacedItems.find(i => Math.abs(i.x - x) < 1.2 && Math.abs(i.z - z) < 2.5);
    if (existing) {
      this.removeItem(existing);
    }

    const mesh = this.buildItemMesh(type, x, z);
    this.scene.add(mesh);

    const item = {
      id: Date.now() + Math.random(),
      type,
      x: Number(x.toFixed(2)),
      z: Number(z.toFixed(2)),
      mesh
    };
    this.editorPlacedItems.push(item);

    window.audioManager.playLaser();
    this.updateEditorCount();
  }

  deleteItemNear(x, z) {
    const target = this.editorPlacedItems.find(i => Math.abs(i.x - x) < 2.5 && Math.abs(i.z - z) < 3.5);
    if (target) {
      this.removeItem(target);
      window.audioManager.playCrash();
      this.updateEditorCount();
    }
  }

  removeItem(item) {
    if (item && item.mesh) {
      this.scene.remove(item.mesh);
    }
    this.editorPlacedItems = this.editorPlacedItems.filter(i => i !== item);
  }

  updateEditorCount() {
    if (this.editorCountDisplay) {
      this.editorCountDisplay.innerText = `OBJETOS: ${this.editorPlacedItems.length}`;
    }
  }

  // Circuito de demostración predeterminado con todas las novedades listas para jugar
  getDefaultStarterCourse() {
    return [
      { type: 'speed_ring', x: 0, z: -40 },
      { type: 'jump_pad', x: 0, z: -90 },
      { type: 'red_barrier', x: 0, z: -115 },   // ¡La rampa de salto te permite saltarla!
      { type: 'turret', x: 2.4, z: -170 },
      { type: 'yellow_barrier', x: -2.4, z: -210 },
      { type: 'gravity_well', x: 2.4, z: -270 },
      { type: 'speed_ring', x: -2.4, z: -320 },
      { type: 'planet', x: 0, z: -370 },
      { type: 'energy_core', x: -2.4, z: -420 },
      { type: 'energy_core', x: 0, z: -435 },
      { type: 'energy_core', x: 2.4, z: -450 }
    ];
  }

  // Disparo de plasma lanzado por la torreta enemiga
  fireTurretBolt(x, y, z) {
    const boltGeo = new THREE.SphereGeometry(0.35, 10, 10);
    const boltMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const boltMesh = new THREE.Mesh(boltGeo, boltMat);
    boltMesh.position.set(x, y, z);

    const light = new THREE.PointLight(0xff0044, 2.5, 9);
    boltMesh.add(light);

    this.scene.add(boltMesh);
    this.turretBullets.push({ mesh: boltMesh, speed: 2.2 });
    window.audioManager.playLaser();
  }

  // Desplaza los segmentos de carretera en el editor para que cubran siempre la cámara
  updateEditorRoad() {
    const segmentLength = 80;
    const targetCenterZ = Math.floor(this.editorCameraZ / segmentLength) * segmentLength;
    const num = this.roadSegments.length;
    const half = Math.floor(num / 2);
    for (let i = 0; i < num; i++) {
      const seg = this.roadSegments[i];
      seg.position.z = targetCenterZ + (half - i) * segmentLength;
    }
  }

  // Bucle de actualización en modo editor
  updateEditor(delta) {
    const panSpeed = 65 * delta;
    if (this.editorKeys.forward) {
      this.editorCameraZ = Math.max(-1400, this.editorCameraZ - panSpeed);
    }
    if (this.editorKeys.backward) {
      this.editorCameraZ = Math.min(0, this.editorCameraZ + panSpeed);
    }

    this.editorCamera.position.set(0, 16, this.editorCameraZ + 20);
    this.editorCamera.lookAt(0, 0, this.editorCameraZ - 8);

    this.updateEditorRoad();

    // Animación visual de items colocados para que el mapa se sienta vivo
    const time = this.clock.getElapsedTime();
    for (const item of this.editorPlacedItems) {
      if (!item.mesh) continue;
      if (item.type === 'speed_ring') {
        item.mesh.rotation.z = Math.sin(time * 2) * 0.08;
      } else if (item.type === 'gravity_well') {
        if (item.mesh.userData.ring1) item.mesh.userData.ring1.rotation.x += 2.5 * delta;
        if (item.mesh.userData.ring2) item.mesh.userData.ring2.rotation.y += 3.5 * delta;
      } else if (item.type === 'planet') {
        if (item.mesh.userData.ring) item.mesh.userData.ring.rotation.z += 3.0 * delta;
      } else if (item.type === 'energy_core') {
        if (item.mesh.userData.halo) item.mesh.userData.halo.rotation.z += 4.0 * delta;
        item.mesh.rotation.y += 2.0 * delta;
      }
    }

    // Efecto de pulso en el cursor holográfico
    if (this.editorGhostMesh && this.editorGhostMesh.visible) {
      const pulse = 1 + Math.sin(time * 8) * 0.06;
      this.editorGhostMesh.scale.set(pulse, pulse, pulse);
    }
  }

  // Configuración de eventos específicos del Editor
  setupEditorEvents() {
    if (this.btnOpenEditor) {
      this.btnOpenEditor.addEventListener('click', () => this.enterEditor());
    }
    if (this.btnEditorFloat) {
      this.btnEditorFloat.addEventListener('click', () => {
        if (this.state === 'EDITOR') this.exitEditor();
        else this.enterEditor();
      });
    }

    if (this.btnEditorPlay) this.btnEditorPlay.addEventListener('click', () => this.playCustomMap());
    if (this.btnEditorSave) this.btnEditorSave.addEventListener('click', () => this.saveCustomMap());
    if (this.btnEditorLoad) this.btnEditorLoad.addEventListener('click', () => this.loadCustomMap());
    if (this.btnEditorClear) this.btnEditorClear.addEventListener('click', () => this.clearCustomMap());
    if (this.btnEditorExit) this.btnEditorExit.addEventListener('click', () => this.exitEditor());

    if (this.btnToolPlace) this.btnToolPlace.addEventListener('click', () => this.setEditorTool('place'));
    if (this.btnToolDelete) this.btnToolDelete.addEventListener('click', () => this.setEditorTool('delete'));

    if (this.chkGridSnap) {
      this.chkGridSnap.addEventListener('change', (e) => {
        this.editorGridSnap = e.target.checked;
      });
    }

    // Selección de elementos en la paleta inferior
    this.paletteItems.forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        this.selectPaletteType(type);
      });
    });

    // Raycasting sobre el plano de la carretera en pointermove
    window.addEventListener('pointermove', (e) => {
      if (this.state !== 'EDITOR') return;

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.editorMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.editorMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.editorRaycaster.setFromCamera(this.editorMouse, this.editorCamera);
      const intersection = new THREE.Vector3();

      if (this.editorRaycaster.ray.intersectPlane(this.editorPlane, intersection)) {
        let snapX = intersection.x;
        let snapZ = intersection.z;

        if (this.editorGridSnap) {
          // Ajuste a carriles: -4.8, -2.4, 0, 2.4, 4.8
          snapX = Math.round(snapX / 2.4) * 2.4;
          snapX = Math.max(-4.8, Math.min(4.8, snapX));
          snapZ = Math.round(snapZ / 5) * 5;
        }

        this.editorPointerPos.set(snapX, 0, snapZ);

        if (this.editorGhostMesh) {
          this.editorGhostMesh.position.set(snapX, 0, snapZ);
          this.editorGhostMesh.visible = (this.editorTool === 'place');
        }

        const laneNum = Math.round(snapX / 2.4);
        const laneLabel = laneNum === 0 ? 'CENTRO (0)' : (laneNum < 0 ? `IZQ (${laneNum})` : `DER (+${laneNum})`);
        if (this.editorCoordDisplay) {
          this.editorCoordDisplay.innerText = `Z: ${Math.round(snapZ)} m | CARRIL: ${laneLabel}`;
        }
      }
    });

    // Clic para colocar o borrar objetos en el canvas
    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      if (this.state !== 'EDITOR') return;
      if (e.target !== this.renderer.domElement) return;

      const isRightClick = (e.button === 2);
      if (isRightClick || this.editorTool === 'delete') {
        this.deleteItemNear(this.editorPointerPos.x, this.editorPointerPos.z);
      } else if (e.button === 0 && this.editorTool === 'place') {
        this.placeItem(this.editorSelectedType, this.editorPointerPos.x, this.editorPointerPos.z);
      }
    });

    // Evitar menú contextual con clic derecho en el editor
    this.renderer.domElement.addEventListener('contextmenu', (e) => {
      if (this.state === 'EDITOR') e.preventDefault();
    });

    // Rueda del ratón para desplazamiento longitudinal Z
    this.renderer.domElement.addEventListener('wheel', (e) => {
      if (this.state !== 'EDITOR') return;
      e.preventDefault();
      const deltaZ = Math.sign(e.deltaY) * 16;
      this.editorCameraZ = Math.min(0, Math.max(-1400, this.editorCameraZ + deltaZ));
    }, { passive: false });
  }

  createRoad() {
    for (const seg of this.roadSegments) {
      this.scene.remove(seg);
    }
    this.roadSegments = [];

    const segmentLength = 80;
    const numSegments = 5;
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, segmentLength, 10, 20);
    roadGeo.rotateX(-Math.PI / 2);

    for (let i = 0; i < numSegments; i++) {
      const roadMat = new THREE.MeshStandardMaterial({
        color: 0x080816,
        roughness: 0.2,
        metalness: 0.85
      });
      const mesh = new THREE.Mesh(roadGeo, roadMat);
      mesh.position.z = -i * segmentLength;
      mesh.position.y = 0;
      this.scene.add(mesh);

      // Bordes exteriores
      const borderGeo = new THREE.BoxGeometry(0.4, 0.2, segmentLength);
      const borderMatL = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const borderMatR = new THREE.MeshBasicMaterial({ color: 0xff007f });

      const borderLeft = new THREE.Mesh(borderGeo, borderMatL);
      borderLeft.position.set(-this.roadWidth / 2, 0.1, 0);
      mesh.add(borderLeft);

      const borderRight = new THREE.Mesh(borderGeo, borderMatR);
      borderRight.position.set(this.roadWidth / 2, 0.1, 0);
      mesh.add(borderRight);

      if (this.gameMode === '1P') {
        const centerLineGeo = new THREE.BoxGeometry(0.18, 0.1, segmentLength);
        const centerMat = new THREE.MeshBasicMaterial({ color: 0x9d00ff });
        const centerLine = new THREE.Mesh(centerLineGeo, centerMat);
        centerLine.position.set(0, 0.05, 0);
        mesh.add(centerLine);
      } else if (this.gameMode === '2P') {
        // Muro central en 2P
        const wallGeo = new THREE.BoxGeometry(0.25, 1.4, segmentLength);
        const wallMat = new THREE.MeshBasicMaterial({
          color: 0x9d00ff,
          transparent: true,
          opacity: 0.75
        });
        const dividerWall = new THREE.Mesh(wallGeo, wallMat);
        dividerWall.position.set(0, 0.7, 0);
        mesh.add(dividerWall);
      } else if (this.gameMode === '3P') {
        // 2 Muros divisorios de neón para separar las 3 VÍAS
        const wallGeo = new THREE.BoxGeometry(0.25, 1.4, segmentLength);
        const wallMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });
        const wallMat2 = new THREE.MeshBasicMaterial({ color: 0xff007f, transparent: true, opacity: 0.8 });

        // Divisor 1 entre Vía 1 y Vía 2 (a -roadWidth/6 = -7)
        const wall1 = new THREE.Mesh(wallGeo, wallMat1);
        wall1.position.set(-this.roadWidth / 6, 0.7, 0);
        mesh.add(wall1);

        // Divisor 2 entre Vía 2 y Vía 3 (a +roadWidth/6 = +7)
        const wall2 = new THREE.Mesh(wallGeo, wallMat2);
        wall2.position.set(this.roadWidth / 6, 0.7, 0);
        mesh.add(wall2);
      }

      this.roadSegments.push(mesh);
    }
  }

  createShips() {
    // P1 (Cian)
    if (this.p1.ship) this.scene.remove(this.p1.ship);
    this.p1.ship = this.buildShipMesh(0x00f0ff, 0xff007f);
    this.p1.shipLight = new THREE.PointLight(0x00f0ff, 3, 12);
    this.p1.shipLight.position.set(0, 0.2, 2.2);
    this.p1.ship.add(this.p1.shipLight);
    this.scene.add(this.p1.ship);

    // P2 (Magenta)
    if (this.p2.ship) this.scene.remove(this.p2.ship);
    this.p2.ship = this.buildShipMesh(0xff007f, 0x00f0ff);
    this.p2.shipLight = new THREE.PointLight(0xff007f, 3, 12);
    this.p2.shipLight.position.set(0, 0.2, 2.2);
    this.p2.ship.add(this.p2.shipLight);
    this.scene.add(this.p2.ship);

    // P3 (Amarillo Eléctrico)
    if (this.p3.ship) this.scene.remove(this.p3.ship);
    this.p3.ship = this.buildShipMesh(0xffe600, 0x00f0ff);
    this.p3.shipLight = new THREE.PointLight(0xffe600, 3, 12);
    this.p3.shipLight.position.set(0, 0.2, 2.2);
    this.p3.ship.add(this.p3.shipLight);
    this.scene.add(this.p3.ship);
  }

  buildShipMesh(primaryColor, accentColor) {
    const group = new THREE.Group();

    const bodyGeo = new THREE.ConeGeometry(0.85, 3.2, 5);
    bodyGeo.rotateX(-Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x121424,
      metalness: 0.95,
      roughness: 0.15
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(bodyMesh);

    const cockpitGeo = new THREE.SphereGeometry(0.38, 16, 16);
    cockpitGeo.scale(1, 0.7, 2);
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.6,
      roughness: 0.05
    });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 0.35, -0.2);
    group.add(cockpit);

    const wingGeo = new THREE.BoxGeometry(3.0, 0.08, 1.2);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x1b1f38, metalness: 0.9 });
    const wing = new THREE.Mesh(wingGeo, wingMat);
    wing.position.set(0, 0.05, 0.4);
    group.add(wing);

    const wingtipGeo = new THREE.BoxGeometry(0.12, 0.5, 1.2);
    const wingtipMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const leftTip = new THREE.Mesh(wingtipGeo, wingtipMat);
    leftTip.position.set(-1.5, 0.25, 0.4);
    group.add(leftTip);

    const rightTip = new THREE.Mesh(wingtipGeo, wingtipMat);
    rightTip.position.set(1.5, 0.25, 0.4);
    group.add(rightTip);

    const thrusterGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 12);
    thrusterGeo.rotateX(Math.PI / 2);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: primaryColor });

    const leftThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    leftThruster.position.set(-0.55, 0.05, 1.6);
    group.add(leftThruster);

    const rightThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    rightThruster.position.set(0.55, 0.05, 1.6);
    group.add(rightThruster);

    group.position.set(0, 0.85, 0);
    return group;
  }

  createParticleField() {
    const count = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = Math.random() * 25;
      positions[i + 2] = -Math.random() * 180;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.35,
      transparent: true,
      opacity: 0.75
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setMode(mode) {
    this.gameMode = mode;

    // Resetear visibilidad de botones
    this.btnMode1p.classList.remove('active');
    this.btnMode2p.classList.remove('active');
    this.btnMode3p.classList.remove('active');

    this.instructions1p.style.display = 'none';
    this.instructions2p.style.display = 'none';
    this.instructions3p.style.display = 'none';

    this.rulesBanner2p.style.display = 'none';
    this.rulesBanner3p.style.display = 'none';

    this.divider2p.style.display = 'none';
    this.divider3pLeft.style.display = 'none';
    this.divider3pRight.style.display = 'none';

    const fullAspect = window.innerWidth / window.innerHeight;
    const halfAspect = (window.innerWidth / 2) / window.innerHeight;
    const thirdAspect = (window.innerWidth / 3) / window.innerHeight;

    if (mode === '3P') {
      this.roadWidth = 42; // 3 Vías de 14 de ancho cada una
      this.btnMode3p.classList.add('active');
      this.instructions3p.style.display = 'grid';
      this.rulesBanner3p.style.display = 'block';

      this.divider3pLeft.style.display = 'block';
      this.divider3pRight.style.display = 'block';

      this.p1Hud.style.display = 'flex';
      this.p2Hud.style.display = 'flex';
      this.p3Hud.style.display = 'flex';
      this.singleRecordHud.style.display = 'none';
      this.goalContainer.style.display = 'block';

      this.p1.ship.position.set(-14, 0.85, 0);
      this.p2.ship.position.set(0, 0.85, 0);
      this.p3.ship.position.set(14, 0.85, 0);

      this.p1.ship.visible = true;
      this.p2.ship.visible = true;
      this.p3.ship.visible = true;

      // Cámaras 3P elevadas desde arriba
      this.cameraP1.fov = 86;
      this.cameraP2.fov = 86;
      this.cameraP3.fov = 86;
      this.cameraP1.aspect = thirdAspect;
      this.cameraP2.aspect = thirdAspect;
      this.cameraP3.aspect = thirdAspect;
      this.cameraP1.updateProjectionMatrix();
      this.cameraP2.updateProjectionMatrix();
      this.cameraP3.updateProjectionMatrix();

      this.cameraP1.position.set(-14, 8.2, 11.8);
      this.cameraP1.lookAt(-14, 0.2, -28);
      this.cameraP2.position.set(0, 8.2, 11.8);
      this.cameraP2.lookAt(0, 0.2, -28);
      this.cameraP3.position.set(14, 8.2, 11.8);
      this.cameraP3.lookAt(14, 0.2, -28);
    } else if (mode === '2P') {
      this.roadWidth = 28;
      this.btnMode2p.classList.add('active');
      this.instructions2p.style.display = 'grid';
      this.rulesBanner2p.style.display = 'block';

      this.divider2p.style.display = 'block';

      this.p1Hud.style.display = 'flex';
      this.p2Hud.style.display = 'flex';
      this.p3Hud.style.display = 'none';
      this.singleRecordHud.style.display = 'none';
      this.goalContainer.style.display = 'block';

      this.p1.ship.position.set(-4.5, 0.85, 0);
      this.p2.ship.position.set(4.5, 0.85, 0);

      this.p1.ship.visible = true;
      this.p2.ship.visible = true;
      this.p3.ship.visible = false;

      // Cámaras 2P elevadas
      this.cameraP1.fov = 72;
      this.cameraP2.fov = 72;
      this.cameraP1.aspect = halfAspect;
      this.cameraP2.aspect = halfAspect;
      this.cameraP1.updateProjectionMatrix();
      this.cameraP2.updateProjectionMatrix();

      this.cameraP1.position.set(-4.5, 4.8, 9.6);
      this.cameraP1.lookAt(-4.5, 0.8, -20);
      this.cameraP2.position.set(4.5, 4.8, 9.6);
      this.cameraP2.lookAt(4.5, 0.8, -20);
    } else {
      this.roadWidth = 14;
      this.btnMode1p.classList.add('active');
      this.instructions1p.style.display = 'grid';

      this.p1Hud.style.display = 'flex';
      this.p2Hud.style.display = 'none';
      this.p3Hud.style.display = 'none';
      this.singleRecordHud.style.display = 'flex';
      this.goalContainer.style.display = 'none';

      this.p1.ship.position.set(0, 0.85, 0);

      this.p1.ship.visible = true;
      this.p2.ship.visible = false;
      this.p3.ship.visible = false;

      this.camera.fov = 62;
      this.camera.aspect = fullAspect;
      this.camera.updateProjectionMatrix();
      this.camera.position.set(0, 4.2, 9.2);
      this.camera.lookAt(0, 1.0, -18);
    }

    this.createRoad();
  }

  setupEvents() {
    this.btnMode1p.addEventListener('click', () => this.setMode('1P'));
    this.btnMode2p.addEventListener('click', () => this.setMode('2P'));
    this.btnMode3p.addEventListener('click', () => this.setMode('3P'));

    // Teclado
    window.addEventListener('keydown', (e) => {
      // P1: A, D, W, Space
      if (e.code === 'KeyA') this.keys.p1Left = true;
      if (e.code === 'KeyD') this.keys.p1Right = true;
      if (e.code === 'KeyW') this.keys.p1Boost = true;
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'PLAYING' && this.p1.alive) {
          this.shoot(this.p1, 0x00f0ff);
        }
      }

      // P2: Flechas, Enter
      if (this.gameMode === '2P' || this.gameMode === '3P') {
        if (e.code === 'ArrowLeft') this.keys.p2Left = true;
        if (e.code === 'ArrowRight') this.keys.p2Right = true;
        if (e.code === 'ArrowUp') this.keys.p2Boost = true;
        if (e.code === 'Enter') {
          e.preventDefault();
          if (this.state === 'PLAYING' && this.p2.alive) {
            this.shoot(this.p2, 0xff007f);
          }
        }
      } else {
        if (e.code === 'ArrowLeft') this.keys.p1Left = true;
        if (e.code === 'ArrowRight') this.keys.p1Right = true;
        if (e.code === 'ArrowUp') this.keys.p1Boost = true;
      }

      // P3: J, L, I, U (En modo 3P)
      if (this.gameMode === '3P') {
        if (e.code === 'KeyJ') this.keys.p3Left = true;
        if (e.code === 'KeyL') this.keys.p3Right = true;
        if (e.code === 'KeyI') this.keys.p3Boost = true;
        if (e.code === 'KeyU') {
          if (this.state === 'PLAYING' && this.p3.alive) {
            this.shoot(this.p3, 0xffe600);
          }
        }
      }

      // Disparo de Misiles con Cooldown
      if (e.code === 'KeyQ' || (this.gameMode === '1P' && e.code === 'ArrowDown')) {
        if (this.state === 'PLAYING' && this.p1.alive) {
          this.launchMissile(this.p1, 0x00f0ff);
        }
      }

      if (this.gameMode === '2P' || this.gameMode === '3P') {
        if (e.code === 'ArrowDown' || (e.code === 'KeyM' && this.state === 'PLAYING')) {
          e.preventDefault();
          if (this.state === 'PLAYING' && this.p2.alive) {
            this.launchMissile(this.p2, 0xff007f);
          }
        }
      }

      if (this.gameMode === '3P') {
        if (e.code === 'KeyK') {
          if (this.state === 'PLAYING' && this.p3.alive) {
            this.launchMissile(this.p3, 0xffe600);
          }
        }
      }

      // Atajo para abrir y cerrar el Editor de Mapas [M]
      if (e.code === 'KeyM') {
        if (this.state === 'START') {
          this.enterEditor();
        } else if (this.state === 'EDITOR') {
          this.exitEditor();
        }
      }

      // Atajos de navegación y selección rápida en el Editor
      if (this.state === 'EDITOR') {
        if (e.code === 'KeyW' || e.code === 'ArrowUp') this.editorKeys.forward = true;
        if (e.code === 'KeyS' || e.code === 'ArrowDown') this.editorKeys.backward = true;

        if (e.key >= '1' && e.key <= '8') {
          const types = ['speed_ring', 'jump_pad', 'turret', 'gravity_well', 'yellow_barrier', 'red_barrier', 'planet', 'energy_core'];
          const idx = parseInt(e.key, 10) - 1;
          if (types[idx]) {
            this.selectPaletteType(types[idx]);
          }
        }
      }

      if (e.code === 'KeyP') {
        this.togglePause();
      }
      if (e.code === 'KeyO') {
        this.toggleObstacles();
      }
      if (e.code === 'KeyE') {
        if (this.state === 'EDITOR') this.exitEditor();
        else this.openStartScreen();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.state === 'EDITOR') {
        if (e.code === 'KeyW' || e.code === 'ArrowUp') this.editorKeys.forward = false;
        if (e.code === 'KeyS' || e.code === 'ArrowDown') this.editorKeys.backward = false;
      }

      if (e.code === 'KeyA') this.keys.p1Left = false;
      if (e.code === 'KeyD') this.keys.p1Right = false;
      if (e.code === 'KeyW') this.keys.p1Boost = false;

      if (this.gameMode === '2P' || this.gameMode === '3P') {
        if (e.code === 'ArrowLeft') this.keys.p2Left = false;
        if (e.code === 'ArrowRight') this.keys.p2Right = false;
        if (e.code === 'ArrowUp') this.keys.p2Boost = false;
      } else {
        if (e.code === 'ArrowLeft') this.keys.p1Left = false;
        if (e.code === 'ArrowRight') this.keys.p1Right = false;
        if (e.code === 'ArrowUp') this.keys.p1Boost = false;
      }

      if (this.gameMode === '3P') {
        if (e.code === 'KeyJ') this.keys.p3Left = false;
        if (e.code === 'KeyL') this.keys.p3Right = false;
        if (e.code === 'KeyI') this.keys.p3Boost = false;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.state !== 'PLAYING' || this.gameMode !== '1P') return;
      if (e.pointerType === 'touch') return; // Ignorar toques en pantalla para no interferir con controles virtuales
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      this.p1.targetX = normalizedX * (this.roadWidth / 2 - 1.2);
    });

    window.addEventListener('resize', () => {
      const isPortrait = window.innerWidth < window.innerHeight;
      const fullAspect = window.innerWidth / window.innerHeight;
      const halfAspect = (window.innerWidth / 2) / window.innerHeight;
      const thirdAspect = (window.innerWidth / 3) / window.innerHeight;

      this.camera.aspect = fullAspect;
      this.camera.fov = isPortrait ? 78 : 62;
      this.camera.updateProjectionMatrix();

      if (this.editorCamera) {
        this.editorCamera.aspect = fullAspect;
        this.editorCamera.fov = isPortrait ? 74 : 60;
        this.editorCamera.updateProjectionMatrix();
      }

      this.cameraP1.aspect = (this.gameMode === '3P') ? thirdAspect : halfAspect;
      this.cameraP1.fov = (this.gameMode === '3P') ? 86 : 72;
      this.cameraP1.updateProjectionMatrix();

      this.cameraP2.aspect = (this.gameMode === '3P') ? thirdAspect : halfAspect;
      this.cameraP2.fov = (this.gameMode === '3P') ? 86 : 72;
      this.cameraP2.updateProjectionMatrix();

      this.cameraP3.aspect = thirdAspect;
      this.cameraP3.fov = 86;
      this.cameraP3.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.updateMobileControlsVisibility();
    });

    this.setupEditorEvents();
    this.setupMobileControls();
    this.setupFullscreen();

    this.btnStart.addEventListener('click', () => this.startGame());
    this.btnRestart.addEventListener('click', () => this.startGame());
    this.btnResume.addEventListener('click', () => this.togglePause());
    this.btnPause.addEventListener('click', () => this.togglePause());

    this.btnAudio.addEventListener('click', () => {
      const isMuted = window.audioManager.toggleMute();
      this.btnAudio.innerText = isMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ON';
    });

    if (this.btnToggleObstaclesMenu) {
      this.btnToggleObstaclesMenu.addEventListener('click', () => this.toggleObstacles());
    }
    if (this.btnToggleObstaclesFloat) {
      this.btnToggleObstaclesFloat.addEventListener('click', () => this.toggleObstacles());
    }

    if (this.btnHomeFloat) {
      this.btnHomeFloat.addEventListener('click', () => this.openStartScreen());
    }
    if (this.btnMenuGameover) {
      this.btnMenuGameover.addEventListener('click', () => this.openStartScreen());
    }
    if (this.btnBackToEditor) {
      this.btnBackToEditor.addEventListener('click', () => {
        this.gameoverScreen.classList.add('hidden');
        this.enterEditor();
      });
    }
  }

  setupMobileControls() {
    if (!this.mobileControls) return;

    if (this.isTouchDevice && this.mobileModeHint) {
      this.mobileModeHint.style.display = 'block';
    }

    const attachBtn = (element, onDown, onUp) => {
      if (!element) return;
      const downHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.add('touch-active');
        if (window.audioManager) window.audioManager.init();
        if (onDown) onDown();
      };
      const upHandler = (e) => {
        e.preventDefault();
        element.classList.remove('touch-active');
        if (onUp) onUp();
      };

      element.addEventListener('pointerdown', downHandler);
      element.addEventListener('pointerup', upHandler);
      element.addEventListener('pointercancel', upHandler);
      element.addEventListener('pointerleave', upHandler);
    };

    // Dirección Izquierda
    attachBtn(this.touchBtnLeft,
      () => { this.keys.p1Left = true; },
      () => { this.keys.p1Left = false; }
    );

    // Dirección Derecha
    attachBtn(this.touchBtnRight,
      () => { this.keys.p1Right = true; },
      () => { this.keys.p1Right = false; }
    );

    // Turbo Overdrive
    attachBtn(this.touchBtnTurbo,
      () => { this.keys.p1Boost = true; },
      () => { this.keys.p1Boost = false; }
    );

    // Láser: disparo inmediato y ráfaga continua mientras se mantenga
    attachBtn(this.touchBtnLaser,
      () => {
        if (this.state === 'PLAYING' && this.p1.alive) {
          this.shoot(this.p1, 0x00f0ff);
        }
        if (this.laserTouchInterval) clearInterval(this.laserTouchInterval);
        this.laserTouchInterval = setInterval(() => {
          if (this.state === 'PLAYING' && this.p1.alive) {
            this.shoot(this.p1, 0x00f0ff);
          }
        }, 190);
      },
      () => {
        if (this.laserTouchInterval) {
          clearInterval(this.laserTouchInterval);
          this.laserTouchInterval = null;
        }
      }
    );

    // Misil
    attachBtn(this.touchBtnMissile,
      () => {
        if (this.state === 'PLAYING' && this.p1.alive) {
          this.launchMissile(this.p1, 0x00f0ff);
        }
      },
      null
    );

    // Desbloquear audio en el primer toque en pantalla
    window.addEventListener('touchstart', () => {
      if (window.audioManager) window.audioManager.init();
    }, { passive: true, once: true });
  }

  setupFullscreen() {
    if (!this.btnFullscreen) return;
    this.btnFullscreen.addEventListener('click', () => {
      this.toggleFullscreen();
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
      this.btnFullscreen.innerHTML = '🗗 <span class="btn-text">VENTANA</span>';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.btnFullscreen.innerHTML = '⛶ <span class="btn-text">PANTALLA</span>';
    }
  }

  updateMobileControlsVisibility() {
    if (!this.mobileControls) return;
    const shouldShow = (this.isTouchDevice || window.innerWidth <= 1024) && this.state === 'PLAYING';
    if (shouldShow) {
      this.mobileControls.classList.remove('hidden');
    } else {
      this.mobileControls.classList.add('hidden');
    }
  }

  toggleObstacles(forceState) {
    if (typeof forceState === 'boolean') {
      this.obstaclesEnabled = forceState;
    } else {
      this.obstaclesEnabled = !this.obstaclesEnabled;
    }

    try {
      localStorage.setItem('neon_horizon_obstacles', this.obstaclesEnabled);
    } catch (e) {
      // Ignorar si hay restricciones de almacenamiento local
    }

    // Si se desactivan durante el juego, eliminar los obstáculos presentes en pista
    if (!this.obstaclesEnabled) {
      this.clearObstacles();
    }

    this.updateObstaclesUI();
  }

  clearObstacles() {
    for (const obs of this.obstacles) {
      if (obs && obs.mesh) {
        this.scene.remove(obs.mesh);
      }
    }
    this.obstacles = [];
  }

  updateObstaclesUI() {
    const isEnabled = this.obstaclesEnabled;
    const textFloat = isEnabled ? '⚠️ OBSTÁCULOS: ON [O]' : '🛡️ OBSTÁCULOS: OFF [O]';
    const textMenu = isEnabled ? 'ACTIVADOS [ON]' : 'DESACTIVADOS [OFF]';

    if (this.btnToggleObstaclesFloat) {
      this.btnToggleObstaclesFloat.innerText = textFloat;
      this.btnToggleObstaclesFloat.classList.toggle('disabled', !isEnabled);
      this.btnToggleObstaclesFloat.title = isEnabled ? 'Desactivar obstáculos [O]' : 'Activar obstáculos [O]';
    }

    if (this.btnToggleObstaclesMenu) {
      if (this.menuObstacleText) {
        this.menuObstacleText.innerText = textMenu;
      } else {
        this.btnToggleObstaclesMenu.innerText = textMenu;
      }
      this.btnToggleObstaclesMenu.classList.toggle('active', isEnabled);
      this.btnToggleObstaclesMenu.classList.toggle('disabled', !isEnabled);
    }
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.pauseScreen.classList.remove('hidden');
      this.btnPause.innerText = '▶️ CONTINUAR';
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.pauseScreen.classList.add('hidden');
      this.btnPause.innerText = '⏸️ PAUSA [P]';
      this.clock.getDelta();
    }
  }

  openStartScreen() {
    this.state = 'START';
    this.updateMobileControlsVisibility();
    this.isCustomMapMode = false;
    window.audioManager.stopMusic();

    // Limpiar entidades activas en la escena
    for (const obj of [...this.obstacles, ...this.collectibles, ...this.projectiles, ...this.speedRings, ...this.jumpPads, ...this.turretBullets]) {
      if (obj && obj.mesh) {
        this.scene.remove(obj.mesh);
      }
    }
    this.obstacles = [];
    this.collectibles = [];
    this.projectiles = [];
    this.speedRings = [];
    this.jumpPads = [];
    this.turretBullets = [];
    if (this.finishArch) {
      this.scene.remove(this.finishArch);
      this.finishArch = null;
    }

    // Resetear distancias y velocidades
    this.distance = 0;
    this.currentSpeed = this.baseSpeed;

    // Resetear jugadores
    this.p1.score = 0;
    this.p1.distance = 0;
    this.p1.speed = this.baseSpeed;
    this.p1.alive = true;
    this.p1.boostEnergy = 60;
    this.p1.isBoosting = false;
    this.p1.targetX = (this.gameMode === '3P') ? -14 : ((this.gameMode === '2P') ? -4.5 : 0);
    this.p1.currentX = this.p1.targetX;
    this.p1.currentZ = 0;
    this.p1.targetZ = 0;
    this.p1.roll = 0;
    if (this.p1.ship) {
      this.p1.ship.position.set(this.p1.targetX, 0.85, 0);
      this.p1.ship.rotation.set(0, 0, 0);
      this.p1.ship.visible = true;
    }

    this.p2.score = 0;
    this.p2.distance = 0;
    this.p2.speed = this.baseSpeed;
    this.p2.alive = true;
    this.p2.boostEnergy = 60;
    this.p2.isBoosting = false;
    this.p2.targetX = (this.gameMode === '3P') ? 0 : 4.5;
    this.p2.currentX = this.p2.targetX;
    this.p2.currentZ = 0;
    this.p2.targetZ = 0;
    this.p2.roll = 0;
    if (this.p2.ship) {
      this.p2.ship.position.set(this.p2.targetX, 0.85, 0);
      this.p2.ship.rotation.set(0, 0, 0);
      this.p2.ship.visible = (this.gameMode === '2P' || this.gameMode === '3P');
    }

    this.p3.score = 0;
    this.p3.distance = 0;
    this.p3.speed = this.baseSpeed;
    this.p3.alive = true;
    this.p3.boostEnergy = 60;
    this.p3.isBoosting = false;
    this.p3.targetX = 14;
    this.p3.currentX = 14;
    this.p3.currentZ = 0;
    this.p3.targetZ = 0;
    this.p3.roll = 0;
    if (this.p3.ship) {
      this.p3.ship.position.set(14, 0.85, 0);
      this.p3.ship.rotation.set(0, 0, 0);
      this.p3.ship.visible = (this.gameMode === '3P');
    }

    this.p1.missileTimer = 0;
    this.p2.missileTimer = 0;
    this.p3.missileTimer = 0;

    // Reposicionar cámaras según el modo activo
    this.setMode(this.gameMode);
    this.updateHUD();

    // Mostrar pantalla de inicio y ocultar las demás
    this.startScreen.classList.remove('hidden');
    this.pauseScreen.classList.add('hidden');
    this.gameoverScreen.classList.add('hidden');
    this.btnPause.innerText = '⏸️ PAUSA [P]';
  }

  shoot(player, laserColor) {
    const now = performance.now();
    if (now - player.lastShotTime < 180) return;
    player.lastShotTime = now;

    window.audioManager.playLaser();

    const offsets = [-0.9, 0.9];
    for (const off of offsets) {
      const boltGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8);
      boltGeo.rotateX(-Math.PI / 2);
      const boltMat = new THREE.MeshBasicMaterial({ color: laserColor });
      const boltMesh = new THREE.Mesh(boltGeo, boltMat);

      boltMesh.position.set(
        player.currentX + off,
        player.ship.position.y + 0.1,
        player.ship.position.z - 1.8
      );

      this.scene.add(boltMesh);
      this.projectiles.push({ mesh: boltMesh, speed: 7.5, owner: player });
    }
  }

  launchMissile(player, color) {
    if (this.state !== 'PLAYING' || !player.alive) return;
    if (player.missileTimer > 0) return; // En tiempo de recarga

    player.missileTimer = player.missileCooldown;
    window.audioManager.playMissileLaunch();

    const missileGroup = new THREE.Group();

    // Fuselaje cilíndrico aerodinámico del misil
    const bodyGeo = new THREE.CylinderGeometry(0.24, 0.28, 2.5, 12);
    bodyGeo.rotateX(-Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1f2338,
      metalness: 0.9,
      roughness: 0.2
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    missileGroup.add(bodyMesh);

    // Ojiva de impacto con color de energía del jugador
    const coneGeo = new THREE.ConeGeometry(0.28, 0.85, 12);
    coneGeo.rotateX(-Math.PI / 2);
    const coneMat = new THREE.MeshBasicMaterial({ color: color });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.z = -1.65;
    missileGroup.add(coneMesh);

    // 4 Aletas estabilizadoras posteriores
    for (let i = 0; i < 4; i++) {
      const finGeo = new THREE.BoxGeometry(0.04, 0.6, 0.5);
      const finMat = new THREE.MeshBasicMaterial({ color: color });
      const finMesh = new THREE.Mesh(finGeo, finMat);
      finMesh.rotation.z = (i * Math.PI) / 2;
      finMesh.position.z = 0.85;
      missileGroup.add(finMesh);
    }

    // Fuego / Tobera de plasma propulsor
    const flameGeo = new THREE.ConeGeometry(0.22, 1.2, 8);
    flameGeo.rotateX(Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.95
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.z = 1.8;
    missileGroup.add(flameMesh);

    // Luz puntual emitida por el misil
    const missileLight = new THREE.PointLight(color, 2.5, 14);
    missileLight.position.set(0, 0, 0);
    missileGroup.add(missileLight);

    missileGroup.position.set(
      player.currentX,
      player.ship.position.y + 0.15,
      player.ship.position.z - 2.0
    );

    this.scene.add(missileGroup);
    this.projectiles.push({
      mesh: missileGroup,
      speed: 9.2,
      owner: player,
      isMissile: true,
      flame: flameMesh,
      blastRadius: 7.0
    });
  }

  startGame() {
    this.state = 'PLAYING';
    this.updateMobileControlsVisibility();
    this.distance = 0;
    this.currentSpeed = this.baseSpeed;

    // Reset P1 (Vía 1: Izquierda)
    this.p1.score = 0;
    this.p1.distance = 0;
    this.p1.speed = this.baseSpeed;
    this.p1.alive = true;
    this.p1.boostEnergy = 60;
    this.p1.isBoosting = false;
    this.p1.missileTimer = 0;
    this.p1.targetX = (this.gameMode === '3P') ? -14 : ((this.gameMode === '2P') ? -4.5 : 0);
    this.p1.currentX = this.p1.targetX;
    this.p1.targetZ = 0;
    this.p1.currentZ = 0;
    this.p1.roll = 0;
    this.p1.ship.position.set(this.p1.targetX, 0.85, 0);
    this.p1.ship.visible = true;

    // Reset P2 (Vía 2: Centro en 3P, Derecha en 2P)
    this.p2.score = 0;
    this.p2.distance = 0;
    this.p2.speed = this.baseSpeed;
    this.p2.alive = true;
    this.p2.boostEnergy = 60;
    this.p2.isBoosting = false;
    this.p2.missileTimer = 0;
    this.p2.targetX = (this.gameMode === '3P') ? 0 : 4.5;
    this.p2.currentX = this.p2.targetX;
    this.p2.targetZ = 0;
    this.p2.currentZ = 0;
    this.p2.roll = 0;
    this.p2.ship.position.set(this.p2.targetX, 0.85, 0);
    this.p2.ship.visible = (this.gameMode === '2P' || this.gameMode === '3P');

    // Reset P3 (Vía 3: Derecha en 3P)
    this.p3.score = 0;
    this.p3.distance = 0;
    this.p3.speed = this.baseSpeed;
    this.p3.alive = true;
    this.p3.boostEnergy = 60;
    this.p3.isBoosting = false;
    this.p3.missileTimer = 0;
    this.p3.targetX = 14;
    this.p3.currentX = 14;
    this.p3.targetZ = 0;
    this.p3.currentZ = 0;
    this.p3.roll = 0;
    this.p3.ship.position.set(14, 0.85, 0);
    this.p3.ship.visible = (this.gameMode === '3P');

    // Limpiar entidades activas
    for (const obj of [...this.obstacles, ...this.collectibles, ...this.projectiles, ...this.speedRings, ...this.jumpPads, ...this.turretBullets]) {
      if (obj && obj.mesh) this.scene.remove(obj.mesh);
    }
    this.obstacles = [];
    this.collectibles = [];
    this.projectiles = [];
    this.speedRings = [];
    this.jumpPads = [];
    this.turretBullets = [];
    if (this.finishArch) {
      this.scene.remove(this.finishArch);
      this.finishArch = null;
    }

    // Si estamos jugando un mapa personalizado creado en el Editor
    if (this.isCustomMapMode && this.editorPlacedItems.length > 0) {
      let furthestZ = -150;

      for (const item of this.editorPlacedItems) {
        furthestZ = Math.min(furthestZ, item.z);

        if (item.type === 'speed_ring') {
          const mesh = this.createSpeedRing(item.x, item.z);
          this.scene.add(mesh);
          this.speedRings.push({ mesh, radius: 2.3, triggered: false });
        } else if (item.type === 'jump_pad') {
          const mesh = this.createJumpPad(item.x, item.z);
          this.scene.add(mesh);
          this.jumpPads.push({ mesh, radius: 2.0 });
        } else if (item.type === 'turret') {
          const mesh = this.createTurret(item.x, item.z);
          this.scene.add(mesh);
          this.obstacles.push({
            mesh,
            radius: 1.8,
            isTurret: true,
            destructible: true,
            requiresMissile: false,
            lastShot: performance.now()
          });
        } else if (item.type === 'gravity_well') {
          const mesh = this.createGravityWell(item.x, item.z);
          this.scene.add(mesh);
          this.obstacles.push({
            mesh,
            radius: 1.8,
            isGravityWell: true,
            ring1: mesh.userData.ring1,
            ring2: mesh.userData.ring2,
            destructible: true,
            requiresMissile: true
          });
        } else if (item.type === 'yellow_barrier') {
          const mesh = this.createYellowBarrierMesh(item.x, item.z);
          this.scene.add(mesh);
          this.obstacles.push({
            mesh,
            radius: 1.8,
            isBarrier: true,
            isYellowBarrier: true,
            destructible: true,
            requiresMissile: true
          });
        } else if (item.type === 'red_barrier') {
          const mesh = this.createRedBarrierMesh(item.x, item.z);
          this.scene.add(mesh);
          this.obstacles.push({
            mesh,
            radius: 1.8,
            isBarrier: true,
            isRedBarrier: true,
            destructible: true,
            requiresMissile: false
          });
        } else if (item.type === 'planet') {
          const mesh = this.createPlanetMesh(item.x, item.z);
          this.scene.add(mesh);
          this.obstacles.push({
            mesh,
            radius: 1.5,
            isDrone: true,
            isPlanet: true,
            ring: mesh.userData.ring,
            destructible: true,
            requiresMissile: false
          });
        } else if (item.type === 'energy_core') {
          const mesh = this.createEnergyCoreMesh(item.x, item.z);
          this.scene.add(mesh);
          this.collectibles.push({
            mesh,
            radius: 1.4,
            halo: mesh.userData.halo
          });
        }
      }

      // Meta de llegada colocada 50m después del último obstáculo
      this.customMapFinishZ = furthestZ - 50;
      this.finishArch = this.createFinishArch(this.customMapFinishZ);
      this.scene.add(this.finishArch);
    }

    // Ocultar pantallas
    this.startScreen.classList.add('hidden');
    this.gameoverScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
    this.btnPause.innerText = '⏸️ PAUSA [P]';

    window.audioManager.startMusic();
  }

  gameOver(winnerMessage, subtitleMessage, isVictory = false) {
    this.state = 'GAMEOVER';
    this.updateMobileControlsVisibility();

    if (isVictory) {
      if (window.audioManager && window.audioManager.playVictory) {
        window.audioManager.playVictory();
      }
    } else {
      window.audioManager.playCrash();
      this.damageFlash.style.opacity = '1';
      setTimeout(() => { this.damageFlash.style.opacity = '0'; }, 200);
    }

    if (this.isCustomMapMode) {
      this.singleResultBox.style.display = 'flex';
      this.p2ResultBox.style.display = 'none';

      if (isVictory) {
        this.gameoverTitle.innerText = winnerMessage || '¡CIRCUITO DEL EDITOR SUPERADO! 🏆';
        this.gameoverTitle.style.background = 'linear-gradient(135deg, #00f0ff, #ffe600)';
        this.gameoverTitle.style.webkitBackgroundClip = 'text';
        this.gameoverTitle.style.webkitTextFillColor = 'transparent';

        this.gameoverSubtitle.innerText = subtitleMessage || '¡Has completado con éxito la prueba de tu mapa!';
        this.finalScore.innerText = `${Math.abs(Math.floor(this.customMapFinishZ || this.distance))} m`;
        this.finalCores.innerText = `${Math.floor(this.p1.score)} pts`;
      } else {
        this.gameoverTitle.innerText = 'PRUEBA FALLIDA 💥';
        this.gameoverTitle.style.background = 'linear-gradient(135deg, #ff0055, #ff7700)';
        this.gameoverTitle.style.webkitBackgroundClip = 'text';
        this.gameoverTitle.style.webkitTextFillColor = 'transparent';

        this.gameoverSubtitle.innerText = 'EL VEHÍCULO COLISIONÓ EN EL CIRCUITO DEL EDITOR';
        this.finalScore.innerText = `${Math.floor(this.distance)} m`;
        this.finalCores.innerText = `${Math.floor(this.p1.score)} pts`;
      }

      if (this.btnBackToEditor) this.btnBackToEditor.style.display = 'inline-block';
      if (this.btnRestart) this.btnRestart.innerText = 'REPETIR PRUEBA';
    } else if (this.gameMode === '2P' || this.gameMode === '3P') {
      if (this.btnBackToEditor) this.btnBackToEditor.style.display = 'none';
      if (this.btnRestart) this.btnRestart.innerText = 'REINTENTAR';

      this.singleResultBox.style.display = 'none';
      this.p2ResultBox.style.display = 'flex';

      this.gameoverTitle.style.background = isVictory ? 'linear-gradient(135deg, #00f0ff, #ffe600)' : 'linear-gradient(135deg, #ff0055, #ff7700)';
      this.gameoverTitle.style.webkitBackgroundClip = 'text';
      this.gameoverTitle.style.webkitTextFillColor = 'transparent';

      this.gameoverTitle.innerText = winnerMessage || 'CARRERA FINALIZADA';
      this.gameoverSubtitle.innerText = subtitleMessage || 'META DE ORBES O DISTANCIA ALCANZADA';

      this.p1FinalScore.innerText = `${Math.floor(this.p1.score)} pts`;
      this.p2FinalScore.innerText = `${Math.floor(this.p2.score)} pts`;

      if (this.gameMode === '3P') {
        this.p3FinalBox.style.display = 'block';
        this.p3FinalScore.innerText = `${Math.floor(this.p3.score)} pts`;
      } else {
        this.p3FinalBox.style.display = 'none';
      }
    } else {
      if (this.btnBackToEditor) this.btnBackToEditor.style.display = 'none';
      if (this.btnRestart) this.btnRestart.innerText = 'REINTENTAR';

      this.singleResultBox.style.display = 'flex';
      this.p2ResultBox.style.display = 'none';

      if (this.p1.score > this.highScore) {
        this.highScore = Math.floor(this.p1.score);
        localStorage.setItem('neon_horizon_highscore', this.highScore.toString());
      }

      this.gameoverTitle.style.background = isVictory ? 'linear-gradient(135deg, #00f0ff, #ffe600)' : 'linear-gradient(135deg, #ff0055, #ff7700)';
      this.gameoverTitle.style.webkitBackgroundClip = 'text';
      this.gameoverTitle.style.webkitTextFillColor = 'transparent';

      this.gameoverTitle.innerText = winnerMessage || 'SEÑAL PERDIDA';
      this.gameoverSubtitle.innerText = subtitleMessage || 'EL VEHÍCULO HA SIDO DESTRUIDO';
      this.finalScore.innerText = `${Math.floor(this.distance)} m`;
      this.finalCores.innerText = Math.floor(this.p1.score / 150).toString();
    }

    this.gameoverScreen.classList.remove('hidden');
  }

  spawnEntities() {
    // En mapas personalizados creados en el editor no se generan objetos aleatorios
    if (this.isCustomMapMode) return;
    if (this.distance < 35) return;

    // Control de obstáculos (se pueden poner y quitar en 1P, 2P y 3P con [O] o botones)
    if (this.obstaclesEnabled) {
      const lastObstacle = this.obstacles[this.obstacles.length - 1];
      if (!lastObstacle || lastObstacle.mesh.position.z >= -195) {
        const spawnRate = (this.gameMode === '3P') ? 0.052 : ((this.gameMode === '2P') ? 0.024 : 0.035);

        if (Math.random() < spawnRate) {
          let laneX = 0;
          if (this.gameMode === '3P') {
            // En 3P: generar obstáculos en cualquiera de las 3 vías independientes
            const lanePick = Math.floor(Math.random() * 3);
            if (lanePick === 0) laneX = -14 + (Math.random() - 0.5) * 6.5; // Vía 1 (P1)
            else if (lanePick === 1) laneX = 0 + (Math.random() - 0.5) * 6.5;   // Vía 2 (P2)
            else laneX = 14 + (Math.random() - 0.5) * 6.5;                     // Vía 3 (P3)
          } else if (this.gameMode === '2P') {
            const side = Math.random() > 0.5 ? -1 : 1;
            laneX = side * (3.0 + Math.random() * 8.5);
          } else {
            laneX = (Math.random() - 0.5) * (this.roadWidth - 4.5);
          }

          const isLaser = Math.random() > 0.45;

          if (isLaser) {
            const isYellow = Math.random() > 0.5;

            if (isYellow) {
              // 1. Barreras Amarillas: Solo se rompen con MISILES
              const barrierGroup = this.createYellowBarrier(laneX);
              this.obstacles.push({
                mesh: barrierGroup,
                radius: 1.8,
                isBarrier: true,
                isYellowBarrier: true,
                destructible: true,
                requiresMissile: true
              });
            } else {
              // 2. Barreras Rojas: Se rompen con DISPAROS (láser y misiles)
              const barrierGroup = this.createRedBarrier(laneX);
              this.obstacles.push({
                mesh: barrierGroup,
                radius: 1.8,
                isBarrier: true,
                isRedBarrier: true,
                destructible: true,
                requiresMissile: false
              });
            }
          } else {
            // 3. Planetas (Minas con núcleo y anillo): Se rompen con DISPAROS (láser y misiles)
            const mineGroup = new THREE.Group();
            const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
            const coreMesh = new THREE.Mesh(coreGeo, coreMat);
            mineGroup.add(coreMesh);

            const ringGeo = new THREE.TorusGeometry(1.4, 0.1, 8, 24);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2;
            mineGroup.add(ringMesh);

            mineGroup.position.set(laneX, 1.2, -220);
            this.scene.add(mineGroup);
            this.obstacles.push({
              mesh: mineGroup,
              radius: 1.5,
              isDrone: true,
              isPlanet: true,
              ring: ringMesh,
              destructible: true,
              requiresMissile: false
            });
          }
        }
      }
    }

    // Núcleos de Energía (Orbes / Cores)
    // En 3P la generación de orbes es más frecuente y divertida
    const coreSpawnRate = (this.gameMode === '3P') ? 0.085 : 0.045;

    if (Math.random() < coreSpawnRate) {
      let coreLaneX = 0;

      if (this.gameMode === '3P') {
        // En 3P: generar equitativamente en Vía 1 [-19, -9], Vía 2 [-5, +5], o Vía 3 [+9, +19]
        const lanePick = Math.floor(Math.random() * 3);
        if (lanePick === 0) coreLaneX = -14 + (Math.random() - 0.5) * 8.0; // Vía Izquierda
        else if (lanePick === 1) coreLaneX = 0 + (Math.random() - 0.5) * 8.0; // Vía Central
        else coreLaneX = 14 + (Math.random() - 0.5) * 8.0; // Vía Derecha
      } else if (this.gameMode === '2P') {
        const side = Math.random() > 0.5 ? -1 : 1;
        coreLaneX = side * (3.0 + Math.random() * 8.0);
      } else {
        coreLaneX = (Math.random() - 0.5) * (this.roadWidth - 3.5);
      }

      const coreGroup = new THREE.Group();

      const gemGeo = new THREE.OctahedronGeometry(0.7, 0);
      const gemMat = new THREE.MeshBasicMaterial({
        color: (this.gameMode === '3P') ? (Math.random() > 0.5 ? 0x00f0ff : 0xffe600) : 0x00f0ff
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      coreGroup.add(gem);

      const haloGeo = new THREE.RingGeometry(0.85, 1.15, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      coreGroup.add(halo);

      coreGroup.position.set(coreLaneX, 1.1, -220);
      this.scene.add(coreGroup);
      this.collectibles.push({ mesh: coreGroup, radius: 1.4, halo });
    }
  }

  updatePlayer(player, keysLeft, keysRight, keysBoost, delta) {
    if (!player.alive) return;

    const moveStep = 22 * delta;
    if (keysLeft) player.targetX -= moveStep;
    if (keysRight) player.targetX += moveStep;

    // Confinamiento estricto por carril:
    if (this.gameMode === '3P') {
      // 3 Vías: [-21, +21]
      // Vía 1 (P1): [-19.5, -8.5] (Centro en -14)
      // Vía 2 (P2): [-5.5, +5.5] (Centro en 0)
      // Vía 3 (P3): [+8.5, +19.5] (Centro en +14)
      if (player === this.p1) {
        player.targetX = Math.max(-19.5, Math.min(-8.5, player.targetX));
      } else if (player === this.p2) {
        player.targetX = Math.max(-5.5, Math.min(5.5, player.targetX));
      } else if (player === this.p3) {
        player.targetX = Math.max(8.5, Math.min(19.5, player.targetX));
      }
    } else if (this.gameMode === '2P') {
      const halfWidth = this.roadWidth / 2; // 14
      if (player === this.p1) {
        player.targetX = Math.max(-halfWidth + 1.6, Math.min(-1.5, player.targetX));
      } else if (player === this.p2) {
        player.targetX = Math.max(1.5, Math.min(halfWidth - 1.6, player.targetX));
      }
    } else {
      const maxLaneX = this.roadWidth / 2 - 1.4;
      player.targetX = Math.max(-maxLaneX, Math.min(maxLaneX, player.targetX));
    }

    const prevX = player.currentX;
    player.currentX += (player.targetX - player.currentX) * 12 * delta;
    const vx = (player.currentX - prevX) / delta;

    const targetRoll = -vx * 0.038;
    player.roll += (targetRoll - player.roll) * 14 * delta;

    // Salto cuántico (Física de Jump Pad)
    if (player.isJumping) {
      player.jumpY = (player.jumpY || 0) + player.jumpVelocity * delta;
      player.jumpVelocity -= 36 * delta; // Gravedad hacia la pista
      if (player.jumpY <= 0) {
        player.jumpY = 0;
        player.jumpVelocity = 0;
        player.isJumping = false;
      }
    } else {
      player.jumpY = 0;
    }

    const hoverY = 0.85 + player.jumpY + Math.sin(this.clock.getElapsedTime() * 7 + (player === this.p2 ? 2 : (player === this.p3 ? 4 : 0))) * 0.08;

    // Aceleración y Turbo individual
    if (keysBoost && player.boostEnergy > 0) {
      player.isBoosting = true;
      player.boostEnergy = Math.max(0, player.boostEnergy - 35 * delta);
      player.speed += (this.maxSpeed - player.speed) * 8 * delta;
      if (player.shipLight) player.shipLight.intensity = 5;
    } else {
      player.isBoosting = false;
      player.boostEnergy = Math.min(100, player.boostEnergy + 8 * delta);
      player.speed += (this.baseSpeed - player.speed) * 4 * delta;
      if (player.shipLight) player.shipLight.intensity = 3;
    }

    // Recarga del misil
    if (player.missileTimer > 0) {
      player.missileTimer = Math.max(0, player.missileTimer - delta);
    }

    const playerSpeedDelta = player.speed * 60 * delta;
    player.distance += playerSpeedDelta * 0.25;
    player.score += playerSpeedDelta * 0.35;

    // Desplazamiento longitudinal Z en multijugador
    if (this.gameMode === '2P' || this.gameMode === '3P') {
      const speedDiff = (player.speed - this.baseSpeed) / (this.maxSpeed - this.baseSpeed);
      player.targetZ = -speedDiff * 7.5;
      player.currentZ += (player.targetZ - player.currentZ) * 6 * delta;
    } else {
      player.currentZ = 0;
    }

    player.ship.position.x = player.currentX;
    player.ship.position.y = hoverY;
    player.ship.position.z = player.currentZ;
    player.ship.rotation.z = player.roll;
    player.ship.rotation.y = -vx * 0.015;
  }

  updateWorld(delta) {
    let activeSpeed = this.baseSpeed;
    if (this.gameMode === '3P') {
      const count = (this.p1.alive ? 1 : 0) + (this.p2.alive ? 1 : 0) + (this.p3.alive ? 1 : 0);
      const sumSpeed = (this.p1.alive ? this.p1.speed : 0) + (this.p2.alive ? this.p2.speed : 0) + (this.p3.alive ? this.p3.speed : 0);
      activeSpeed = count > 0 ? (sumSpeed / count) : this.baseSpeed;
    } else if (this.gameMode === '2P') {
      const count = (this.p1.alive ? 1 : 0) + (this.p2.alive ? 1 : 0);
      const sumSpeed = (this.p1.alive ? this.p1.speed : 0) + (this.p2.alive ? this.p2.speed : 0);
      activeSpeed = count > 0 ? (sumSpeed / count) : this.baseSpeed;
    } else {
      activeSpeed = this.p1.speed;
    }

    this.currentSpeed = activeSpeed;
    const speedDelta = this.currentSpeed * 60 * delta;
    this.distance += speedDelta * 0.25;

    // Desplazar pista
    for (const segment of this.roadSegments) {
      segment.position.z += speedDelta;
      if (segment.position.z > 40) {
        segment.position.z -= 80 * this.roadSegments.length;
      }
    }

    // Partículas
    const posAttr = this.particles.geometry.attributes.position;
    for (let i = 2; i < posAttr.array.length; i += 3) {
      posAttr.array[i] += speedDelta * 1.5;
      if (posAttr.array[i] > 10) posAttr.array[i] = -180;
    }
    posAttr.needsUpdate = true;

    // Proyectiles (Láser y Misiles)
    for (let pIdx = this.projectiles.length - 1; pIdx >= 0; pIdx--) {
      const proj = this.projectiles[pIdx];
      const prevZ = proj.mesh.position.z;
      proj.mesh.position.z -= proj.speed;
      const currZ = proj.mesh.position.z;

      if (proj.isMissile) {
        proj.mesh.rotation.z += 14 * delta;
        if (proj.flame) {
          const flameFlicker = 1 + Math.sin(this.clock.getElapsedTime() * 40) * 0.25;
          proj.flame.scale.set(flameFlicker, flameFlicker, 1 + Math.cos(this.clock.getElapsedTime() * 35) * 0.3);
        }
      }

      let hit = false;

      if (proj.isMissile) {
        // Onda expansiva y detonación de misil
        let missileDetonated = false;
        let directHitObstacle = null;
        const midZ = (currZ + prevZ) / 2;

        for (let oIdx = this.obstacles.length - 1; oIdx >= 0; oIdx--) {
          const obs = this.obstacles[oIdx];
          const dx = Math.abs(proj.mesh.position.x - obs.mesh.position.x);
          const dy = Math.abs(proj.mesh.position.y - obs.mesh.position.y);
          const widthThresh = obs.isBarrier ? 2.6 : 2.2;
          const obsZ = obs.mesh.position.z;
          const minZ = Math.min(currZ, prevZ) - 2.5;
          const maxZ = Math.max(currZ, prevZ) + 2.5;

          if (dx <= widthThresh && dy <= 2.2 && (obsZ >= minZ && obsZ <= maxZ)) {
            missileDetonated = true;
            directHitObstacle = obs;
            break;
          }
        }

        if (missileDetonated) {
          hit = true;
          window.audioManager.playHeavyExplosion();

          // Flash ámbar de detonación de misil
          this.damageFlash.style.background = 'rgba(255, 170, 0, 0.45)';
          this.damageFlash.style.opacity = '0.85';
          setTimeout(() => {
            this.damageFlash.style.opacity = '0';
            this.damageFlash.style.background = 'rgba(255, 0, 60, 0.4)';
          }, 150);

          // Pulverizar obstáculos dentro de la onda expansiva (barreras amarillas, rojas y planetas)
          let destroyedCount = 0;
          for (let oIdx = this.obstacles.length - 1; oIdx >= 0; oIdx--) {
            const obs = this.obstacles[oIdx];
            const dist = proj.mesh.position.distanceTo(obs.mesh.position);
            const inSweepZ = Math.abs(obs.mesh.position.z - midZ) <= (proj.blastRadius + 2.5);
            const inSweepX = Math.abs(obs.mesh.position.x - proj.mesh.position.x) <= (proj.blastRadius + 1.0);
            const isHit = (obs === directHitObstacle) || (dist <= proj.blastRadius) || (inSweepZ && inSweepX);

            if (isHit && obs.destructible) {
              this.scene.remove(obs.mesh);
              this.obstacles.splice(oIdx, 1);
              destroyedCount++;
            }
          }

          if (proj.owner) {
            proj.owner.score += Math.max(1, destroyedCount) * 250;
          }
        }
      } else {
        // Disparo láser estándar (Balas) - Detección continua sin túnel
        for (let oIdx = this.obstacles.length - 1; oIdx >= 0; oIdx--) {
          const obs = this.obstacles[oIdx];
          const dx = Math.abs(proj.mesh.position.x - obs.mesh.position.x);
          const dy = Math.abs(proj.mesh.position.y - obs.mesh.position.y);
          const widthThresh = obs.isBarrier ? 2.6 : 2.2;
          const heightThresh = 2.4;

          // Comprobación de barrido en Z para que las balas nunca salten la barrera entre cuadros
          const obsZ = obs.mesh.position.z;
          const minZ = Math.min(currZ, prevZ) - 2.5;
          const maxZ = Math.max(currZ, prevZ) + 2.5;
          const inZRange = (obsZ >= minZ && obsZ <= maxZ);

          if (dx <= widthThresh && dy <= heightThresh && inZRange) {
            hit = true;
            // Las barreras rojas y los planetas se destruyen con balas / disparos láser normales
            if (obs.destructible && !obs.requiresMissile) {
              window.audioManager.playExplosion();
              this.scene.remove(obs.mesh);
              this.obstacles.splice(oIdx, 1);
              if (proj.owner) proj.owner.score += (obs.isBarrier ? 150 : 120);
            } else {
              // Las barreras amarillas solo se rompen con misiles; el láser normal rebota
              window.audioManager.playDeflect();
              if (obs.mesh) {
                // Pequeño parpadeo de escudo blindado
                const origY = obs.mesh.position.y;
                obs.mesh.position.y += 0.15;
                setTimeout(() => { if (obs.mesh) obs.mesh.position.y = origY; }, 80);
              }
            }
            break;
          }
        }
      }

      if (hit || proj.mesh.position.z < -240) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(pIdx, 1);
      }
    }

    // Obstáculos (1P, 2P y 3P)
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.mesh.position.z += speedDelta;

      if (obs.isDrone) {
        obs.mesh.rotation.y += 2.0 * delta;
        if (obs.ring) obs.ring.rotation.z += 4.5 * delta;
      } else if (obs.isBarrier) {
        obs.mesh.position.y = 1.1 + Math.sin(this.clock.getElapsedTime() * 4 + i) * 0.12;
      } else if (obs.isGravityWell) {
        // Rotación de anillos de acreción
        if (obs.ring1) obs.ring1.rotation.x += 3.0 * delta;
        if (obs.ring2) obs.ring2.rotation.y += 4.2 * delta;

        // Fuerza de atracción gravitatoria lateral hacia el vórtice
        const dz = obs.mesh.position.z - this.p1.currentZ;
        if (dz < 0 && dz > -55 && this.p1.alive) {
          const pullFactor = (1 - Math.abs(dz) / 55);
          const pullDir = Math.sign(obs.mesh.position.x - this.p1.currentX);
          this.p1.targetX += pullDir * pullFactor * 13 * delta;
        }
      } else if (obs.isTurret) {
        // Lógica de IA y disparo de torreta centinela
        const dz = obs.mesh.position.z - this.p1.currentZ;
        if (dz < -12 && dz > -160 && this.p1.alive) {
          const now = performance.now();
          if (!obs.lastShot || now - obs.lastShot > 2300) {
            obs.lastShot = now;
            this.fireTurretBolt(obs.mesh.position.x, obs.mesh.position.y + 0.6, obs.mesh.position.z);
          }
        }
      }

      // Colisión con salto: si la nave está volando alto por una rampa de salto, esquiva el obstáculo
      const isAirborne = (this.p1.jumpY && this.p1.jumpY > 1.8);

      if (!isAirborne && this.p1.alive && this.p1.ship.position.distanceTo(obs.mesh.position) < (obs.radius + 0.65)) {
        if (this.gameMode === '2P' || this.gameMode === '3P') {
          this.p1.alive = false;
          this.p1.ship.visible = false;
          window.audioManager.playCrash();
        } else {
          this.gameOver();
          return;
        }
      }

      const isAirborneP2 = (this.p2.jumpY && this.p2.jumpY > 1.8);
      if (!isAirborneP2 && (this.gameMode === '2P' || this.gameMode === '3P') && this.p2.alive && this.p2.ship.position.distanceTo(obs.mesh.position) < (obs.radius + 0.65)) {
        this.p2.alive = false;
        this.p2.ship.visible = false;
        window.audioManager.playCrash();
      }

      const isAirborneP3 = (this.p3.jumpY && this.p3.jumpY > 1.8);
      if (!isAirborneP3 && this.gameMode === '3P' && this.p3.alive && this.p3.ship.position.distanceTo(obs.mesh.position) < (obs.radius + 0.65)) {
        this.p3.alive = false;
        this.p3.ship.visible = false;
        window.audioManager.playCrash();
      }

      if (obs.mesh.position.z > 15) {
        this.scene.remove(obs.mesh);
        this.obstacles.splice(i, 1);
      }
    }

    // Coleccionables (Orbes)
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const core = this.collectibles[i];
      core.mesh.position.z += speedDelta;
      core.mesh.rotation.y += 3.0 * delta;
      if (core.halo) core.halo.rotation.z += 5.0 * delta;

      let collected = false;
      if (this.p1.alive && this.p1.ship.position.distanceTo(core.mesh.position) < (core.radius + 0.8)) {
        this.p1.score += 250;
        this.p1.boostEnergy = Math.min(100, this.p1.boostEnergy + 30);
        collected = true;
      }

      if ((this.gameMode === '2P' || this.gameMode === '3P') && this.p2.alive && this.p2.ship.position.distanceTo(core.mesh.position) < (core.radius + 0.8)) {
        this.p2.score += 250;
        this.p2.boostEnergy = Math.min(100, this.p2.boostEnergy + 30);
        collected = true;
      }

      if (this.gameMode === '3P' && this.p3.alive && this.p3.ship.position.distanceTo(core.mesh.position) < (core.radius + 0.8)) {
        this.p3.score += 250;
        this.p3.boostEnergy = Math.min(100, this.p3.boostEnergy + 30);
        collected = true;
      }

      if (collected) {
        window.audioManager.playCollect();
        this.scene.remove(core.mesh);
        this.collectibles.splice(i, 1);
        continue;
      }

      if (core.mesh.position.z > 15) {
        this.scene.remove(core.mesh);
        this.collectibles.splice(i, 1);
      }
    }

    // ⚡ Anillos de Hipervelocidad (Speed Rings)
    for (let i = this.speedRings.length - 1; i >= 0; i--) {
      const ring = this.speedRings[i];
      ring.mesh.position.z += speedDelta;
      if (ring.mesh.userData && ring.mesh.userData.outerMesh) {
        ring.mesh.userData.outerMesh.rotation.z += 1.8 * delta;
      }

      if (!ring.triggered && this.p1.alive) {
        const dx = Math.abs(this.p1.currentX - ring.mesh.position.x);
        const dz = Math.abs(this.p1.currentZ - ring.mesh.position.z);
        if (dx < 2.4 && dz < 2.2) {
          ring.triggered = true;
          this.p1.boostEnergy = 100;
          this.p1.speed = this.maxSpeed * 1.35;
          this.p1.score += 300;
          window.audioManager.playCollect();

          // Flash cian de hipervelocidad
          this.damageFlash.style.background = 'rgba(0, 240, 255, 0.45)';
          this.damageFlash.style.opacity = '0.75';
          setTimeout(() => {
            this.damageFlash.style.opacity = '0';
            this.damageFlash.style.background = 'rgba(255, 0, 60, 0.4)';
          }, 180);
        }
      }

      if (ring.mesh.position.z > 20) {
        this.scene.remove(ring.mesh);
        this.speedRings.splice(i, 1);
      }
    }

    // 🔼 Rampas de Salto Cuánticas (Jump Pads)
    for (let i = this.jumpPads.length - 1; i >= 0; i--) {
      const pad = this.jumpPads[i];
      pad.mesh.position.z += speedDelta;

      if (!this.p1.isJumping && this.p1.alive) {
        const dx = Math.abs(this.p1.currentX - pad.mesh.position.x);
        const dz = Math.abs(this.p1.currentZ - pad.mesh.position.z);
        if (dx < 1.9 && dz < 2.2) {
          this.p1.isJumping = true;
          this.p1.jumpVelocity = 18.5;
          this.p1.score += 150;
          window.audioManager.playLaser();
        }
      }

      if (pad.mesh.position.z > 20) {
        this.scene.remove(pad.mesh);
        this.jumpPads.splice(i, 1);
      }
    }

    // 🎯 Proyectiles de Plasma de Torretas Centinela
    for (let i = this.turretBullets.length - 1; i >= 0; i--) {
      const bolt = this.turretBullets[i];
      bolt.mesh.position.z += bolt.speed * 60 * delta;

      const isAirborne = (this.p1.jumpY && this.p1.jumpY > 1.8);
      if (!isAirborne && this.p1.alive && this.p1.ship.position.distanceTo(bolt.mesh.position) < 1.4) {
        this.scene.remove(bolt.mesh);
        this.turretBullets.splice(i, 1);
        this.gameOver('DESTRUIDO POR TORRETA', 'Un proyectil de plasma centinela pulverizó tu nave');
        return;
      }

      if (bolt.mesh.position.z > 20) {
        this.scene.remove(bolt.mesh);
        this.turretBullets.splice(i, 1);
      }
    }

    // 🏁 Meta / Arco Holográfico de Llegada en Modo Mapa Personalizado
    if (this.isCustomMapMode && this.finishArch) {
      this.finishArch.position.z += speedDelta;
      if (this.finishArch.position.z >= 0) {
        this.gameOver('¡CIRCUITO DEL EDITOR SUPERADO! 🏆', `¡Has cruzado la meta de tu circuito con ${Math.floor(this.p1.score)} pts!`, true);
        return;
      }
    }

    // Cámaras Split-Screen (Ángulo elevado desde arriba)
    if (this.gameMode === '3P') {
      const camY3P = 8.2;
      const camZOffset = 11.8;
      const lookY3P = 0.2;
      const lookAhead = 28;

      this.cameraP1.position.x += (this.p1.currentX - this.cameraP1.position.x) * 10 * delta;
      this.cameraP1.position.y = camY3P;
      this.cameraP1.position.z = this.p1.currentZ + camZOffset;
      this.cameraP1.lookAt(this.p1.currentX, lookY3P, this.p1.currentZ - lookAhead);

      this.cameraP2.position.x += (this.p2.currentX - this.cameraP2.position.x) * 10 * delta;
      this.cameraP2.position.y = camY3P;
      this.cameraP2.position.z = this.p2.currentZ + camZOffset;
      this.cameraP2.lookAt(this.p2.currentX, lookY3P, this.p2.currentZ - lookAhead);

      this.cameraP3.position.x += (this.p3.currentX - this.cameraP3.position.x) * 10 * delta;
      this.cameraP3.position.y = camY3P;
      this.cameraP3.position.z = this.p3.currentZ + camZOffset;
      this.cameraP3.lookAt(this.p3.currentX, lookY3P, this.p3.currentZ - lookAhead);

      this.check3PVictoryConditions();
    } else if (this.gameMode === '2P') {
      const camY2P = 4.8;
      const camZOffset = 9.6;
      const lookY2P = 0.8;
      const lookAhead = 20;

      this.cameraP1.position.x += (this.p1.currentX - this.cameraP1.position.x) * 10 * delta;
      this.cameraP1.position.y = camY2P;
      this.cameraP1.position.z = this.p1.currentZ + camZOffset;
      this.cameraP1.lookAt(this.p1.currentX, lookY2P, this.p1.currentZ - lookAhead);

      this.cameraP2.position.x += (this.p2.currentX - this.cameraP2.position.x) * 10 * delta;
      this.cameraP2.position.y = camY2P;
      this.cameraP2.position.z = this.p2.currentZ + camZOffset;
      this.cameraP2.lookAt(this.p2.currentX, lookY2P, this.p2.currentZ - lookAhead);

      this.check2PVictoryConditions();
    } else {
      this.camera.position.x += (this.p1.currentX * 0.45 - this.camera.position.x) * 8 * delta;
      this.camera.position.y = 4.2;
      this.camera.position.z = 9.2;
      this.camera.lookAt(0, 1.0, -18);
    }
  }

  check2PVictoryConditions() {
    if (this.p1.score >= this.GOAL_POINTS) {
      this.gameOver('¡VICTORIA DEL JUGADOR 1!', '¡Alcanzó primero los 10,000 Puntos!');
      return;
    }
    if (this.p2.score >= this.GOAL_POINTS) {
      this.gameOver('¡VICTORIA DEL JUGADOR 2!', '¡Alcanzó primero los 10,000 Puntos!');
      return;
    }

    if (this.p1.distance >= this.GOAL_METERS) {
      this.gameOver('¡JUGADOR 1 CRUZA LA META!', `¡Cruzó la meta de 5,000 metros con ${Math.floor(this.p1.score)} pts!`);
      return;
    }
    if (this.p2.distance >= this.GOAL_METERS) {
      this.gameOver('¡JUGADOR 2 CRUZA LA META!', `¡Cruzó la meta de 5,000 metros con ${Math.floor(this.p2.score)} pts!`);
      return;
    }

    if (!this.p1.alive && !this.p2.alive) {
      this.gameOver('AMBOS VEHÍCULOS DESTRUIDOS', 'Empate catastrófico en la pista.');
    } else if (!this.p1.alive) {
      this.gameOver('¡VICTORIA DEL JUGADOR 2!', 'Jugador 1 colisionó contra un obstáculo.');
    } else if (!this.p2.alive) {
      this.gameOver('¡VICTORIA DEL JUGADOR 1!', 'Jugador 2 colisionó contra un obstáculo.');
    }
  }

  check3PVictoryConditions() {
    // 1. Condición de 10,000 Puntos por recolección de orbes
    if (this.p1.score >= this.GOAL_POINTS) {
      this.gameOver('¡VICTORIA DEL JUGADOR 1!', '¡Alcanzó primero los 10,000 Puntos con orbes!');
      return;
    }
    if (this.p2.score >= this.GOAL_POINTS) {
      this.gameOver('¡VICTORIA DEL JUGADOR 2!', '¡Alcanzó primero los 10,000 Puntos con orbes!');
      return;
    }
    if (this.p3.score >= this.GOAL_POINTS) {
      this.gameOver('¡VICTORIA DEL JUGADOR 3!', '¡Alcanzó primero los 10,000 Puntos con orbes!');
      return;
    }

    // 2. Condición de 5,000 metros
    if (this.p1.distance >= this.GOAL_METERS) {
      this.gameOver('¡JUGADOR 1 GANA LA CARRERA!', `¡Cruzó la meta de 5,000 metros con ${Math.floor(this.p1.score)} pts!`);
      return;
    }
    if (this.p2.distance >= this.GOAL_METERS) {
      this.gameOver('¡JUGADOR 2 GANA LA CARRERA!', `¡Cruzó la meta de 5,000 metros con ${Math.floor(this.p2.score)} pts!`);
      return;
    }
    if (this.p3.distance >= this.GOAL_METERS) {
      this.gameOver('¡JUGADOR 3 GANA LA CARRERA!', `¡Cruzó la meta de 5,000 metros con ${Math.floor(this.p3.score)} pts!`);
      return;
    }

    // 3. Condición de supervivencia cuando hay obstáculos activados
    if (this.obstaclesEnabled) {
      const aliveCount = (this.p1.alive ? 1 : 0) + (this.p2.alive ? 1 : 0) + (this.p3.alive ? 1 : 0);
      if (aliveCount === 0) {
        this.gameOver('TODOS LOS VEHÍCULOS DESTRUIDOS', 'Empate catastrófico en la pista.');
        return;
      } else if (aliveCount === 1) {
        if (this.p1.alive) this.gameOver('¡VICTORIA DEL JUGADOR 1!', '¡Único superviviente de la carrera!');
        else if (this.p2.alive) this.gameOver('¡VICTORIA DEL JUGADOR 2!', '¡Único superviviente de la carrera!');
        else if (this.p3.alive) this.gameOver('¡VICTORIA DEL JUGADOR 3!', '¡Único superviviente de la carrera!');
        return;
      }
    }
  }

  updateHUD() {
    if (this.gameMode === '3P') {
      this.p1ScoreDisplay.innerText = `${Math.floor(this.p1.score)} pts`;
      this.p1DistDisplay.innerText = `${Math.floor(this.p1.distance)} m`;

      this.p2ScoreDisplay.innerText = `${Math.floor(this.p2.score)} pts`;
      this.p2DistDisplay.innerText = `${Math.floor(this.p2.distance)} m`;

      this.p3ScoreDisplay.innerText = `${Math.floor(this.p3.score)} pts`;
      this.p3DistDisplay.innerText = `${Math.floor(this.p3.distance)} m`;

      const avgBoost = (this.p1.boostEnergy + this.p2.boostEnergy + this.p3.boostEnergy) / 3;
      this.boostBar.style.width = `${Math.floor(avgBoost)}%`;
    } else if (this.gameMode === '2P') {
      this.p1ScoreDisplay.innerText = `${Math.floor(this.p1.score)} pts`;
      this.p1DistDisplay.innerText = `${Math.floor(this.p1.distance)} m`;
      this.p1StatusBadge.innerText = this.p1.alive ? '⚡ VIVO' : '💥 DESTRUIDO';
      this.p1StatusBadge.style.color = this.p1.alive ? '#00f0ff' : '#ff0055';

      this.p2ScoreDisplay.innerText = `${Math.floor(this.p2.score)} pts`;
      this.p2DistDisplay.innerText = `${Math.floor(this.p2.distance)} m`;
      this.p2StatusBadge.innerText = this.p2.alive ? '⚡ VIVO' : '💥 DESTRUIDO';
      this.p2StatusBadge.style.color = this.p2.alive ? '#ff007f' : '#ff0055';

      const avgBoost = (this.p1.boostEnergy + this.p2.boostEnergy) / 2;
      this.boostBar.style.width = `${Math.floor(avgBoost)}%`;
    } else {
      this.p1ScoreDisplay.innerText = `${Math.floor(this.p1.score)} pts`;
      this.p1DistDisplay.innerText = `${Math.floor(this.p1.distance)} m`;
      this.highscoreDisplay.innerText = `${this.highScore} pts`;
      this.coresDisplay.innerText = `⚡ META: 10K / 5KM`;
      this.boostBar.style.width = `${Math.floor(this.p1.boostEnergy)}%`;
    }

    const kmh = Math.round(this.currentSpeed * 100);
    this.speedDisplay.innerText = kmh;

    // Actualización de HUD de Misiles
    if (this.missileHudLabel && this.missileStatusText && this.missileCooldownBar) {
      const isMobile = this.isTouchDevice || window.innerWidth <= 1024;
      if (this.gameMode === '3P') {
        this.missileHudLabel.innerText = isMobile ? '🚀 MISILES' : '🚀 MISILES [Q | ↓ | K]';
        const readyCount = (this.p1.missileTimer <= 0 ? 1 : 0) + (this.p2.missileTimer <= 0 ? 1 : 0) + (this.p3.missileTimer <= 0 ? 1 : 0);
        if (readyCount === 3) {
          this.missileStatusText.innerText = '3 LISTOS';
          this.missileStatusText.style.color = '#00ff88';
          this.missileCooldownBar.style.width = '100%';
          this.missileCooldownBar.classList.remove('reloading');
        } else {
          const avgTimer = (this.p1.missileTimer + this.p2.missileTimer + this.p3.missileTimer) / 3;
          const pct = Math.floor(((this.p1.missileCooldown - avgTimer) / this.p1.missileCooldown) * 100);
          this.missileStatusText.innerText = `${readyCount}/3 LISTOS`;
          this.missileStatusText.style.color = '#ffaa00';
          this.missileCooldownBar.style.width = `${Math.max(10, Math.min(100, pct))}%`;
          this.missileCooldownBar.classList.add('reloading');
        }
      } else if (this.gameMode === '2P') {
        this.missileHudLabel.innerText = isMobile ? '🚀 MISILES' : '🚀 MISILES [P1: Q] [P2: ↓]';
        const p1Ready = this.p1.missileTimer <= 0;
        const p2Ready = this.p2.missileTimer <= 0;
        if (p1Ready && p2Ready) {
          this.missileStatusText.innerText = 'LISTOS (2)';
          this.missileStatusText.style.color = '#00ff88';
          this.missileCooldownBar.style.width = '100%';
          this.missileCooldownBar.classList.remove('reloading');
        } else {
          const statusParts = [];
          if (p1Ready) statusParts.push('P1 OK');
          else statusParts.push(`P1 ${this.p1.missileTimer.toFixed(1)}s`);
          if (p2Ready) statusParts.push('P2 OK');
          else statusParts.push(`P2 ${this.p2.missileTimer.toFixed(1)}s`);
          this.missileStatusText.innerText = statusParts.join(' | ');
          this.missileStatusText.style.color = '#ffaa00';
          const avgTimer = (this.p1.missileTimer + this.p2.missileTimer) / 2;
          const pct = Math.floor(((this.p1.missileCooldown - avgTimer) / this.p1.missileCooldown) * 100);
          this.missileCooldownBar.style.width = `${Math.max(10, Math.min(100, pct))}%`;
          this.missileCooldownBar.classList.add('reloading');
        }
      } else {
        this.missileHudLabel.innerText = isMobile ? '🚀 MISIL' : '🚀 MISIL [Q / ↓]';
        if (this.p1.missileTimer <= 0) {
          this.missileStatusText.innerText = 'LISTO';
          this.missileStatusText.style.color = '#00ff88';
          this.missileCooldownBar.style.width = '100%';
          this.missileCooldownBar.classList.remove('reloading');
        } else {
          const pct = Math.floor(((this.p1.missileCooldown - this.p1.missileTimer) / this.p1.missileCooldown) * 100);
          this.missileStatusText.innerText = `${this.p1.missileTimer.toFixed(1)}s`;
          this.missileStatusText.style.color = '#ffaa00';
          this.missileCooldownBar.style.width = `${pct}%`;
          this.missileCooldownBar.classList.add('reloading');
        }
      }
    }

    // Actualización visual de botón táctil de Misil para móviles
    if (this.touchBtnMissile && this.touchMissileFill) {
      if (this.p1.missileTimer <= 0) {
        this.touchBtnMissile.classList.remove('cooling');
        this.touchMissileFill.style.height = '0%';
        if (this.touchMissileText) this.touchMissileText.innerText = 'MISIL';
      } else {
        this.touchBtnMissile.classList.add('cooling');
        const pct = Math.floor((this.p1.missileTimer / this.p1.missileCooldown) * 100);
        this.touchMissileFill.style.height = `${pct}%`;
        if (this.touchMissileText) this.touchMissileText.innerText = `${this.p1.missileTimer.toFixed(1)}s`;
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.state === 'PLAYING') {
      this.updatePlayer(this.p1, this.keys.p1Left, this.keys.p1Right, this.keys.p1Boost, delta);
      if (this.gameMode === '2P' || this.gameMode === '3P') {
        this.updatePlayer(this.p2, this.keys.p2Left, this.keys.p2Right, this.keys.p2Boost, delta);
      }
      if (this.gameMode === '3P') {
        this.updatePlayer(this.p3, this.keys.p3Left, this.keys.p3Right, this.keys.p3Boost, delta);
      }
      this.updateWorld(delta);
      this.spawnEntities();
      this.updateHUD();
    } else if (this.state === 'EDITOR') {
      this.updateEditor(delta);
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setViewport(0, 0, width, height);
      this.renderer.setScissorTest(false);
      this.renderer.clear();
      this.renderer.render(this.scene, this.editorCamera);
      return;
    } else if (this.state === 'PAUSED') {
      return;
    } else if (this.state === 'START' || this.state === 'GAMEOVER') {
      if (this.p1.ship) {
        this.p1.ship.rotation.y = Math.sin(this.clock.getElapsedTime() * 1.5) * 0.2;
        this.p1.ship.position.y = 0.85 + Math.sin(this.clock.getElapsedTime() * 3) * 0.1;
      }
      if (this.p2.ship && (this.gameMode === '2P' || this.gameMode === '3P')) {
        this.p2.ship.rotation.y = Math.sin(this.clock.getElapsedTime() * 1.5 + 1) * 0.2;
        this.p2.ship.position.y = 0.85 + Math.sin(this.clock.getElapsedTime() * 3 + 1) * 0.1;
      }
      if (this.p3.ship && this.gameMode === '3P') {
        this.p3.ship.rotation.y = Math.sin(this.clock.getElapsedTime() * 1.5 + 2) * 0.2;
        this.p3.ship.position.y = 0.85 + Math.sin(this.clock.getElapsedTime() * 3 + 2) * 0.1;
      }
    }

    // RENDER LOOP
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.gameMode === '3P') {
      // Split-Screen en 3 partes exactas
      this.renderer.setScissorTest(true);
      const thirdW = Math.floor(width / 3);

      // --- 1/3 IZQUIERDA: P1 ---
      this.renderer.setViewport(0, 0, thirdW, height);
      this.renderer.setScissor(0, 0, thirdW, height);
      this.renderer.clear();
      this.renderer.render(this.scene, this.cameraP1);

      // --- 2/3 CENTRO: P2 ---
      this.renderer.setViewport(thirdW, 0, thirdW, height);
      this.renderer.setScissor(thirdW, 0, thirdW, height);
      this.renderer.render(this.scene, this.cameraP2);

      // --- 3/3 DERECHA: P3 ---
      const remW = width - (thirdW * 2);
      this.renderer.setViewport(thirdW * 2, 0, remW, height);
      this.renderer.setScissor(thirdW * 2, 0, remW, height);
      this.renderer.render(this.scene, this.cameraP3);

      this.renderer.setScissorTest(false);
    } else if (this.gameMode === '2P') {
      this.renderer.setScissorTest(true);
      const halfW = Math.floor(width / 2);

      this.renderer.setViewport(0, 0, halfW, height);
      this.renderer.setScissor(0, 0, halfW, height);
      this.renderer.clear();
      this.renderer.render(this.scene, this.cameraP1);

      this.renderer.setViewport(halfW, 0, width - halfW, height);
      this.renderer.setScissor(halfW, 0, width - halfW, height);
      this.renderer.render(this.scene, this.cameraP2);

      this.renderer.setScissorTest(false);
    } else {
      this.renderer.setViewport(0, 0, width, height);
      this.renderer.setScissorTest(false);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Inicialización del juego al cargar el documento
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new NeonHorizonGame();
});
