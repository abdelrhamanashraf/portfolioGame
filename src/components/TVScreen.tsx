import { useState, useRef, useEffect, useCallback } from "react";

interface TVScreenProps {
  open: boolean;
  onClose: () => void;
  initialGame?: string | null;
}

// ─── Space Shooter Game ───────────────────────────────────────
interface SpaceShooterState {
  player: { x: number };
  bullets: { x: number; y: number; id: number }[];
  enemies: { x: number; y: number; id: number; type: number }[];
  particles: { x: number; y: number; vx: number; vy: number; life: number; id: number }[];
  score: number;
  lives: number;
  gameOver: boolean;
  wave: number;
  nextBullet: number;
  nextEnemy: number;
}

const GAME_W = 480;
const GAME_H = 360;
const PLAYER_W = 28;
const PLAYER_H = 20;
const BULLET_SPEED = 6;
const ENEMY_SPEED_BASE = 1.2;

function useSpaceShooter(canvasRef: React.RefObject<HTMLCanvasElement>, active: boolean) {
  const state = useRef<SpaceShooterState>({
    player: { x: GAME_W / 2 },
    bullets: [], enemies: [], particles: [],
    score: 0, lives: 3, gameOver: false, wave: 1,
    nextBullet: 0, nextEnemy: 0,
  });
  const keys = useRef<Set<string>>(new Set());
  const frameId = useRef<number>(0);
  const idCounter = useRef(0);

  const reset = useCallback(() => {
    state.current = {
      player: { x: GAME_W / 2 },
      bullets: [], enemies: [], particles: [],
      score: 0, lives: 3, gameOver: false, wave: 1,
      nextBullet: 0, nextEnemy: 0,
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", " ", "Escape"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      keys.current.add(e.key);
      if (e.key === "r" && state.current.gameOver) reset();
    };
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener("keydown", handleKey, true);
    window.addEventListener("keyup", handleKeyUp, true);
    return () => {
      window.removeEventListener("keydown", handleKey, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [active, reset]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    let tick = 0;

    const loop = () => {
      const s = state.current;
      tick++;

      if (!s.gameOver) {
        // Player movement
        if (keys.current.has("ArrowLeft")) s.player.x = Math.max(PLAYER_W / 2, s.player.x - 4);
        if (keys.current.has("ArrowRight")) s.player.x = Math.min(GAME_W - PLAYER_W / 2, s.player.x + 4);

        // Shooting
        if (keys.current.has(" ") && tick > s.nextBullet) {
          s.bullets.push({ x: s.player.x, y: GAME_H - 30, id: idCounter.current++ });
          s.nextBullet = tick + 8;
        }

        // Spawn enemies
        if (tick > s.nextEnemy) {
          const count = Math.min(3, Math.floor(s.wave / 3) + 1);
          for (let i = 0; i < count; i++) {
            s.enemies.push({
              x: 20 + Math.random() * (GAME_W - 40),
              y: -20 - i * 30,
              id: idCounter.current++,
              type: Math.floor(Math.random() * 3),
            });
          }
          s.nextEnemy = tick + Math.max(30, 80 - s.wave * 3);
        }

        // Move bullets
        s.bullets = s.bullets.filter((b) => { b.y -= BULLET_SPEED; return b.y > -10; });

        // Move enemies
        const espeed = ENEMY_SPEED_BASE + s.wave * 0.15;
        s.enemies.forEach((e) => { e.y += espeed; });

        // Collision: bullet vs enemy
        const hitEnemies = new Set<number>();
        const hitBullets = new Set<number>();
        for (const b of s.bullets) {
          for (const e of s.enemies) {
            if (Math.abs(b.x - e.x) < 16 && Math.abs(b.y - e.y) < 16) {
              hitEnemies.add(e.id);
              hitBullets.add(b.id);
              s.score += 100;
              // Explosion particles
              for (let p = 0; p < 6; p++) {
                s.particles.push({
                  x: e.x, y: e.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  life: 15 + Math.random() * 10,
                  id: idCounter.current++,
                });
              }
              if (s.score % 1000 === 0) s.wave++;
            }
          }
        }
        s.enemies = s.enemies.filter((e) => !hitEnemies.has(e.id));
        s.bullets = s.bullets.filter((b) => !hitBullets.has(b.id));

        // Enemy reached bottom
        s.enemies = s.enemies.filter((e) => {
          if (e.y > GAME_H + 10) { s.lives--; return false; }
          return true;
        });

        // Particles
        s.particles = s.particles.filter((p) => {
          p.x += p.vx; p.y += p.vy; p.life--;
          return p.life > 0;
        });

        if (s.lives <= 0) s.gameOver = true;
      }

      // ─── DRAW ───
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // Stars
      ctx.fillStyle = "#ffffff20";
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137 + tick * 0.2) % GAME_W);
        const sy = ((i * 97 + tick * 0.5) % GAME_H);
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Player ship
      ctx.fillStyle = "#0ff";
      ctx.beginPath();
      ctx.moveTo(s.player.x, GAME_H - 28);
      ctx.lineTo(s.player.x - PLAYER_W / 2, GAME_H - 8);
      ctx.lineTo(s.player.x + PLAYER_W / 2, GAME_H - 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#0aa";
      ctx.fillRect(s.player.x - 3, GAME_H - 8, 6, 4);

      // Bullets
      ctx.fillStyle = "#ff0";
      for (const b of s.bullets) {
        ctx.fillRect(b.x - 1, b.y - 4, 3, 8);
      }

      // Enemies
      const ENEMY_COLORS = ["#f44", "#f84", "#f4f"];
      for (const e of s.enemies) {
        ctx.fillStyle = ENEMY_COLORS[e.type];
        ctx.fillRect(e.x - 10, e.y - 8, 20, 16);
        ctx.fillStyle = "#000";
        ctx.fillRect(e.x - 6, e.y - 4, 4, 4);
        ctx.fillRect(e.x + 2, e.y - 4, 4, 4);
      }

      // Particles
      for (const p of s.particles) {
        ctx.fillStyle = `rgba(255,200,50,${p.life / 25})`;
        ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
      }

      // UI
      ctx.fillStyle = "#0ff";
      ctx.font = "bold 12px 'Press Start 2P', monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${s.score}`, 8, 18);
      ctx.textAlign = "right";
      ctx.fillText(`${"♥".repeat(s.lives)}`, GAME_W - 8, 18);
      ctx.textAlign = "center";
      ctx.fillText(`WAVE ${s.wave}`, GAME_W / 2, 18);

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, GAME_H / 2 - 40, GAME_W, 80);
        ctx.fillStyle = "#f44";
        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", GAME_W / 2, GAME_H / 2 - 5);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px 'Press Start 2P', monospace";
        ctx.fillText(`SCORE: ${s.score}`, GAME_W / 2, GAME_H / 2 + 20);
        ctx.fillText("PRESS R TO RETRY", GAME_W / 2, GAME_H / 2 + 38);
      }

      frameId.current = requestAnimationFrame(loop);
    };

    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, [active, canvasRef, reset]);

  return { reset };
}

