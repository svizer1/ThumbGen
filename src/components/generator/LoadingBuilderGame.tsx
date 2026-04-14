'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type WindowCell = {
  x: number;
  y: number;
  w: number;
  h: number;
  on: boolean;
  brightness: number;
  startBrightness: number;
  targetBrightness: number;
  fadeStart: number;
  fadeDuration: number;
  nextToggleAt: number;
};

type FloorBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  windows: WindowCell[];
  perfectGlowUntil: number;
};

type ActiveBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  windows: WindowCell[];
};

type FallingPiece = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  windows: WindowCell[];
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
};

type GameState = {
  blocks: FloorBlock[];
  active: ActiveBlock | null;
  falling: FallingPiece[];
  direction: 1 | -1;
  speed: number;
  cameraY: number;
  moveRange: number;
  lastTime: number;
  isGameOver: boolean;
  score: number;
};

const STORAGE_KEY = 'thumbnail-gen-builder-best-score';
const BLOCK_HEIGHT = 30;
const BASE_WIDTH = 220;
const PERFECT_THRESHOLD = 4;
const WINDOW_FADE_MS = 150;

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createWindows(width: number, height: number, litChance: number, nowMs: number): WindowCell[] {
  const paddingX = clamp(Math.floor(width * 0.05), 3, 8);
  const paddingY = 5;
  const rows = height > 26 ? 2 : 1;
  const rowGap = 4;

  const usableWidth = Math.max(8, width - paddingX * 2);
  let gap = clamp(Math.floor(width / 50), 2, 4);
  let cols = clamp(Math.floor((usableWidth + gap) / 10), 1, 24);
  let winW = (usableWidth - (cols - 1) * gap) / cols;

  while (cols > 1 && winW < 3.2) {
    cols -= 1;
    winW = (usableWidth - (cols - 1) * gap) / cols;
  }

  if (cols <= 1) {
    cols = 1;
    gap = 0;
    winW = usableWidth;
  }

  const winH = clamp((height - paddingY * 2 - (rows - 1) * rowGap) / rows, 7, 11);
  const startX = paddingX;

  const windows: WindowCell[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const on = Math.random() < litChance;
      const brightness = on ? rand(0.75, 1) : rand(0.05, 0.2);

      windows.push({
        x: startX + col * (winW + gap),
        y: paddingY + row * (winH + rowGap),
        w: winW,
        h: winH,
        on,
        brightness,
        startBrightness: brightness,
        targetBrightness: brightness,
        fadeStart: nowMs,
        fadeDuration: WINDOW_FADE_MS,
        nextToggleAt: nowMs + rand(800, 4000),
      });
    }
  }

  return windows;
}

function updateWindows(windows: WindowCell[], nowMs: number): void {
  for (const win of windows) {
    if (nowMs >= win.nextToggleAt) {
      win.on = !win.on;
      win.startBrightness = win.brightness;
      win.targetBrightness = win.on ? rand(0.75, 1) : rand(0.05, 0.2);
      win.fadeStart = nowMs;
      win.nextToggleAt = nowMs + rand(800, 4000);
    }

    const t = clamp((nowMs - win.fadeStart) / win.fadeDuration, 0, 1);
    win.brightness = win.startBrightness + (win.targetBrightness - win.startBrightness) * t;
  }
}

function palette(index: number): string {
  const hue = 210 + (index % 8) * 4;
  const sat = 18 + (index % 3) * 5;
  const light = 21 + (index % 5);
  return `hsl(${hue} ${sat}% ${light}%)`;
}

function createFloorBlock(x: number, y: number, width: number, score: number, nowMs: number): FloorBlock {
  const litChance = clamp(0.35 + Math.min(score, 40) * 0.01, 0.35, 0.85);
  return {
    x,
    y,
    width,
    height: BLOCK_HEIGHT,
    color: palette(score),
    windows: createWindows(width, BLOCK_HEIGHT, litChance, nowMs),
    perfectGlowUntil: 0,
  };
}

function createActiveBlock(top: FloorBlock, direction: 1 | -1, score: number, nowMs: number): ActiveBlock {
  const spawnX = direction === 1 ? -170 : 170;
  const litChance = clamp(0.35 + Math.min(score, 40) * 0.01, 0.35, 0.85);
  return {
    x: spawnX,
    y: top.y + BLOCK_HEIGHT,
    width: top.width,
    height: BLOCK_HEIGHT,
    color: palette(score + 1),
    windows: createWindows(top.width, BLOCK_HEIGHT, litChance, nowMs),
  };
}

