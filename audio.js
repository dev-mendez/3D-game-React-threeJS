// audio.js - Procedural Web Audio API Engine
// Genera música Synthwave interactiva y efectos de sonido en tiempo real sin archivos externos
// Optimizado para evitar fugas de nodos de audio, sonidos persistentes o confusiones con disparos

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.musicInterval = null;
    this.step = 0;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') {
        this.ctx.resume();
      }
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  startMusic() {
    this.init();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    // Escala menor armónica suave para ambientación Synthwave cyberpunk
    const bassNotes = [65.41, 65.41, 77.78, 87.31, 98.00, 87.31, 77.78, 65.41]; 
    const padNotes = [196.00, 220.00, 246.94, 261.63];
    const beatDuration = 160; // ms
    
    this.musicInterval = setInterval(() => {
      if (!this.isPlayingMusic || this.isMuted || !this.ctx) return;

      const t = this.ctx.currentTime;
      const noteIdx = this.step % bassNotes.length;
      
      // Línea de bajo Synthwave atmosférica
      if (this.step % 2 === 0) {
        this.playBassNote(bassNotes[noteIdx], t, 0.22);
      }

      // Bombo suave de ritmo
      if (this.step % 4 === 0) {
        this.playKick(t);
      }

      // Caja rítmica sutil (baja ganancia, sin ruido estridente)
      if (this.step % 8 === 4) {
        this.playSnare(t);
      }

      // Plato cerrado suave
      if (this.step % 2 === 1) {
        this.playHiHat(t);
      }

      // Pad armónico suave cada 8 pulsos (no compite con los disparos)
      if (this.step % 8 === 0) {
        const padIdx = (Math.floor(this.step / 8)) % padNotes.length;
        this.playLeadNote(padNotes[padIdx], t, 0.45);
      }

      this.step++;
    }, beatDuration);
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  playBassNote(freq, time, dur) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, time);
    filter.frequency.exponentialRampToValueAtTime(75, time + dur);

    gain.gain.setValueAtTime(0.26, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur - 0.01);
    gain.gain.setValueAtTime(0, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { osc.stop(); } catch (e) {}
      try { osc.disconnect(); filter.disconnect(); gain.disconnect(); } catch (e) {}
    };
    osc.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    osc.start(time);
    osc.stop(time + dur);
  }

  playLeadNote(freq, time, dur) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur - 0.01);
    gain.gain.setValueAtTime(0, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { osc.stop(); } catch (e) {}
      try { osc.disconnect(); filter.disconnect(); gain.disconnect(); } catch (e) {}
    };
    osc.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    osc.start(time);
    osc.stop(time + dur);
  }

  playKick(time) {
    if (!this.ctx || this.isMuted) return;
    const dur = 0.12;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + dur);

    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur - 0.01);
    gain.gain.setValueAtTime(0, time + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { osc.stop(); } catch (e) {}
      try { osc.disconnect(); gain.disconnect(); } catch (e) {}
    };
    osc.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    osc.start(time);
    osc.stop(time + dur);
  }

  playSnare(time) {
    if (!this.ctx || this.isMuted) return;
    const dur = 0.12;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.16, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur - 0.01);
    gain.gain.setValueAtTime(0, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { noise.stop(); } catch (e) {}
      try { noise.disconnect(); filter.disconnect(); gain.disconnect(); } catch (e) {}
    };
    noise.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    noise.start(time);
    noise.stop(time + dur);
  }

  playHiHat(time) {
    if (!this.ctx || this.isMuted) return;
    const dur = 0.04;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(3200, time);

    gain.gain.setValueAtTime(0.04, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur - 0.005);
    gain.gain.setValueAtTime(0, time + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { osc.stop(); } catch (e) {}
      try { osc.disconnect(); gain.disconnect(); } catch (e) {}
    };
    osc.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    osc.start(time);
    osc.stop(time + dur);
  }

  playCollect() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const dur = 0.18;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t); // E5
    osc.frequency.exponentialRampToValueAtTime(1318.51, t + dur); // E6

    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    gain.gain.setValueAtTime(0, t + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { osc.stop(); } catch (e) {}
      try { osc.disconnect(); gain.disconnect(); } catch (e) {}
    };
    osc.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    osc.start(t);
    osc.stop(t + dur);
  }

  playTurbo() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const dur = 0.28;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + dur);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    gain.gain.setValueAtTime(0, t + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { osc.stop(); } catch (e) {}
      try { osc.disconnect(); gain.disconnect(); } catch (e) {}
    };
    osc.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    osc.start(t);
    osc.stop(t + dur);
  }

  // SFX: Disparo de cañón láser de la nave (GARANTIZADO que se apaga y no persiste)
  playLaser() {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const t = this.ctx.currentTime;
    const dur = 0.10; // Duración corta y nítida

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + dur);

    // Caída exponencial hasta silencio absoluto
    gain.gain.setValueAtTime(0.24, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    gain.gain.setValueAtTime(0, t + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    // Desconexión forzosa garantizada de nodos Web Audio
    const cleanup = () => {
      try { osc.stop(); } catch (e) {}
      try {
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    };

    osc.onended = cleanup;
    setTimeout(cleanup, (dur + 0.04) * 1000);

    osc.start(t);
    osc.stop(t + dur);
  }

  // SFX: Rebote de láser contra barrera blindada
  playDeflect() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const dur = 0.09;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + dur);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    gain.gain.setValueAtTime(0, t + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { osc.stop(); } catch (e) {}
      try { osc.disconnect(); gain.disconnect(); } catch (e) {}
    };

    osc.onended = cleanup;
    setTimeout(cleanup, (dur + 0.04) * 1000);

    osc.start(t);
    osc.stop(t + dur);
  }

  // SFX: Lanzamiento de misil con empuje y auto-apagado
  playMissileLaunch() {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const t = this.ctx.currentTime;
    const dur = 0.28;

    // Tono ascendente de aceleración
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + dur);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    gain.gain.setValueAtTime(0, t + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    const cleanupOsc = () => {
      try { osc.stop(); } catch (e) {}
      try { osc.disconnect(); gain.disconnect(); } catch (e) {}
    };
    osc.onended = cleanupOsc;
    setTimeout(cleanupOsc, (dur + 0.05) * 1000);
    osc.start(t);
    osc.stop(t + dur);

    // Rugido de plasma filtrado
    const noiseDur = 0.30;
    const bufferSize = Math.floor(this.ctx.sampleRate * noiseDur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.32));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + noiseDur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.32, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + noiseDur - 0.01);
    noiseGain.gain.setValueAtTime(0, t + noiseDur);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    const cleanupNoise = () => {
      try { noise.stop(); } catch (e) {}
      try { noise.disconnect(); filter.disconnect(); noiseGain.disconnect(); } catch (e) {}
    };
    noise.onended = cleanupNoise;
    setTimeout(cleanupNoise, (noiseDur + 0.05) * 1000);

    noise.start(t);
    noise.stop(t + noiseDur);
  }

  // SFX: Destrucción de barrera o dron
  playExplosion() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const dur = 0.22;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.exponentialRampToValueAtTime(70, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.48, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    gain.gain.setValueAtTime(0, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { noise.stop(); } catch (e) {}
      try { noise.disconnect(); filter.disconnect(); gain.disconnect(); } catch (e) {}
    };
    noise.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    noise.start(t);
    noise.stop(t + dur);
  }

  // SFX: Detonación pesada de misil
  playHeavyExplosion() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const dur = 0.42;

    // Sub-bass thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(130, t);
    subOsc.frequency.exponentialRampToValueAtTime(28, t + dur);
    subGain.gain.setValueAtTime(0.55, t);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    subGain.gain.setValueAtTime(0, t + dur);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    const cleanupSub = () => {
      try { subOsc.stop(); } catch (e) {}
      try { subOsc.disconnect(); subGain.disconnect(); } catch (e) {}
    };
    subOsc.onended = cleanupSub;
    setTimeout(cleanupSub, (dur + 0.05) * 1000);
    subOsc.start(t);
    subOsc.stop(t + dur);

    // Explosión estruendosa
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, t);
    filter.frequency.exponentialRampToValueAtTime(50, t + dur);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    gain.gain.setValueAtTime(0, t + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    const cleanupNoise = () => {
      try { noise.stop(); } catch (e) {}
      try { noise.disconnect(); filter.disconnect(); gain.disconnect(); } catch (e) {}
    };
    noise.onended = cleanupNoise;
    setTimeout(cleanupNoise, (dur + 0.05) * 1000);

    noise.start(t);
    noise.stop(t + dur);
  }

  playCrash() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const dur = 0.38;

    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, t);
    filter.frequency.exponentialRampToValueAtTime(50, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur - 0.01);
    gain.gain.setValueAtTime(0, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    const cleanup = () => {
      try { noise.stop(); } catch (e) {}
      try { noise.disconnect(); filter.disconnect(); gain.disconnect(); } catch (e) {}
    };
    noise.onended = cleanup;
    setTimeout(cleanup, (dur + 0.05) * 1000);

    noise.start(t);
    noise.stop(t + dur);
  }

  playVictory() {
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const t = startTime + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }
}

window.audioManager = new AudioManager();