// ─── Snake Game ───────────────────────────────────────────────
interface SnakeState {
  snake: { x: number; y: number }[];
  dir: { x: number; y: number };
  nextDir: { x: number; y: number };
  food: { x: number; y: number };
  score: number;
  gameOver: boolean;
  speed: number;
}

const GRID = 20;
const COLS = Math.floor(GAME_W / GRID);
const ROWS = Math.floor(GAME_H / GRID);

function useSnake(canvasRef: React.RefObject<HTMLCanvasElement>, active: boolean) {
  const state = useRef<SnakeState>({
    snake: [{ x: 12, y: 9 }, { x: 11, y: 9 }, { x: 10, y: 9 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 18, y: 9 },
    score: 0,
    gameOver: false,
    speed: 8,
  });
  const frameId = useRef<number>(0);

  const spawnFood = useCallback((snake: { x: number; y: number }[]) => {
    let fx: number, fy: number;
    do {
      fx = Math.floor(Math.random() * COLS);
      fy = Math.floor(Math.random() * ROWS);
    } while (snake.some((s) => s.x === fx && s.y === fy));
    return { x: fx, y: fy };
  }, []);

  const reset = useCallback(() => {
    const snake = [{ x: 12, y: 9 }, { x: 11, y: 9 }, { x: 10, y: 9 }];
    state.current = {
      snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: spawnFood(snake),
      score: 0,
      gameOver: false,
      speed: 8,
    };
  }, [spawnFood]);

  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      const s = state.current;
      if (e.key === "r" && s.gameOver) { reset(); return; }
      const map: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      };
      const nd = map[e.key];
      if (nd && (nd.x + s.dir.x !== 0 || nd.y + s.dir.y !== 0)) {
        e.preventDefault();
        e.stopPropagation();
        s.nextDir = nd;
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [active, reset]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    let tick = 0;

    const loop = () => {
      const s = state.current;
      tick++;

      if (!s.gameOver && tick % s.speed === 0) {
        s.dir = s.nextDir;
        const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

        // Wrap around
        if (head.x < 0) head.x = COLS - 1;
        if (head.x >= COLS) head.x = 0;
        if (head.y < 0) head.y = ROWS - 1;
        if (head.y >= ROWS) head.y = 0;

        // Self collision
        if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          s.gameOver = true;
        } else {
          s.snake.unshift(head);
          if (head.x === s.food.x && head.y === s.food.y) {
            s.score += 10;
            s.food = spawnFood(s.snake);
            if (s.speed > 3 && s.score % 50 === 0) s.speed--;
          } else {
            s.snake.pop();
          }
        }
      }

      // Draw
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // Grid lines
      ctx.strokeStyle = "#111128";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < COLS; x++) {
        ctx.beginPath(); ctx.moveTo(x * GRID, 0); ctx.lineTo(x * GRID, GAME_H); ctx.stroke();
      }
      for (let y = 0; y < ROWS; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * GRID); ctx.lineTo(GAME_W, y * GRID); ctx.stroke();
      }

      // Food
      ctx.fillStyle = "#f44";
      ctx.fillRect(s.food.x * GRID + 3, s.food.y * GRID + 3, GRID - 6, GRID - 6);
      ctx.fillStyle = "#f88";
      ctx.fillRect(s.food.x * GRID + 5, s.food.y * GRID + 5, GRID - 12, GRID - 12);

      // Snake
      s.snake.forEach((seg, i) => {
        const brightness = Math.max(0.4, 1 - i * 0.03);
        ctx.fillStyle = i === 0
          ? `rgba(0,255,100,${brightness})`
          : `rgba(0,200,80,${brightness})`;
        ctx.fillRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2);
        if (i === 0) {
          // Eyes
          ctx.fillStyle = "#000";
          const ex = seg.x * GRID + GRID / 2 + s.dir.x * 4;
          const ey = seg.y * GRID + GRID / 2 + s.dir.y * 4;
          ctx.fillRect(ex - 2, ey - 2, 3, 3);
        }
      });

      // UI
      ctx.fillStyle = "#0f8";
      ctx.font = "bold 12px 'Press Start 2P', monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${s.score}`, 8, 18);
      ctx.textAlign = "right";
      ctx.fillText(`LENGTH: ${s.snake.length}`, GAME_W - 8, 18);

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, GAME_H / 2 - 40, GAME_W, 80);
        ctx.fillStyle = "#f44";
        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", GAME_W / 2, GAME_H / 2 - 5);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px 'Press Start 2P', monospace";
        ctx.fillText(`SCORE: ${s.score}`, GAME_W / 2, GAME_H / 2 + 20);
        ctx.fillText("PRESS R TO RETRY", GAME_W / 2, GAME_H / 2 + 38);
      }

      frameId.current = requestAnimationFrame(loop);
    };

    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, [active, canvasRef, spawnFood]);

  return { reset };
}

