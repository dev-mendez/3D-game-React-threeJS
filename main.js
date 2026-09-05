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
    this.btnResume = document.getElementById('btn-resume');
    this.btnPause = document.getElementById('btn-pause');
    this.btnAudio = document.getElementById('btn-audio');

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
      lastShotTime: 0
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
      lastShotTime: 0
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
      lastShotTime: 0
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

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050512, 0.007);

    const fullAspect = window.innerWidth / window.innerHeight;
    const halfAspect = (window.innerWidth / 2) / window.innerHeight;
    const thirdAspect = (window.innerWidth / 3) / window.innerHeight;

    // Cámara 1P
    this.camera = new THREE.PerspectiveCamera(62, fullAspect, 0.1, 450);
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
        // Solo en 1P y 2P hay disparo; en 3P es carrera pura de orbes
        if (this.state === 'PLAYING' && this.p1.alive && this.gameMode !== '3P') {
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
          if (this.state === 'PLAYING' && this.p2.alive && this.gameMode !== '3P') {
            this.shoot(this.p2, 0xff007f);
          }
        }
      } else {
        if (e.code === 'ArrowLeft') this.keys.p1Left = true;
        if (e.code === 'ArrowRight') this.keys.p1Right = true;
        if (e.code === 'ArrowUp') this.keys.p1Boost = true;
      }

      // P3: J, L, I (En modo 3P)
      if (this.gameMode === '3P') {
        if (e.code === 'KeyJ') this.keys.p3Left = true;
        if (e.code === 'KeyL') this.keys.p3Right = true;
        if (e.code === 'KeyI') this.keys.p3Boost = true;
      }

      if (e.code === 'KeyP') {
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
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
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      this.p1.targetX = normalizedX * (this.roadWidth / 2 - 1.2);
    });

    window.addEventListener('resize', () => {
      const fullAspect = window.innerWidth / window.innerHeight;
      const halfAspect = (window.innerWidth / 2) / window.innerHeight;
      const thirdAspect = (window.innerWidth / 3) / window.innerHeight;

      this.camera.aspect = fullAspect;
      this.camera.updateProjectionMatrix();

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
    });

    this.btnStart.addEventListener('click', () => this.startGame());
    this.btnRestart.addEventListener('click', () => this.startGame());
    this.btnResume.addEventListener('click', () => this.togglePause());
    this.btnPause.addEventListener('click', () => this.togglePause());

    this.btnAudio.addEventListener('click', () => {
      const isMuted = window.audioManager.toggleMute();
      this.btnAudio.innerText = isMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ON';
    });
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

  startGame() {
    this.state = 'PLAYING';
    this.distance = 0;
    this.currentSpeed = this.baseSpeed;

    // Reset P1 (Vía 1: Izquierda)
    this.p1.score = 0;
    this.p1.distance = 0;
    this.p1.speed = this.baseSpeed;
    this.p1.alive = true;
    this.p1.boostEnergy = 60;
    this.p1.isBoosting = false;
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
    this.p3.targetX = 14;
    this.p3.currentX = 14;
    this.p3.targetZ = 0;
    this.p3.currentZ = 0;
    this.p3.roll = 0;
    this.p3.ship.position.set(14, 0.85, 0);
    this.p3.ship.visible = (this.gameMode === '3P');

    // Limpiar entidades activas
    for (const obj of [...this.obstacles, ...this.collectibles, ...this.projectiles]) {
      this.scene.remove(obj.mesh);
    }
    this.obstacles = [];
    this.collectibles = [];
    this.projectiles = [];

    // Ocultar pantallas
    this.startScreen.classList.add('hidden');
    this.gameoverScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
    this.btnPause.innerText = '⏸️ PAUSA [P]';

    window.audioManager.startMusic();
  }

  gameOver(winnerMessage, subtitleMessage) {
    this.state = 'GAMEOVER';
    window.audioManager.playCrash();

    this.damageFlash.style.opacity = '1';
    setTimeout(() => { this.damageFlash.style.opacity = '0'; }, 200);

    if (this.gameMode === '2P' || this.gameMode === '3P') {
      this.singleResultBox.style.display = 'none';
      this.p2ResultBox.style.display = 'flex';

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
      this.singleResultBox.style.display = 'flex';
      this.p2ResultBox.style.display = 'none';

      if (this.p1.score > this.highScore) {
        this.highScore = Math.floor(this.p1.score);
        localStorage.setItem('neon_horizon_highscore', this.highScore.toString());
      }

      this.gameoverTitle.innerText = 'SEÑAL PERDIDA';
      this.gameoverSubtitle.innerText = 'EL VEHÍCULO HA SIDO DESTRUIDO';
      this.finalScore.innerText = `${Math.floor(this.distance)} m`;
      this.finalCores.innerText = Math.floor(this.p1.score / 150).toString();
    }

    this.gameoverScreen.classList.remove('hidden');
  }

  spawnEntities() {
    if (this.distance < 35) return;

    // EN MODO 3P: ¡CERO OBSTÁCULOS! Solo orbes
    if (this.gameMode !== '3P') {
      const lastObstacle = this.obstacles[this.obstacles.length - 1];
      if (!lastObstacle || lastObstacle.mesh.position.z >= -195) {
        const spawnRate = (this.gameMode === '2P') ? 0.024 : 0.035;

        if (Math.random() < spawnRate) {
          let laneX = 0;
          if (this.gameMode === '2P') {
            const side = Math.random() > 0.5 ? -1 : 1;
            laneX = side * (3.0 + Math.random() * 8.5);
          } else {
            laneX = (Math.random() - 0.5) * (this.roadWidth - 4.5);
          }

          const isLaser = Math.random() > 0.45;

          if (isLaser) {
            const isDestructible = Math.random() > 0.35;
            const barrierColor = isDestructible ? 0xff0044 : 0x9400d3;

            const barrierGroup = new THREE.Group();
            const laserCoreGeo = new THREE.BoxGeometry(3.0, 0.4, 0.2);
            const laserCoreMat = new THREE.MeshBasicMaterial({ color: isDestructible ? 0xffffff : 0xe0b0ff });
            const laserCore = new THREE.Mesh(laserCoreGeo, laserCoreMat);
            barrierGroup.add(laserCore);

            const laserGlowGeo = new THREE.BoxGeometry(3.2, 0.75, 0.3);
            const laserGlowMat = new THREE.MeshBasicMaterial({
              color: barrierColor,
              transparent: true,
              opacity: 0.88
            });
            const laserGlow = new THREE.Mesh(laserGlowGeo, laserGlowMat);
            barrierGroup.add(laserGlow);

            const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.8, 10);
            const postMat = new THREE.MeshStandardMaterial({
              color: isDestructible ? 0x222233 : 0x4a154b,
              metalness: 0.9,
              roughness: 0.2
            });

            const postLeft = new THREE.Mesh(postGeo, postMat);
            postLeft.position.set(-1.6, 0, 0);
            barrierGroup.add(postLeft);

            const postRight = new THREE.Mesh(postGeo, postMat);
            postRight.position.set(1.6, 0, 0);
            barrierGroup.add(postRight);

            barrierGroup.position.set(laneX, 1.1, -220);
            this.scene.add(barrierGroup);
            this.obstacles.push({
              mesh: barrierGroup,
              radius: 1.6,
              isBarrier: true,
              destructible: isDestructible
            });
          } else {
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
              ring: ringMesh,
              destructible: true
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

    const hoverY = 0.85 + Math.sin(this.clock.getElapsedTime() * 7 + (player === this.p2 ? 2 : (player === this.p3 ? 4 : 0))) * 0.08;

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

    // Proyectiles (solo en 1P y 2P)
    for (let pIdx = this.projectiles.length - 1; pIdx >= 0; pIdx--) {
      const proj = this.projectiles[pIdx];
      proj.mesh.position.z -= proj.speed;

      let hit = false;
      for (let oIdx = this.obstacles.length - 1; oIdx >= 0; oIdx--) {
        const obs = this.obstacles[oIdx];
        const distToObs = proj.mesh.position.distanceTo(obs.mesh.position);

        if (distToObs < (obs.radius + 1.2)) {
          hit = true;
          if (obs.destructible) {
            window.audioManager.playExplosion();
            this.scene.remove(obs.mesh);
            this.obstacles.splice(oIdx, 1);
            if (proj.owner) proj.owner.score += 120;
          } else {
            window.audioManager.playKick(window.audioManager.ctx.currentTime);
          }
          break;
        }
      }

      if (hit || proj.mesh.position.z < -240) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(pIdx, 1);
      }
    }

    // Obstáculos (1P y 2P)
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.mesh.position.z += speedDelta;

      if (obs.isDrone) {
        obs.mesh.rotation.y += 2.0 * delta;
        if (obs.ring) obs.ring.rotation.z += 4.5 * delta;
      } else if (obs.isBarrier) {
        obs.mesh.position.y = 1.1 + Math.sin(this.clock.getElapsedTime() * 4 + i) * 0.12;
      }

      if (this.p1.alive && this.p1.ship.position.distanceTo(obs.mesh.position) < (obs.radius + 0.65)) {
        if (this.gameMode === '2P') {
          this.p1.alive = false;
          this.p1.ship.visible = false;
          window.audioManager.playCrash();
        } else {
          this.gameOver();
          return;
        }
      }

      if (this.gameMode === '2P' && this.p2.alive && this.p2.ship.position.distanceTo(obs.mesh.position) < (obs.radius + 0.65)) {
        this.p2.alive = false;
        this.p2.ship.visible = false;
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