function createInitialState(nowMs: number): GameState {
  const foundation = createFloorBlock(0, 0, BASE_WIDTH, 0, nowMs);
  return {
    blocks: [foundation],
    active: createActiveBlock(foundation, 1, 0, nowMs),
    falling: [],
    direction: 1,
    speed: 110,
    cameraY: 0,
    moveRange: 170,
    lastTime: nowMs,
    isGameOver: false,
    score: 0,
  };
}

export function LoadingBuilderGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const gameRef = useRef<GameState>(createInitialState(performance.now()));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(3);
  const lastProgressTickRef = useRef(0);

  const setBestIfNeeded = useCallback((nextScore: number) => {
    setBestScore((prev) => {
      if (nextScore <= prev) return prev;
      localStorage.setItem(STORAGE_KEY, String(nextScore));
      return nextScore;
    });
  }, []);

  const restartGame = useCallback(() => {
    const now = performance.now();
    gameRef.current = createInitialState(now);
    setScore(0);
    setGameOver(false);
  }, []);

  const placeBlock = useCallback(() => {
    const game = gameRef.current;
    if (game.isGameOver || !game.active) return;

    const top = game.blocks[game.blocks.length - 1];
    const active = game.active;
    const left0 = top.x - top.width / 2;
    const right0 = top.x + top.width / 2;
    const left1 = active.x - active.width / 2;
    const right1 = active.x + active.width / 2;
    const overlap = Math.min(right0, right1) - Math.max(left0, left1);

    if (overlap <= 0) {
      game.isGameOver = true;
      game.active = null;
      setGameOver(true);
      setBestIfNeeded(game.score);
      return;
    }

    const perfect = Math.abs(active.x - top.x) <= PERFECT_THRESHOLD;
    const newWidth = perfect ? top.width : overlap;
    const overlapLeft = Math.max(left0, left1);
    const overlapRight = overlapLeft + newWidth;
    const newX = perfect ? top.x : (overlapLeft + overlapRight) / 2;
    const cutWidth = active.width - newWidth;

    const newBlock = createFloorBlock(newX, active.y, newWidth, game.score + 1, performance.now());
    if (perfect) {
      newBlock.perfectGlowUntil = performance.now() + 260;
    }
    game.blocks.push(newBlock);

    if (cutWidth > 0.5) {
      const cutOnRight = active.x > top.x;
      const cutX = cutOnRight
        ? overlapRight + cutWidth / 2
        : overlapLeft - cutWidth / 2;

      game.falling.push({
        x: cutX,
        y: active.y,
        width: cutWidth,
        height: active.height,
        color: active.color,
        windows: createWindows(cutWidth, BLOCK_HEIGHT, 0.45, performance.now()),
        vx: cutOnRight ? 45 : -45,
        vy: -40,
        rotation: 0,
        rotationSpeed: cutOnRight ? 1.8 : -1.8,
      });
    }

    const points = 1 + (perfect ? 2 : 0);
    game.score += points;
    setScore(game.score);
    setBestIfNeeded(game.score);

    game.direction = game.direction === 1 ? -1 : 1;
    const speedSteps = Math.floor(game.blocks.length / 4);
    game.speed = 110 + speedSteps * 8;
    game.active = createActiveBlock(newBlock, game.direction, game.score, performance.now());
  }, [setBestIfNeeded]);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0) {
      setBestScore(stored);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        placeBlock();
      }
      if (event.code === 'KeyR' && gameRef.current.isGameOver) {
        restartGame();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [placeBlock, restartGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${Math.floor(width)}px`;
      canvas.style.height = `${Math.floor(height)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const render = (nowMs: number) => {
      const game = gameRef.current;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const groundY = height - 44;
      const centerX = width / 2;
      const dt = clamp((nowMs - game.lastTime) / 1000, 0, 0.033);
      game.lastTime = nowMs;

      if (!game.isGameOver && game.active) {
        game.active.x += game.direction * game.speed * dt;
        if (game.active.x > game.moveRange) {
          game.active.x = game.moveRange;
          game.direction = -1;
        } else if (game.active.x < -game.moveRange) {
          game.active.x = -game.moveRange;
          game.direction = 1;
        }
      }

      const top = game.blocks[game.blocks.length - 1];
      const cameraTarget = Math.max(0, top.y - 110);
      game.cameraY += (cameraTarget - game.cameraY) * Math.min(1, dt * 6);

      for (const block of game.blocks) {
        updateWindows(block.windows, nowMs);
      }
      if (game.active) {
        updateWindows(game.active.windows, nowMs);
      }
      for (const piece of game.falling) {
        piece.vy -= 980 * dt;
        piece.y += piece.vy * dt;
        piece.x += piece.vx * dt;
        piece.rotation += piece.rotationSpeed * dt;
        updateWindows(piece.windows, nowMs);
      }

      game.falling = game.falling.filter((piece) => piece.y + piece.height / 2 > game.cameraY - 240);

      if (nowMs - lastProgressTickRef.current > 320) {
        lastProgressTickRef.current = nowMs;
        setLoadingProgress((prev) => {
          if (prev >= 96) return prev;
          return Math.min(96, prev + rand(0.8, 2.2));
        });
      }

      const worldToScreenY = (worldY: number) => groundY - (worldY - game.cameraY);
      ctx.clearRect(0, 0, width, height);

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#0B1020');
      sky.addColorStop(1, '#111827');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const moonX = width - 68;
      const moonY = 62;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 54);
      moonGlow.addColorStop(0, 'rgba(253, 230, 138, 0.3)');
      moonGlow.addColorStop(1, 'rgba(253, 230, 138, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 54, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F8EFC5';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 15, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 55; i += 1) {
        const sx = ((i * 79.3) % (width + 120)) - 60;
        const sy = 20 + ((i * 37.7) % Math.max(80, groundY - 110));
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(nowMs * 0.0012 + i * 1.7));
        const size = 0.6 + (i % 3) * 0.35;
        ctx.fillStyle = `rgba(219, 234, 254, ${0.2 + twinkle * 0.55})`;
        ctx.fillRect(sx, sy, size, size);
      }

      const drawCloud = (seed: number, y: number, scale: number, alpha: number) => {
        const cloudX = ((nowMs * (0.01 + seed * 0.002) + seed * 180) % (width + 220)) - 140;
        ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
        ctx.beginPath();
        ctx.ellipse(cloudX, y, 36 * scale, 14 * scale, 0, 0, Math.PI * 2);
        ctx.ellipse(cloudX + 28 * scale, y - 6 * scale, 28 * scale, 12 * scale, 0, 0, Math.PI * 2);
        ctx.ellipse(cloudX + 55 * scale, y, 26 * scale, 11 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCloud(1, 88, 0.8, 0.1);
      drawCloud(2, 118, 1, 0.09);
      drawCloud(3, 72, 0.6, 0.12);

      const parallaxShift = (nowMs * 0.008) % 180;
      for (let layer = 0; layer < 3; layer += 1) {
        const baseY = groundY - 30 - layer * 18;
        const alpha = 0.16 + layer * 0.08;
        ctx.fillStyle = `rgba(23, 32, 54, ${alpha})`;
        const step = 70 - layer * 10;
        for (let i = -2; i < Math.ceil(width / step) + 4; i += 1) {
          const bx = i * step - parallaxShift * (0.2 + layer * 0.15);
          const bw = 40 + ((i + layer) % 3) * 12;
          const bh = 30 + ((i + layer * 2) % 5) * 12;
          ctx.fillRect(bx, baseY - bh, bw, bh);
        }
      }

      ctx.fillStyle = 'rgba(53, 63, 92, 0.65)';
      ctx.fillRect(0, groundY, width, height - groundY);

      ctx.fillStyle = 'rgba(21, 30, 49, 0.95)';
      ctx.fillRect(8, 12, width * 0.34, 8);
      ctx.fillRect(width * 0.24, 18, 5, 18);

      if (game.active) {
        const topY = game.active.y + game.active.height / 2;
        const blockTopScreenY = worldToScreenY(topY);
        const hookX = centerX + game.active.x;
        const trolleySway = Math.sin(nowMs * 0.003) * 10;
        const anchorX = hookX + trolleySway;
        const anchorY = 20;

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(anchorX, anchorY);
        ctx.quadraticCurveTo(anchorX + Math.sin(nowMs * 0.004) * 6, (anchorY + blockTopScreenY) / 2, hookX, blockTopScreenY - 4);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
        ctx.fillRect(anchorX - 6, anchorY - 4, 12, 6);
        ctx.beginPath();
        ctx.arc(hookX, blockTopScreenY - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < 4; i += 1) {
        const laneY = groundY + 6 + i * 8;
        const carX = ((nowMs * (0.06 + i * 0.015) + i * 120) % (width + 80)) - 40;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.fillRect(carX, laneY, 20, 5);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
        ctx.fillRect(carX + 18, laneY + 1, 2, 2);
      }

      const drawBlock = (
        block: { x: number; y: number; width: number; height: number; color: string; windows: WindowCell[]; perfectGlowUntil?: number },
        rotation = 0,
      ) => {
        const left = block.x - block.width / 2;
        const right = block.x + block.width / 2;
        const topY = block.y + block.height / 2;
        const bottomY = block.y - block.height / 2;
        const sx = centerX + left;
        const syTop = worldToScreenY(topY);
        const syBottom = worldToScreenY(bottomY);
        const h = syBottom - syTop;
        const w = right - left;

        ctx.save();
        ctx.translate(sx + w / 2, syTop + h / 2);
        ctx.rotate(rotation);
        ctx.translate(-w / 2, -h / 2);

        const facade = ctx.createLinearGradient(0, 0, 0, h);
        facade.addColorStop(0, 'rgba(255,255,255,0.05)');
        facade.addColorStop(0.2, block.color);
        facade.addColorStop(1, 'rgba(10,15,30,0.92)');
        ctx.fillStyle = facade;
        ctx.fillRect(0, 0, w, h);

        const topEdge = ctx.createLinearGradient(0, 0, 0, 6);
        topEdge.addColorStop(0, 'rgba(255,255,255,0.3)');
        topEdge.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = topEdge;
        ctx.fillRect(0, 0, w, 6);

        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 0, 5, h);
        ctx.fillRect(w - 5, 0, 5, h);

        ctx.strokeStyle = 'rgba(147, 197, 253, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

        for (const win of block.windows) {
          const wx = win.x;
          const wy = h - win.y - win.h;
          if (wx < 1 || wy < 1 || wx + win.w > w - 1 || wy + win.h > h - 1) continue;
          const brightness = clamp(win.brightness, 0, 1);
          const offColor = 'rgba(15,23,42,0.95)';
          const onColor = `rgba(253, 230, 138, ${0.35 + brightness * 0.65})`;

          ctx.fillStyle = offColor;
          ctx.fillRect(wx, wy, win.w, win.h);
          ctx.fillStyle = onColor;
          ctx.fillRect(wx, wy, win.w, win.h);

          if (brightness > 0.7) {
            ctx.fillStyle = `rgba(251, 191, 36, ${0.12 + brightness * 0.18})`;
            ctx.fillRect(wx - 1, wy - 1, win.w + 2, win.h + 2);
          }
        }

        if ((block.perfectGlowUntil ?? 0) > nowMs) {
          const glowAlpha = clamp((block.perfectGlowUntil! - nowMs) / 260, 0, 1);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.8 * glowAlpha})`;
          ctx.lineWidth = 2;
          ctx.strokeRect(1, 1, w - 2, h - 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${0.18 * glowAlpha})`;
          ctx.fillRect(0, 0, w, h);

          const sweepX = ((1 - glowAlpha) * (w + 18)) - 9;
          const sweep = ctx.createLinearGradient(sweepX - 12, 0, sweepX + 12, 0);
          sweep.addColorStop(0, 'rgba(56, 189, 248, 0)');
          sweep.addColorStop(0.5, `rgba(56, 189, 248, ${0.9 * glowAlpha})`);
          sweep.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = sweep;
          ctx.fillRect(sweepX - 12, 0, 24, h);
        }

        ctx.restore();
      };

      for (const block of game.blocks) {
        drawBlock(block);
      }
      for (const piece of game.falling) {
        drawBlock(piece, piece.rotation);
      }
      if (game.active) {
        drawBlock(game.active);
      }

      if (game.isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, width, height);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] overflow-hidden animate-fade-in">
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Генерация изображения...</p>
            <p className="text-xs text-[var(--text-muted)]">Мини-игра "Строитель": клик, тап или пробел</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">Счёт: <span className="text-[var(--text-primary)] font-medium">{score}</span></p>
            <p className="text-xs text-[var(--text-muted)]">Рекорд: <span className="text-[var(--accent)] font-medium">{bestScore}</span></p>
          </div>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-[360px] w-full touch-manipulation"
        onClick={placeBlock}
        onTouchStart={placeBlock}
        role="button"
        tabIndex={0}
      >
        <canvas ref={canvasRef} className="h-full w-full" />

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
            <div className="rounded-xl border border-white/20 bg-black/60 p-4 text-center">
              <p className="text-base font-semibold text-white">Промах! Игра окончена</p>
              <p className="text-xs text-white/80 mt-1">Нажми "Заново" или клавишу R</p>
              <button
                type="button"
                onClick={restartGame}
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Начать заново
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