// ─── Pong Game ────────────────────────────────────────────────
interface PongState {
  playerY: number;
  aiY: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  playerScore: number;
  aiScore: number;
  gameOver: boolean;
  serving: boolean;
  serveTimer: number;
}

const PADDLE_W = 10;
const PADDLE_H = 60;
const BALL_SIZE = 10;
const BALL_SPEED = 4;
const AI_SPEED = 2.8;
const WIN_SCORE = 7;

function usePong(canvasRef: React.RefObject<HTMLCanvasElement>, active: boolean) {
  const state = useRef<PongState>({
    playerY: GAME_H / 2 - PADDLE_H / 2,
    aiY: GAME_H / 2 - PADDLE_H / 2,
    ballX: GAME_W / 2, ballY: GAME_H / 2,
    ballVX: BALL_SPEED, ballVY: BALL_SPEED * 0.6,
    playerScore: 0, aiScore: 0,
    gameOver: false, serving: true, serveTimer: 60,
  });
  const keys = useRef<Set<string>>(new Set());
  const frameId = useRef<number>(0);

  const reset = useCallback(() => {
    state.current = {
      playerY: GAME_H / 2 - PADDLE_H / 2,
      aiY: GAME_H / 2 - PADDLE_H / 2,
      ballX: GAME_W / 2, ballY: GAME_H / 2,
      ballVX: BALL_SPEED, ballVY: BALL_SPEED * 0.6,
      playerScore: 0, aiScore: 0,
      gameOver: false, serving: true, serveTimer: 60,
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      keys.current.add(e.key);
      if (e.key === "r" && state.current.gameOver) reset();
    };
    const handleUp = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener("keydown", handleKey, true);
    window.addEventListener("keyup", handleUp, true);
    return () => {
      window.removeEventListener("keydown", handleKey, true);
      window.removeEventListener("keyup", handleUp, true);
    };
  }, [active, reset]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;

    const loop = () => {
      const s = state.current;

      if (!s.gameOver) {
        // Player movement
        if (keys.current.has("ArrowUp") || keys.current.has("w")) s.playerY = Math.max(0, s.playerY - 5);
        if (keys.current.has("ArrowDown") || keys.current.has("s")) s.playerY = Math.min(GAME_H - PADDLE_H, s.playerY + 5);

        if (s.serving) {
          s.serveTimer--;
          if (s.serveTimer <= 0) s.serving = false;
        } else {
          // Ball movement
          s.ballX += s.ballVX;
          s.ballY += s.ballVY;

          // Top/bottom bounce
          if (s.ballY <= 0 || s.ballY >= GAME_H - BALL_SIZE) {
            s.ballVY = -s.ballVY;
            s.ballY = Math.max(0, Math.min(GAME_H - BALL_SIZE, s.ballY));
          }

          // Player paddle collision (left)
          if (s.ballX <= 20 + PADDLE_W && s.ballX >= 20 &&
              s.ballY + BALL_SIZE >= s.playerY && s.ballY <= s.playerY + PADDLE_H) {
            s.ballVX = Math.abs(s.ballVX) * 1.05;
            const hitPos = (s.ballY + BALL_SIZE / 2 - s.playerY) / PADDLE_H - 0.5;
            s.ballVY = hitPos * BALL_SPEED * 2;
          }

          // AI paddle collision (right)
          if (s.ballX + BALL_SIZE >= GAME_W - 20 - PADDLE_W && s.ballX <= GAME_W - 20 &&
              s.ballY + BALL_SIZE >= s.aiY && s.ballY <= s.aiY + PADDLE_H) {
            s.ballVX = -Math.abs(s.ballVX) * 1.05;
            const hitPos = (s.ballY + BALL_SIZE / 2 - s.aiY) / PADDLE_H - 0.5;
            s.ballVY = hitPos * BALL_SPEED * 2;
          }

          // Scoring
          if (s.ballX < 0) {
            s.aiScore++;
            s.ballX = GAME_W / 2; s.ballY = GAME_H / 2;
            s.ballVX = BALL_SPEED; s.ballVY = (Math.random() - 0.5) * BALL_SPEED;
            s.serving = true; s.serveTimer = 40;
          }
          if (s.ballX > GAME_W) {
            s.playerScore++;
            s.ballX = GAME_W / 2; s.ballY = GAME_H / 2;
            s.ballVX = -BALL_SPEED; s.ballVY = (Math.random() - 0.5) * BALL_SPEED;
            s.serving = true; s.serveTimer = 40;
          }

          // Speed cap
          s.ballVX = Math.max(-8, Math.min(8, s.ballVX));
          s.ballVY = Math.max(-6, Math.min(6, s.ballVY));

          if (s.playerScore >= WIN_SCORE || s.aiScore >= WIN_SCORE) s.gameOver = true;
        }

        // AI movement
        const aiCenter = s.aiY + PADDLE_H / 2;
        const ballCenter = s.ballY + BALL_SIZE / 2;
        if (aiCenter < ballCenter - 10) s.aiY += AI_SPEED;
        else if (aiCenter > ballCenter + 10) s.aiY -= AI_SPEED;
        s.aiY = Math.max(0, Math.min(GAME_H - PADDLE_H, s.aiY));
      }

      // Draw
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // Center line
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(GAME_W / 2, 0);
      ctx.lineTo(GAME_W / 2, GAME_H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player paddle
      ctx.fillStyle = "#0ff";
      ctx.fillRect(20, s.playerY, PADDLE_W, PADDLE_H);
      ctx.shadowColor = "#0ff";
      ctx.shadowBlur = 8;
      ctx.fillRect(20, s.playerY, PADDLE_W, PADDLE_H);
      ctx.shadowBlur = 0;

      // AI paddle
      ctx.fillStyle = "#f44";
      ctx.fillRect(GAME_W - 20 - PADDLE_W, s.aiY, PADDLE_W, PADDLE_H);
      ctx.shadowColor = "#f44";
      ctx.shadowBlur = 8;
      ctx.fillRect(GAME_W - 20 - PADDLE_W, s.aiY, PADDLE_W, PADDLE_H);
      ctx.shadowBlur = 0;

      // Ball
      ctx.fillStyle = "#fff";
      ctx.fillRect(s.ballX, s.ballY, BALL_SIZE, BALL_SIZE);
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 10;
      ctx.fillRect(s.ballX, s.ballY, BALL_SIZE, BALL_SIZE);
      ctx.shadowBlur = 0;

      // Score
      ctx.fillStyle = "#0ff";
      ctx.font = "bold 24px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${s.playerScore}`, GAME_W / 4, 40);
      ctx.fillStyle = "#f44";
      ctx.fillText(`${s.aiScore}`, (GAME_W * 3) / 4, 40);

      if (s.serving && !s.gameOver) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GET READY", GAME_W / 2, GAME_H / 2);
      }

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, GAME_H / 2 - 50, GAME_W, 100);
        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = s.playerScore >= WIN_SCORE ? "#0f8" : "#f44";
        ctx.fillText(s.playerScore >= WIN_SCORE ? "YOU WIN!" : "YOU LOSE", GAME_W / 2, GAME_H / 2 - 10);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px 'Press Start 2P', monospace";
        ctx.fillText(`${s.playerScore} - ${s.aiScore}`, GAME_W / 2, GAME_H / 2 + 15);
        ctx.fillText("PRESS R TO RETRY", GAME_W / 2, GAME_H / 2 + 38);
      }

      frameId.current = requestAnimationFrame(loop);
    };

    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, [active, canvasRef]);

  return { reset };
}

