import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const TargetIcon = ({ size = 24, className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const AwardIcon = ({ size = 24, className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const HelpCircleIcon = ({ size = 24, className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function StressLab({ onClaimAllocation }) {
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'victory', 'gameover'
  const [score, setScoreState] = useState(0); // Tangible HUD score
  const [shotsLeft, setShotsLeft] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [brickValue, setBrickValueState] = useState(1499); // Appreciating HUD value
  
  // Physics thread refs to prevent infinite React re-render loops
  const scoreRef = useRef(0);
  const brickValueRef = useRef(1499);

  // Math ROI ratio relative to B R I Q U E price of $1,499.00
  const roiVal = score > 0 ? Math.floor((score / 1499) * 100) : 0;
  const [logLines, setLogLines] = useState([
    `[CONSOLE] B R I Q U E KINETIC ROI ENGINE ONLINE.`,
    `[CONSOLE] Target structure loaded: [Planned Obsolescence Assets].`,
    `[CONSOLE] Fling B R I Q U E to rescue depreciating tech into your portfolio.`
  ]);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const gameTimeRef = useRef(0);

  // Sound Synthesizer via Web Audio API
  const playSound = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (type === 'launch') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'thud') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.45, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'shatter') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'bubble_pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn('Web Audio fail:', e);
    }
  };

  const addLog = (msg) => {
    setLogLines((prev) => {
      const next = [...prev, msg];
      if (next.length > 8) next.shift();
      return next;
    });
  };

  const createInitialBlocks = () => {
    const arr = [];
    
    // Bottom support shelf
    arr.push({ id: 1, x: 500, y: 340, w: 32, h: 40, type: 'doorstop', color: '#7F8C8D', health: 2, maxHealth: 2, scoreVal: 15, currentVal: 15, depreciates: false, alive: true, vy: 0 });
    arr.push({ id: 2, x: 500, y: 295, w: 32, h: 45, type: 'iphone', color: '#3498DB', health: 1, maxHealth: 1, scoreVal: 1299, currentVal: 1299, depreciates: true, rate: 12, alive: true, vy: 0 });
    
    arr.push({ id: 3, x: 588, y: 340, w: 32, h: 40, type: 'doorstop', color: '#7F8C8D', health: 2, maxHealth: 2, scoreVal: 15, currentVal: 15, depreciates: false, alive: true, vy: 0 });
    arr.push({ id: 4, x: 588, y: 295, w: 32, h: 45, type: 'iphone', color: '#3498DB', health: 1, maxHealth: 1, scoreVal: 1299, currentVal: 1299, depreciates: true, rate: 12, alive: true, vy: 0 });

    // Glass platform
    arr.push({ id: 5, x: 480, y: 285, w: 160, h: 10, type: 'shelf', color: 'rgba(255,255,255,0.4)', health: 1, maxHealth: 1, scoreVal: 999, currentVal: 999, depreciates: true, rate: 8, alive: true, vy: 0 });

    // Top support
    arr.push({ id: 6, x: 544, y: 240, w: 32, h: 45, type: 'iphone', color: '#3498DB', health: 1, maxHealth: 1, scoreVal: 1299, currentVal: 1299, depreciates: true, rate: 12, alive: true, vy: 0 });
    arr.push({ id: 7, x: 540, y: 195, w: 40, h: 45, type: 'smartwatch', color: '#F1C40F', health: 1, maxHealth: 1, scoreVal: 499, currentVal: 499, depreciates: true, rate: 5, alive: true, vy: 0 });

    // Volatile market bubble balanced in the center
    arr.push({ 
      id: 8, 
      x: 560, 
      y: 135, 
      w: 36, 
      h: 36, 
      type: 'bubble', 
      color: 'radial-gradient(circle, #F39C12 0%, #D35400 100%)', 
      health: 1, 
      maxHealth: 1, 
      scoreVal: 500, 
      currentVal: 500, 
      depreciates: false, 
      alive: true, 
      vy: 0,
      age: 0,
      maxAge: 7.5, // pops after 7.5 seconds
      radius: 18
    });

    return arr;
  };

  const startNewGame = () => {
    scoreRef.current = 0;
    brickValueRef.current = 1499;
    setScoreState(0);
    setShotsLeft(3);
    setBrickValueState(1499);
    gameTimeRef.current = 0;
    setGameState('playing');
    addLog(`[SYSTEM] Slingshot armed. Fling B R I Q U E to secure assets.`);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn("Canvas 2D context is unavailable!");
      return;
    }
    const width = canvas.width;
    const height = canvas.height;

    const floorY = 380;
    let blocks = createInitialBlocks();
    let particles = [];
    let shockwaves = [];
    let floatingTexts = [];

    let projectile = {
      x: 120,
      y: 280,
      vx: 0,
      vy: 0,
      state: 'slingshot',
      size: 32,
      hSize: 16
    };

    const slingX = 120;
    const slingY = 280;
    let isDragging = false;
    let dragPos = { x: slingX, y: slingY };
    let lastTime = performance.now();

    if (gameState === 'playing') {
      blocks = createInitialBlocks();
    }

    const checkCollision = (rect1, rect2) => {
      return (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y
      );
    };

    const spawnTriangularShards = (x, y, color, count = 12) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 7,
          vy: -3 - Math.random() * 5,
          gravity: 0.22,
          color,
          size: 4 + Math.random() * 6,
          angle: Math.random() * Math.PI * 2,
          angularVel: (Math.random() - 0.5) * 0.15,
          alpha: 1.0,
          fade: 0.015 + Math.random() * 0.015
        });
      }
    };

    const spawnShockwave = (x, y, maxR = 80) => {
      shockwaves.push({ x, y, r: 5, maxR, alpha: 1.0 });
    };

    const spawnFloatingText = (x, y, text, color = '#2ECC71') => {
      floatingTexts.push({ x, y, text, color, alpha: 1.0, vy: -1.2 });
    };

    const handleMouseDown = (e) => {
      if (gameState !== 'playing' || projectile.state !== 'slingshot') return;
      
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const mX = (clientX - rect.left) * (width / rect.width);
      const mY = (clientY - rect.top) * (height / rect.height);

      const dist = Math.hypot(mX - slingX, mY - slingY);
      if (dist < 45) {
        isDragging = true;
        dragPos = { x: mX, y: mY };
      }
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const mX = (clientX - rect.left) * (width / rect.width);
      const mY = (clientY - rect.top) * (height / rect.height);

      const dx = mX - slingX;
      const dy = mY - slingY;
      const pullDist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const maxPull = 80;

      if (pullDist > maxPull) {
        dragPos.x = slingX + Math.cos(angle) * maxPull;
        dragPos.y = slingY + Math.sin(angle) * maxPull;
      } else {
        dragPos.x = mX;
        dragPos.y = mY;
      }

      projectile.x = dragPos.x;
      projectile.y = dragPos.y;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      
      const dx = dragPos.x - slingX;
      const dy = dragPos.y - slingY;
      
      projectile.vx = -dx * 0.17;
      projectile.vy = -dy * 0.17;
      projectile.state = 'flying';
      
      playSound('launch');
      addLog(`[LAUNCH] B R I Q U E projected. Storing kinetic presence...`);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleMouseDown, { passive: true });
    canvas.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // Dynamic Physics Update Tick
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.03, (now - lastTime) / 1000); // capped delta
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Deep Obsidian Luxury Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#09090C');
      skyGrad.addColorStop(1, '#050506');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Cinematic Volumetric Light Beams (shining down from top-right)
      ctx.fillStyle = 'rgba(197, 168, 128, 0.015)';
      ctx.beginPath();
      ctx.moveTo(width * 0.8, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(width * 0.4, height);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width * 0.3, 0);
      ctx.lineTo(width * 0.5, 0);
      ctx.lineTo(width * 0.15, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Subtle Background Grid
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 35) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 35) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Real-Time planned obsolescence clock & Swell Bubble math
      if (gameState === 'playing') {
        gameTimeRef.current += dt;
        brickValueRef.current = 1499 + Math.floor(gameTimeRef.current * 1.5);
        setBrickValueState(brickValueRef.current);

        blocks.forEach((b) => {
          if (!b.alive) return;

          // Planned obsolescence depreciation
          if (b.depreciates && b.currentVal > 0) {
            b.currentVal = Math.max(0, b.currentVal - b.rate * dt);
            if (b.currentVal <= 0 && b.type !== 'ewaste') {
              b.type = 'ewaste';
              b.color = '#55555C'; // e-waste turns flat grey
              addLog(`[OBSOLETED] Asset depreciated to zero. Classified as E-Waste.`);
            }
          }

          // Hype Bubble Swelling Math
          if (b.type === 'bubble') {
            b.age += dt;
            // Oscillate and swell
            const swellRatio = b.age / b.maxAge;
            b.radius = 18 + Math.sin(b.age * 5) * 2 + swellRatio * 16;
            b.w = b.radius * 2;
            b.h = b.radius * 2;

            // Check if bubble burst limit reached (Market Crash!)
            if (b.age >= b.maxAge) {
              b.alive = false;
              spawnTriangularShards(b.x, b.y, '#E67E22', 20);
              spawnShockwave(b.x, b.y, 140);
              playSound('bubble_pop');
              
              // Halve all adjacent assets
              blocks.forEach((other) => {
                if (other.id !== b.id && other.alive && other.currentVal > 0) {
                  const dist = Math.hypot(other.x - b.x, other.y - b.y);
                  if (dist < 150) {
                    other.currentVal = Math.floor(other.currentVal * 0.45);
                    spawnFloatingText(other.x, other.y - 15, 'Bubble Pop: -55% Value', '#E74C3C');
                  }
                }
              });
              addLog(`[CRITICAL] Hype bubble burst (Market Crash). Adjacent values slashed by 55%.`);
            }
          }
        });
      }

      // Draw Slingshot Rubber Band
      if (projectile.state === 'slingshot') {
        const pullDist = Math.hypot(projectile.x - slingX, projectile.y - slingY);
        // Tension shifts color from gold/amber to deep crimson
        const intensity = Math.min(1, pullDist / 80);
        const tensionR = Math.floor(197 + (192 - 197) * intensity);
        const tensionG = Math.floor(168 + (57 - 168) * intensity);
        const tensionB = Math.floor(128 + (43 - 128) * intensity);
        
        ctx.strokeStyle = `rgb(${tensionR},${tensionG},${tensionB})`;
        ctx.lineWidth = 3.5 + intensity * 2;
        ctx.beginPath();
        // Left prong connection
        ctx.moveTo(slingX - 16, slingY - 8);
        ctx.lineTo(projectile.x, projectile.y);
        // Right prong connection
        ctx.moveTo(slingX + 16, slingY - 8);
        ctx.lineTo(projectile.x, projectile.y);
        ctx.stroke();

        // Trajectory projection
        if (isDragging) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 5]);
          ctx.beginPath();
          
          let tX = projectile.x;
          let tY = projectile.y;
          let tVx = -(projectile.x - slingX) * 0.17;
          let tVy = -(projectile.y - slingY) * 0.17;
          
          ctx.moveTo(tX, tY);
          for (let step = 0; step < 24; step++) {
            tX += tVx;
            tY += tVy;
            tVy += 0.22;
            ctx.lineTo(tX, tY);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Slingshot Marble Pillar
      ctx.fillStyle = '#18181D';
      ctx.strokeStyle = 'rgba(197,168,128,0.2)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(slingX - 6, slingY, 12, 100);
      ctx.strokeRect(slingX - 6, slingY, 12, 100);
      // Prongs
      ctx.fillStyle = '#1D1D24';
      ctx.fillRect(slingX - 20, slingY - 10, 8, 12);
      ctx.fillRect(slingX + 12, slingY - 10, 8, 12);

      // Floor (Pedigree Base)
      ctx.fillStyle = '#060608';
      ctx.strokeStyle = 'rgba(197,168,128,0.25)';
      ctx.lineWidth = 3;
      ctx.fillRect(0, floorY, width, height - floorY);
      ctx.strokeRect(0, floorY, width, height - floorY);

      // Luxury Marble Target Pedestal
      ctx.fillStyle = '#15151A';
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(460, 375, 210, 10);
      ctx.strokeRect(460, 375, 210, 10);

      // Physics logic & Draw Target Sprites
      let targetsRemaining = false;
      blocks.forEach((b) => {
        if (!b.alive) return;
        if (b.type !== 'doorstop' && b.type !== 'shelf') {
          targetsRemaining = true;
        }

        // Apply gravity if unsupported
        let onSolidGround = b.y + b.h >= floorY;
        let supported = false;

        if (!onSolidGround) {
          blocks.forEach((other) => {
            if (other.id !== b.id && other.alive) {
              const xOverlap = Math.abs(b.x - other.x) < 25;
              const yContact = Math.abs((b.y + b.h) - other.y) < 6;
              if (xOverlap && yContact) {
                supported = true;
              }
            }
          });
        }

        if (!onSolidGround && !supported) {
          b.vy += 0.22;
          b.y += b.vy;
        } else {
          b.vy = 0;
        }

        if (b.y + b.h > floorY) {
          b.y = floorY - b.h;
        }

        // Vector Drawings (Clean, Professional Sprites)
        if (b.type === 'iphone') {
          // Draw smartphone body
          ctx.fillStyle = b.color;
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(b.x, b.y, b.w, b.h, 4);
          } else {
            let r = 4;
            ctx.moveTo(b.x + r, b.y);
            ctx.arcTo(b.x + b.w, b.y, b.x + b.w, b.y + b.h, r);
            ctx.arcTo(b.x + b.w, b.y + b.h, b.x, b.y + b.h, r);
            ctx.arcTo(b.x, b.y + b.h, b.x, b.y, r);
            ctx.arcTo(b.x, b.y, b.x + b.w, b.y, r);
            ctx.closePath();
          }
          ctx.fill();
          ctx.stroke();

          // Screen reflection line
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.beginPath();
          ctx.moveTo(b.x + 2, b.y + 4);
          ctx.lineTo(b.x + b.w - 2, b.y + b.h - 10);
          ctx.stroke();

          // Camera notch
          ctx.fillStyle = '#0D0D10';
          ctx.fillRect(b.x + b.w/2 - 6, b.y + 1, 12, 3);

          // Value Text
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 8px monospace';
          ctx.fillText(`$${Math.floor(b.currentVal)}`, b.x + 3, b.y + b.h - 8);
        }
        else if (b.type === 'smartwatch') {
          // Watch straps
          ctx.fillStyle = '#2C3E50';
          ctx.fillRect(b.x + 12, b.y, 16, 8);
          ctx.fillRect(b.x + 12, b.y + b.h - 8, 16, 8);

          // Watch display body
          ctx.fillStyle = '#000000';
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(b.x + b.w/2, b.y + b.h/2, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Screen details
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 7px sans-serif';
          ctx.fillText(`$${Math.floor(b.currentVal)}`, b.x + b.w/2 - 13, b.y + b.h/2 + 3);
        }
        else if (b.type === 'doorstop') {
          // Beveled metal triangular wedge
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y + b.h);
          ctx.lineTo(b.x + b.w, b.y + b.h);
          ctx.lineTo(b.x + b.w, b.y);
          ctx.closePath();
          ctx.fill();
          
          // Highlights
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.stroke();

          ctx.fillStyle = '#000000';
          ctx.font = '8px monospace';
          ctx.fillText(`$${b.currentVal}`, b.x + 4, b.y + b.h - 4);
        }
        else if (b.type === 'shelf') {
          // Translucent luxury shelf
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.strokeRect(b.x, b.y, b.w, b.h);

          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.font = 'bold 8px monospace';
          ctx.fillText(`GLASS SHELF ($${Math.floor(b.currentVal)})`, b.x + 15, b.y + 8);
        }
        else if (b.type === 'bubble') {
          // Pulsing glowing Hype Bubble
          const bubbleGrad = ctx.createRadialGradient(
            b.x, b.y, b.radius * 0.1,
            b.x, b.y, b.radius
          );
          bubbleGrad.addColorStop(0, '#FFF5E6');
          bubbleGrad.addColorStop(0.3, '#F39C12');
          bubbleGrad.addColorStop(1, 'rgba(211, 84, 0, 0.4)');
          
          ctx.fillStyle = bubbleGrad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#E67E22';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Bubble text label
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('HYPE', b.x - 12, b.y + 3);
        }
        else if (b.type === 'ewaste') {
          // Dull e-waste block
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeRect(b.x, b.y, b.w, b.h);

          ctx.fillStyle = '#8E8E93';
          ctx.font = '7px sans-serif';
          ctx.fillText('E-WASTE', b.x + 2, b.y + 12);
        }
      });

      // Victory Condition check
      if (gameState === 'playing' && !targetsRemaining) {
        setGameState('victory');
        setHighScore((prev) => Math.max(prev, scoreRef.current));
        confetti({
          particleCount: 180,
          spread: 85,
          origin: { y: 0.6 }
        });
        addLog(`[VICTORY] All modern tech targets successfully audited and secured.`);
      }

      // Flying projectile logic
      if (projectile.state === 'flying') {
        projectile.vy += 0.22;
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;

        const brickRect = {
          x: projectile.x - projectile.hSize,
          y: projectile.y - 8,
          w: projectile.size,
          h: 16
        };

        blocks.forEach((b) => {
          if (!b.alive) return;

          // Colliders map to target geometries
          let blockRect = { x: b.x, y: b.y, w: b.w, h: b.h };
          if (b.type === 'bubble') {
            // Circle bounding box mapping
            blockRect = { x: b.x - b.radius, y: b.y - b.radius, w: b.radius * 2, h: b.radius * 2 };
          }

          if (checkCollision(brickRect, blockRect)) {
            b.health -= 1;
            playSound('thud');

            projectile.vx = -projectile.vx * 0.45;
            projectile.vy = -projectile.vy * 0.45;
            projectile.x += projectile.vx * 1.5;
            projectile.y += projectile.vy * 1.5;

            // Trigger visual hit effect
            spawnShockwave(projectile.x, projectile.y, 45);

            if (b.health <= 0) {
              b.alive = false;
              spawnTriangularShards(b.x + b.w / 2, b.y + b.h / 2, b.type === 'bubble' ? '#E67E22' : b.color, 18);
              
              if (b.type === 'bubble') {
                const deflationYield = b.scoreVal;
                playSound('bubble_pop');
                spawnShockwave(b.x, b.y, 140);
                scoreRef.current += deflationYield;
                setScoreState(scoreRef.current);
                spawnFloatingText(b.x, b.y, `+$${deflationYield} Deflation Yield`, 'rgba(200,169,110,0.9)');
                
                // Explode nearby items safely
                blocks.forEach((other) => {
                  if (other.id !== b.id && other.alive) {
                    const d = Math.hypot(other.x - b.x, other.y - b.y);
                    if (d < 120) {
                      other.health -= 1;
                      if (other.health <= 0) {
                        other.alive = false;
                        spawnTriangularShards(other.x + other.w/2, other.y + other.h/2, other.color, 15);
                        scoreRef.current += Math.floor(other.currentVal);
                        setScoreState(scoreRef.current);
                        spawnFloatingText(other.x, other.y, `+$${Math.floor(other.currentVal)} Saved`, '#2ECC71');
                      }
                    }
                  }
                });
                addLog(`[BUBBLE DEFLATED] Deflated valuation hype. Shockwave triggered. Saved $${deflationYield}.`);
              } else {
                const savedVal = Math.floor(b.currentVal);
                playSound('shatter');
                scoreRef.current += savedVal;
                setScoreState(scoreRef.current);
                
                if (savedVal > 0) {
                  spawnFloatingText(b.x, b.y, `+$${savedVal} Saved`, '#2ECC71');
                } else {
                  spawnFloatingText(b.x, b.y, `$0 E-waste`, '#8E8E93');
                }

                let promoLog = '';
                if (b.type === 'doorstop') {
                  promoLog = `[SAVED] $15 doorstop crushed. B R I Q U E offers 200x more physical aura.`;
                } else if (b.type === 'iphone') {
                  promoLog = `[SAVED] Obsolete smartphone pulverized. Rescued $${savedVal} from battery failure.`;
                } else if (b.type === 'shelf') {
                  promoLog = `[SAVED] Fragile glass shelf smashed. Rescued $${savedVal} from glass breakage.`;
                } else if (b.type === 'smartwatch') {
                  promoLog = `[SAVED] Silicon watch smashed. Rescued $${savedVal} from planned software decay.`;
                } else {
                  promoLog = `[SAVED] E-waste cleared. B R I Q U E physical presence verified.`;
                }
                addLog(promoLog);
              }
            } else {
              addLog(`[IMPACT] Collided with target. Structure cracked.`);
            }
          }
        });

        // Ground check
        if (projectile.y + 10 > floorY) {
          projectile.y = floorY - 10;
          projectile.vy = -projectile.vy * 0.35;
          projectile.vx *= 0.85;
          
          if (Math.abs(projectile.vx) < 0.1 && Math.abs(projectile.vy) < 0.1) {
            projectile.vx = 0;
            projectile.vy = 0;
            triggerReset();
          }
        }

        if (projectile.x > width + 40 || projectile.x < -40 || projectile.y > height + 40) {
          triggerReset();
        }
      }

      // Reset flinger sequence
      if (projectile.state === 'resetting') {
        projectile.x += (slingX - projectile.x) * 0.15;
        projectile.y += (slingY - projectile.y) * 0.15;

        if (Math.hypot(projectile.x - slingX, projectile.y - slingY) < 1.5) {
          projectile.x = slingX;
          projectile.y = slingY;
          projectile.vx = 0;
          projectile.vy = 0;
          projectile.state = 'slingshot';
          
          setShotsLeft((prev) => {
            const next = prev - 1;
            if (next <= 0 && gameState === 'playing' && targetsRemaining) {
              setGameState('gameover');
              addLog(`[CRITICAL] Ballistics supply depleted. Registry allocation advised.`);
            } else if (next > 0) {
              addLog(`[SYSTEM] B R I Q U E re-pedestaled. Ready throw #${4 - next}.`);
            }
            return next;
          });
        }
      }

      // Draw projectile B R I Q U E (Round bevel red block)
      ctx.fillStyle = '#C0392B';
      ctx.strokeStyle = '#922B21';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(projectile.x - 16, projectile.y - 9, 32, 18, 3);
      } else {
        let r = 3;
        let px = projectile.x - 16;
        let py = projectile.y - 9;
        let pw = 32;
        let ph = 18;
        ctx.moveTo(px + r, py);
        ctx.arcTo(px + pw, py, px + pw, py + ph, r);
        ctx.arcTo(px + pw, py + ph, px, py + ph, r);
        ctx.arcTo(px, py + ph, px, py, r);
        ctx.arcTo(px, py, px + pw, py, r);
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();

      // SPECULAR REFLECTION
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(projectile.x - 14, projectile.y - 8, 28, 5);

      // Appreciating brick value printed on the brick
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 6px sans-serif';
      ctx.fillText(`$${brickValueRef.current}`, projectile.x - 10, projectile.y + 4);

      // Render rotating debris particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.angle += p.angularVel;
        p.alpha -= p.fade;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        
        ctx.beginPath();
        // Draw rotating triangle shard
        const cos = Math.cos(p.angle) * p.size;
        const sin = Math.sin(p.angle) * p.size;
        ctx.moveTo(p.x + cos, p.y + sin);
        ctx.lineTo(p.x - sin, p.y + cos);
        ctx.lineTo(p.x + sin, p.y - cos);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1.0;

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        }
      });

      // Render expanding hit shockwave rings
      shockwaves.forEach((sw, idx) => {
        sw.r += 3.5;
        sw.alpha -= 0.04;
        
        ctx.strokeStyle = `rgba(197, 168, 128, ${Math.max(0, sw.alpha)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.alpha <= 0) {
          shockwaves.splice(idx, 1);
        }
      });

      // Render floating indicators
      floatingTexts.forEach((ft, idx) => {
        ft.y += ft.vy;
        ft.alpha -= 0.015;

        ctx.fillStyle = ft.color;
        ctx.font = 'bold 9px monospace';
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillText(ft.text, ft.x - 20, ft.y);
        ctx.globalAlpha = 1.0;

        if (ft.alpha <= 0) {
          floatingTexts.splice(idx, 1);
        }
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    const triggerReset = () => {
      projectile.state = 'resetting';
    };

    tick();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [gameState]);

  return (
    <div id="ballistics-game" style={{
      margin: '2rem auto',
      maxWidth: '1100px',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--ink-2, #111118)',
      border: '1px solid rgba(200, 169, 110, 0.18)',
      borderRadius: '18px',
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .sl-header {
          padding: 2.5rem 2.5rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .sl-eyebrow {
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: rgba(200,169,110,0.6);
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .sl-eyebrow::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1px;
          background: rgba(200,169,110,0.4);
        }

        .sl-title {
          font-size: 1.6rem;
          letter-spacing: 0.12em;
          color: white;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .sl-desc {
          color: rgba(180,180,190,0.5);
          font-size: 0.78rem;
          max-width: 500px;
          margin-top: 0.5rem;
          line-height: 1.6;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
        }

        .sl-hud {
          display: flex;
          gap: 0;
          font-family: 'JetBrains Mono', monospace;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .sl-hud-cell {
          padding: 0.75rem 1.25rem;
          border-right: 1px solid rgba(255,255,255,0.06);
          min-width: 90px;
        }
        .sl-hud-cell:last-child { border-right: none; }
        .sl-hud-label {
          font-size: 0.55rem;
          color: rgba(110,110,126,0.8);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.3rem;
        }
        .sl-hud-val {
          font-size: 1.1rem;
          font-weight: 500;
          color: white;
        }

        .sl-body {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 0;
          border-top: none;
        }

        @media (max-width: 900px) {
          .sl-body { grid-template-columns: 1fr; }
          .sl-terminal { min-height: 200px !important; }
        }

        .sl-canvas-wrap {
          position: relative;
          cursor: crosshair;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .sl-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          z-index: 10;
          text-align: center;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .sl-overlay-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.56rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .sl-overlay-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          margin-bottom: 0.75rem;
          color: white;
        }

        .sl-overlay-body {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-size: 0.875rem;
          color: rgba(180,180,190,0.55);
          max-width: 400px;
          line-height: 1.65;
          margin-bottom: 2.25rem;
        }

        .sl-btn-primary {
          background: linear-gradient(135deg, #EDE0C8 0%, #C8A96E 45%, #8A6F3E 100%);
          color: #0A0A0F;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          padding: 0.85rem 2.25rem;
          border-radius: 2px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .sl-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(200,169,110,0.25);
        }

        .sl-btn-ghost {
          background: transparent;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          padding: 0.85rem 2.25rem;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sl-btn-ghost:hover { opacity: 0.8; }

        .sl-unlock-badge {
          border: 1px solid rgba(200,169,110,0.2);
          padding: 0.75rem 2rem;
          border-radius: 2px;
          background: rgba(200,169,110,0.03);
          margin-bottom: 2rem;
        }
        .sl-unlock-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.54rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: rgba(200,169,110,0.6);
          margin-bottom: 0.3rem;
        }
        .sl-unlock-code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.95rem;
          font-weight: 500;
          color: white;
          letter-spacing: 0.14em;
        }

        .sl-terminal {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 300px;
          background: rgba(5,5,8,0.5);
        }

        .sl-terminal-header {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(58,58,74,0.9);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          padding-bottom: 0.6rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sl-live-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #2ecc71;
          box-shadow: 0 0 6px rgba(46,204,113,0.5);
          flex-shrink: 0;
          animation: sl-blink 2s ease-in-out infinite;
        }
        @keyframes sl-blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .sl-log-feed {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.67rem;
          flex: 1;
          overflow: hidden;
        }

        .sl-log-line {
          margin-bottom: 0.6rem;
          line-height: 1.4;
        }

        .sl-terminal-footer {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          color: rgba(58,58,74,0.75);
          border-top: 1px solid rgba(255,255,255,0.04);
          padding-top: 0.7rem;
          margin-top: 0.75rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.5;
        }

        .sl-btn-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>

      {/* ── Header / HUD ── */}
      <div className="sl-header">
        <div>
          <div className="sl-eyebrow">Audit Console · B R I Q U E Labs</div>
          <div className="sl-title">
            The&nbsp;<span style={{ background: 'linear-gradient(135deg,#EDE0C8 0%,#C8A96E 45%,#8A6F3E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>B R I Q U E</span>&nbsp;Audit
          </div>
          <p className="sl-desc">
            Fling the appreciating B R I Q U E to smash depreciating smart tech
            and pop Hype Bubbles before they crash adjacent asset values.
          </p>
        </div>

        <div className="sl-hud">
          <div className="sl-hud-cell">
            <div className="sl-hud-label">Value Rescued</div>
            <div className="sl-hud-val" style={{ color: '#2ECC71' }}>${score}</div>
          </div>
          <div className="sl-hud-cell">
            <div className="sl-hud-label">Throws Left</div>
            <div className="sl-hud-val" style={{ color: shotsLeft === 1 ? '#E74C3C' : 'white' }}>
              {gameState === 'playing' ? shotsLeft : '—'}
            </div>
          </div>
          <div className="sl-hud-cell">
            <div className="sl-hud-label">Inertia ROI</div>
            <div className="sl-hud-val" style={{ color: 'rgba(200,169,110,0.9)' }}>+{roiVal}%</div>
          </div>
        </div>
      </div>

      {/* ── Game Body ── */}
      <div className="sl-body">

        {/* Canvas */}
        <div className="sl-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={700}
            height={400}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />

          {/* Idle overlay */}
          {gameState === 'idle' && (
            <div className="sl-overlay" style={{ background: 'rgba(5,5,8,0.88)' }}>
              <TargetIcon size={40} style={{ color: 'rgba(200,169,110,0.7)', marginBottom: '1.5rem' }} />
              <div className="sl-overlay-eyebrow" style={{ color: 'rgba(200,169,110,0.6)' }}>Ready · Awaiting Audit Initiation</div>
              <div className="sl-overlay-title">B R I Q U E &nbsp; S M A S H</div>
              <p className="sl-overlay-body">
                Smartphone and watch values depreciate in real-time. Hype Bubbles
                swell and burst, causing market crashes. Smash them quickly to
                secure their remaining value.
              </p>
              <button className="sl-btn-primary" onClick={startNewGame} id="game-start-btn">
                Begin Value Audit
              </button>
            </div>
          )}

          {/* Game Over overlay */}
          {gameState === 'gameover' && (
            <div className="sl-overlay" style={{ background: 'rgba(5,5,8,0.93)' }}>
              <div className="sl-overlay-eyebrow" style={{ color: 'rgba(231,76,60,0.7)' }}>Audit Concluded · Assets Remain Standing</div>
              <div className="sl-overlay-title" style={{ color: '#E74C3C' }}>Audit Failed</div>
              <p className="sl-overlay-body">
                You ran out of throws. Depreciating smart tech remains on the shelf.
                Bypass the audit and claim the B R I Q U E directly to establish physical security.
              </p>
              <div className="sl-btn-row">
                <button className="sl-btn-primary" onClick={onClaimAllocation} id="game-bypass-btn">
                  Bypass & Claim Allocation
                </button>
                <button
                  className="sl-btn-ghost"
                  style={{ border: '1px solid rgba(231,76,60,0.4)', color: '#E74C3C' }}
                  onClick={startNewGame}
                  id="game-retry-btn"
                >
                  Re-Fire Kiln
                </button>
              </div>
            </div>
          )}

          {/* Victory overlay */}
          {gameState === 'victory' && (
            <div className="sl-overlay" style={{ background: 'rgba(5,5,8,0.95)' }}>
              <AwardIcon size={44} style={{ color: 'rgba(200,169,110,0.85)', marginBottom: '1.25rem', animation: 'float 4s ease-in-out infinite' }} />
              <div className="sl-overlay-eyebrow" style={{ color: 'rgba(200,169,110,0.6)' }}>Portfolio Certified · Victory Achieved</div>
              <div className="sl-overlay-title">Assets Secured</div>
              <p className="sl-overlay-body">
                You rescued <strong style={{ color: 'rgba(200,169,110,0.9)', fontStyle: 'normal' }}>${score}</strong> from planned obsolescence,
                proving a <strong style={{ color: 'rgba(200,169,110,0.9)', fontStyle: 'normal' }}>+{roiVal}% ROI</strong> by choosing B R I Q U E.
              </p>
              <div className="sl-unlock-badge">
                <div className="sl-unlock-label">Kiln-Access Code Unlocked</div>
                <div className="sl-unlock-code">SMASH-TECH-2026</div>
              </div>
              <div className="sl-btn-row">
                <button className="sl-btn-primary" onClick={onClaimAllocation} id="game-claim-btn">
                  Claim Registry Allocation
                </button>
                <button
                  className="sl-btn-ghost"
                  style={{ border: '1px solid rgba(200,169,110,0.2)', color: 'rgba(200,169,110,0.7)' }}
                  onClick={startNewGame}
                  id="game-again-btn"
                >
                  Smash Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Terminal */}
        <div className="sl-terminal">
          <div>
            <div className="sl-terminal-header">
              <span className="sl-live-dot" />
              Audit Telemetry Feed
            </div>
            <div className="sl-log-feed">
              {logLines.map((line, idx) => {
                let color = 'rgba(200,169,110,0.5)';
                if (line.includes('[CRITICAL]')) color = 'rgba(231,76,60,0.8)';
                if (line.includes('[SYSTEM]'))   color = 'rgba(241,196,15,0.65)';
                if (line.includes('[SAVED]') || line.includes('[VICTORY]')) color = 'rgba(46,204,113,0.8)';
                if (line.includes('[LAUNCH]'))   color = 'rgba(241,196,15,0.65)';
                if (line.includes('[CONSOLE]'))  color = 'rgba(200,169,110,0.35)';
                if (line.includes('[IMPACT]'))   color = 'rgba(200,169,110,0.55)';
                return (
                  <div key={idx} className="sl-log-line" style={{ color }}>
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sl-terminal-footer">
            <HelpCircleIcon size={10} style={{ flexShrink: 0, marginTop: '1px' }} />
            Drag the Brique left to aim & release to launch. Smash tech to rescue depreciating asset value.
          </div>
        </div>
      </div>
    </div>
  );
}