// ─── TV Screen Component ─────────────────────────────────────
type GameId = "menu" | "space-shooter" | "snake" | "pong";

const TVScreen = ({ open, onClose, initialGame }: TVScreenProps) => {
  const [currentGame, setCurrentGame] = useState<GameId>("menu");
  const [powerOn, setPowerOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeCanvasRef = useRef<HTMLCanvasElement>(null);
  const pongCanvasRef = useRef<HTMLCanvasElement>(null);

  useSpaceShooter(canvasRef, currentGame === "space-shooter");
  useSnake(snakeCanvasRef, currentGame === "snake");
  usePong(pongCanvasRef, currentGame === "pong");

  // CRT power-on effect
  useEffect(() => {
    if (open) {
      setPowerOn(false);
      // If launched from Steam, start directly in that game
      if (initialGame && ["space-shooter", "snake", "pong"].includes(initialGame)) {
        setCurrentGame(initialGame as GameId);
      }
      const t = setTimeout(() => setPowerOn(true), 100);
      return () => clearTimeout(t);
    } else {
      setPowerOn(false);
      setCurrentGame("menu");
    }
  }, [open, initialGame]);

  // ESC to go back
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (currentGame !== "menu") setCurrentGame("menu");
        else onClose();
      }
    };
    window.addEventListener("keydown", handleEsc, true);
    return () => window.removeEventListener("keydown", handleEsc, true);
  }, [open, currentGame, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-500"
      style={{
        backgroundColor: powerOn ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0)",
      }}
    >
      {/* CRT TV frame */}
      <div
        className="relative transition-all duration-500 ease-out"
        style={{
          transform: powerOn ? "scale(1)" : "scale(0.8, 0.01)",
          opacity: powerOn ? 1 : 0.5,
        }}
      >
        {/* TV outer bezel */}
        <div className="bg-[#2a2a2a] rounded-xl p-4 shadow-[0_0_60px_rgba(0,200,255,0.15)] border border-[#444]">
          {/* Screen bezel */}
          <div className="bg-[#111] rounded-lg p-2 relative overflow-hidden">
            {/* CRT scanline overlay */}
            <div
              className="absolute inset-0 z-10 pointer-events-none rounded-lg"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
              }}
            />
            {/* Screen glow */}
            <div
              className="absolute inset-0 z-10 pointer-events-none rounded-lg"
              style={{
                boxShadow: "inset 0 0 60px rgba(0,200,255,0.1), inset 0 0 20px rgba(0,200,255,0.05)",
              }}
            />
            {/* Screen curvature effect */}
            <div
              className="absolute inset-0 z-10 pointer-events-none rounded-lg"
              style={{
                background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%)",
              }}
            />

            {/* Game Menu */}
            {currentGame === "menu" && (
              <div className="w-[480px] h-[360px] bg-[#0a0a1a] flex flex-col items-center justify-center gap-6 relative">
                {/* Animated title */}
                <h2 className="font-pixel text-xl text-cyan-400 animate-pulse-glow" style={{ textShadow: "0 0 20px rgba(0,255,255,0.5)" }}>
                  🎮 GAME SELECT
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentGame("space-shooter")}
                    className="block w-64 px-6 py-3 bg-[#1a1a2e] border-2 border-cyan-500/50 rounded font-pixel text-sm text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                  >
                    🚀 SPACE SHOOTER
                  </button>
                  <button
                    onClick={() => setCurrentGame("snake")}
                    className="block w-64 px-6 py-3 bg-[#1a1a2e] border-2 border-green-500/50 rounded font-pixel text-sm text-green-300 hover:bg-green-500/20 hover:border-green-400 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,100,0.3)]"
                  >
                    🐍 SNAKE
                  </button>
                  <button
                    onClick={() => setCurrentGame("pong")}
                    className="block w-64 px-6 py-3 bg-[#1a1a2e] border-2 border-yellow-500/50 rounded font-pixel text-sm text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-400 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,200,0,0.3)]"
                  >
                    🏓 PONG
                  </button>
                </div>
                <p className="font-pixel text-[10px] text-gray-500 mt-4">Press ESC to exit</p>
              </div>
            )}

            {/* Space Shooter Canvas */}
            {currentGame === "space-shooter" && (
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={GAME_W}
                  height={GAME_H}
                  className="block rounded"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="absolute bottom-2 left-2 font-pixel text-[8px] text-gray-500 z-20">
                  ← → Move • SPACE Shoot • ESC Back
                </div>
              </div>
            )}

            {/* Snake Canvas */}
            {currentGame === "snake" && (
              <div className="relative">
                <canvas
                  ref={snakeCanvasRef}
                  width={GAME_W}
                  height={GAME_H}
                  className="block rounded"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="absolute bottom-2 left-2 font-pixel text-[8px] text-gray-500 z-20">
                  ← ↑ → ↓ Move • ESC Back
                </div>
              </div>
            )}

            {/* Pong Canvas */}
            {currentGame === "pong" && (
              <div className="relative">
                <canvas
                  ref={pongCanvasRef}
                  width={GAME_W}
                  height={GAME_H}
                  className="block rounded"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="absolute bottom-2 left-2 font-pixel text-[8px] text-gray-500 z-20">
                  ↑ ↓ Move Paddle • First to {WIN_SCORE} wins • ESC Back
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TV stand / bottom decorations */}
        <div className="flex justify-center mt-1">
          <div className="w-16 h-2 bg-[#333] rounded-b" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full text-white font-bold text-sm hover:bg-red-500 transition-colors shadow-lg z-20 flex items-center justify-center"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TVScreen;
