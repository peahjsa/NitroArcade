import Phaser from '../../../phaser-shim.js';
import { ACCELERATION, COIN_POINTS, COYOTE_MS, DIVE_VELOCITY, DOUBLE_JUMP_VELOCITY, GAME_ID, GRAVITY, GROUND_Y, HEIGHT, JUMP_BUFFER_MS, JUMP_CUT, JUMP_VELOCITY, MAX_SPEED, PLAYER_H, PLAYER_W, PLAYER_X, PX_PER_METRE, SLIDE_H, START_SPEED, TOUCH_SLIDE_MS, WIDTH, } from '../config.js';
import { PATTERNS } from '../patterns.js';
import { addCounter, unlock } from '../../../shared/achievements.js';
import { ArcadeControls } from '../../../shared/controls.js';
import { PauseController } from '../../../shared/pause.js';
import { noise, tone } from '../../../shared/sfx.js';
import { getHighScore } from '../../../shared/storage.js';
import { burstEmitter, floatText, hex, NEON, neonText, PIXEL_FONT, sparkTexture } from '../../../shared/ui.js';
/** Drones hover with their underside here: you can't run under, but you can slide under. */
const DRONE_BOTTOM = GROUND_Y - 30;
const DRONE_H = 22;
export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        /** Distance scrolled so far, in world pixels. Screen x = worldX - distance + PLAYER_X. */
        this.distance = 0;
        this.speed = START_SPEED;
        this.nextPatternAt = 0;
        this.blocks = [];
        this.drones = [];
        this.gaps = [];
        this.coins = [];
        this.coinsTaken = 0;
        this.y = GROUND_Y;
        this.vy = 0;
        this.grounded = true;
        this.jumpsLeft = 2;
        this.coyote = 0;
        this.jumpBuffer = 0;
        this.jumpHeld = false;
        this.sliding = false;
        this.touchSlide = 0;
        this.alive = true;
        this.runPhase = 0;
        this.elapsed = 0;
        this.far = [];
        this.mid = [];
        this.pointerStartY = null;
    }
    init() {
        this.distance = 0;
        this.speed = START_SPEED;
        this.nextPatternAt = WIDTH;
        this.blocks = [];
        this.drones = [];
        this.gaps = [];
        this.coins = [];
        this.coinsTaken = 0;
        this.y = GROUND_Y;
        this.vy = 0;
        this.grounded = true;
        this.jumpsLeft = 2;
        this.coyote = 0;
        this.jumpBuffer = 0;
        this.jumpHeld = false;
        this.sliding = false;
        this.touchSlide = 0;
        this.alive = true;
        this.elapsed = 0;
    }
    create() {
        this.cameras.main.fadeIn(250, 5, 5, 13);
        this.far = this.makeSkyline(18, 60, 180);
        this.mid = this.makeSkyline(12, 90, 260);
        this.gfx = this.add.graphics();
        this.burst = burstEmitter(this, 280, 600);
        this.trail = this.add
            .particles(0, 0, sparkTexture(this), {
            lifespan: 300,
            speedX: { min: -260, max: -140 },
            speedY: { min: -20, max: 20 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 0.5, end: 0 },
            tint: NEON.cyan,
            frequency: 30,
            blendMode: Phaser.BlendModes.ADD,
        })
            .setDepth(5);
        const style = { fontFamily: PIXEL_FONT, fontSize: '16px', color: '#e8e8ff' };
        this.distText = this.add.text(WIDTH / 2, 24, '0m', style).setOrigin(0.5).setDepth(100);
        this.coinText = this.add.text(WIDTH - 20, 24, '0', { ...style, fontSize: '12px', color: hex(NEON.yellow) }).setOrigin(1, 0.5).setDepth(100);
        this.add
            .text(WIDTH / 2, 48, `BEST ${getHighScore(GAME_ID).toLocaleString()}`, { ...style, fontSize: '10px', color: '#8a8ab8' })
            .setOrigin(0.5)
            .setDepth(100);
        this.hint = neonText(this, WIDTH / 2, 200, 'TAP / SPACE TO JUMP   SWIPE DOWN / ↓ TO SLIDE', 12, NEON.white).setDepth(100);
        this.tweens.add({ targets: this.hint, alpha: 0, delay: 2500, duration: 800 });
        this.controls = new ArcadeControls(this);
        this.pause = new PauseController(this, this.controls, { canPause: () => this.alive });
        this.bindTouch();
    }
    makeSkyline(count, minH, maxH) {
        const out = [];
        let x = 0;
        for (let i = 0; i < count; i++) {
            const w = Phaser.Math.Between(50, 110);
            const h = Phaser.Math.Between(minH, maxH);
            out.push({ x, w, h, windows: Array.from({ length: 12 }, () => (Math.random() < 0.35 ? 1 : 0)) });
            x += w + Phaser.Math.Between(4, 20);
        }
        return out;
    }
    bindTouch() {
        this.input.on('pointerdown', (p) => {
            if (this.pause.isPaused)
                return;
            this.pointerStartY = p.y;
            this.queueJump();
            this.jumpHeld = true;
        });
        this.input.on('pointermove', (p) => {
            if (this.pointerStartY === null || !p.isDown)
                return;
            if (p.y - this.pointerStartY > 40) {
                this.pointerStartY = null;
                this.jumpHeld = false;
                this.touchSlide = TOUCH_SLIDE_MS;
                this.dive();
            }
        });
        const release = () => {
            this.pointerStartY = null;
            this.jumpHeld = false;
        };
        this.input.on('pointerup', release);
        this.input.on('pointerupoutside', release);
    }
    // ---------------------------------------------------------------- input
    queueJump() {
        this.jumpBuffer = JUMP_BUFFER_MS;
    }
    tryJump() {
        if (this.jumpBuffer <= 0 || !this.alive)
            return;
        const canGroundJump = this.grounded || this.coyote > 0;
        if (canGroundJump) {
            this.vy = -JUMP_VELOCITY;
            this.jumpsLeft = 1;
            this.jumpBuffer = 0;
            this.grounded = false;
            this.coyote = 0;
            this.sliding = false;
            this.touchSlide = 0;
            this.burst.setParticleTint(NEON.purple);
            this.burst.explode(6, PLAYER_X, GROUND_Y);
            tone({ freq: 330, toFreq: 660, duration: 0.1, type: 'triangle', volume: 0.07 });
        }
        else if (this.jumpsLeft > 0) {
            this.vy = -DOUBLE_JUMP_VELOCITY;
            this.jumpsLeft = 0;
            this.jumpBuffer = 0;
            this.burst.setParticleTint(NEON.cyan);
            this.burst.explode(10, PLAYER_X, this.y - PLAYER_H / 2);
            tone({ freq: 520, toFreq: 1040, duration: 0.1, type: 'triangle', volume: 0.07 });
        }
    }
    dive() {
        if (!this.grounded && this.vy < DIVE_VELOCITY) {
            this.vy = DIVE_VELOCITY;
            noise(0.08, 0.04);
        }
    }
    // ---------------------------------------------------------------- loop
    update(_time, deltaMs) {
        if (this.pause.isPaused)
            return;
        const dt = Math.min(deltaMs, 50) / 1000;
        this.elapsed += deltaMs;
        if (this.alive) {
            const c = this.controls;
            if (c.justPressed('action') || c.justPressed('up'))
                this.queueJump();
            const holdingJump = c.isDown('action') || c.isDown('up') || this.jumpHeld;
            const wantsSlide = c.isDown('down') || c.isDown('alt') || this.touchSlide > 0;
            if ((c.justPressed('down') || c.justPressed('alt')) && !this.grounded)
                this.dive();
            this.speed = Math.min(MAX_SPEED, this.speed + ACCELERATION * dt);
            this.distance += this.speed * dt;
            this.spawnPatterns();
            this.jumpBuffer -= deltaMs;
            this.coyote -= deltaMs;
            this.touchSlide -= deltaMs;
            this.tryJump();
            // Variable jump height: let go early for a short hop.
            if (!holdingJump && this.vy < 0)
                this.vy *= Math.pow(JUMP_CUT, dt * 12);
            this.vy += GRAVITY * dt;
            this.y += this.vy * dt;
            const overGap = this.gapUnder();
            if (!overGap && this.y >= GROUND_Y && this.vy >= 0) {
                if (!this.grounded)
                    this.land();
                this.y = GROUND_Y;
                this.vy = 0;
                this.grounded = true;
                this.jumpsLeft = 2;
                this.coyote = COYOTE_MS;
            }
            else if (this.grounded && (overGap || this.y < GROUND_Y)) {
                this.grounded = false;
            }
            // Stay ducked while a drone is still overhead, so letting go a moment early isn't fatal.
            this.sliding = this.grounded && (wantsSlide || (this.sliding && this.droneOverhead()));
            if (this.sliding && Math.floor(this.elapsed / 90) !== Math.floor((this.elapsed - deltaMs) / 90))
                noise(0.05, 0.015);
            this.collectCoins();
            if (this.y > HEIGHT + 60 || this.hitsObstacle())
                this.die();
            this.runPhase += dt * (this.speed / 40);
            this.trail.setPosition(PLAYER_X - 8, this.y - (this.sliding ? SLIDE_H : PLAYER_H) / 2);
            this.updateHud();
        }
        this.cull();
        this.render();
    }
    land() {
        this.burst.setParticleTint(NEON.purple);
        this.burst.explode(8, PLAYER_X, GROUND_Y);
        tone({ freq: 160, duration: 0.05, type: 'square', volume: 0.04 });
    }
    /** Lays out the next pattern once the previous one has scrolled far enough. */
    spawnPatterns() {
        const horizon = this.distance + WIDTH + 200;
        while (this.nextPatternAt < horizon) {
            const level = Math.min(3, Math.floor((this.speed - START_SPEED) / 110));
            const pool = PATTERNS.filter((p) => p.minLevel <= level);
            const pattern = Phaser.Utils.Array.GetRandom(pool);
            // Gaps between obstacles stretch with speed so reaction time stays fair.
            const stretch = this.speed / START_SPEED;
            const start = this.nextPatternAt;
            for (const piece of pattern.pieces)
                this.place(piece, start + piece.x * stretch);
            this.nextPatternAt = start + pattern.length * stretch + Phaser.Math.Between(160, 320) * stretch;
        }
    }
    place(p, x) {
        switch (p.kind) {
            case 'block':
                this.blocks.push({ x, w: p.w, h: p.h });
                break;
            case 'drone':
                this.drones.push({ x, w: p.w });
                break;
            case 'gap':
                this.gaps.push({ x, w: p.w });
                break;
            case 'coins':
                for (let i = 0; i < p.count; i++) {
                    const t = p.count === 1 ? 0.5 : i / (p.count - 1);
                    const lift = p.arc ? Math.sin(t * Math.PI) * p.arc : 0;
                    this.coins.push({ x: x + i * 34, y: GROUND_Y - p.y - lift, taken: false });
                }
                break;
        }
    }
    /** The player's world x (their feet are centred here). */
    get worldX() {
        return this.distance;
    }
    gapUnder() {
        // Fall only when the whole foot span is over the hole, so clipping an edge is forgiven.
        const left = this.worldX - PLAYER_W / 2 + 6;
        const right = this.worldX + PLAYER_W / 2 - 6;
        return this.gaps.some((g) => left > g.x && right < g.x + g.w);
    }
    playerBox() {
        const h = this.sliding ? SLIDE_H : PLAYER_H;
        const w = this.sliding ? PLAYER_H * 0.9 : PLAYER_W;
        // A few pixels of forgiveness on every side.
        return { l: this.worldX - w / 2 + 4, r: this.worldX + w / 2 - 4, t: this.y - h + 4, b: this.y - 2 };
    }
    droneOverhead() {
        const l = this.worldX - PLAYER_H * 0.45;
        const r = this.worldX + PLAYER_H * 0.45;
        return this.drones.some((d) => r > d.x && l < d.x + d.w);
    }
    hitsObstacle() {
        const p = this.playerBox();
        for (const b of this.blocks) {
            if (p.r > b.x && p.l < b.x + b.w && p.b > GROUND_Y - b.h)
                return true;
        }
        for (const d of this.drones) {
            if (p.r > d.x && p.l < d.x + d.w && p.t < DRONE_BOTTOM && p.b > DRONE_BOTTOM - DRONE_H)
                return true;
        }
        return false;
    }
    collectCoins() {
        const p = this.playerBox();
        for (const c of this.coins) {
            if (c.taken)
                continue;
            if (c.x + 9 > p.l && c.x - 9 < p.r && c.y + 9 > p.t && c.y - 9 < p.b) {
                c.taken = true;
                this.coinsTaken++;
                addCounter('runner.coins');
                if (this.coinsTaken >= 20)
                    unlock('runner.coins');
                const sx = c.x - this.distance + PLAYER_X;
                this.burst.setParticleTint(NEON.yellow);
                this.burst.explode(6, sx, c.y);
                floatText(this, sx, c.y - 12, `+${COIN_POINTS}`, NEON.yellow, 10);
                tone({ freq: 1320, toFreq: 1760, duration: 0.06, type: 'square', volume: 0.035 });
            }
        }
    }
    cull() {
        const behind = this.distance - PLAYER_X - 200;
        this.blocks = this.blocks.filter((b) => b.x + b.w > behind);
        this.drones = this.drones.filter((d) => d.x + d.w > behind);
        this.gaps = this.gaps.filter((g) => g.x + g.w > behind);
        this.coins = this.coins.filter((c) => c.x > behind && !c.taken);
    }
    get score() {
        return Math.floor(this.distance / PX_PER_METRE) + this.coinsTaken * COIN_POINTS;
    }
    die() {
        this.alive = false;
        this.trail.stop();
        this.burst.setParticleTint(NEON.cyan);
        this.burst.explode(40, PLAYER_X, Math.min(this.y, GROUND_Y) - PLAYER_H / 2);
        this.cameras.main.shake(300, 0.012);
        this.cameras.main.flash(180, 255, 46, 151);
        noise(0.5, 0.12);
        tone({ freq: 400, toFreq: 50, duration: 0.7, type: 'sawtooth', volume: 0.08 });
        const metres = Math.floor(this.distance / PX_PER_METRE);
        this.time.delayedCall(1300, () => this.scene.start('GameOver', { gameId: GAME_ID, score: this.score, detail: `${metres}m   ${this.coinsTaken} COINS` }));
    }
    // ---------------------------------------------------------------- render
    render() {
        const g = this.gfx.clear();
        const d = this.distance;
        // Sky gradient bands and a striped synthwave sun.
        g.fillStyle(0x1a0830, 1).fillRect(0, 0, WIDTH, GROUND_Y);
        g.fillStyle(0x2a0c3e, 1).fillRect(0, GROUND_Y - 240, WIDTH, 240);
        const sunX = WIDTH * 0.68;
        const sunY = GROUND_Y - 150;
        for (let i = 0; i < 12; i++) {
            const yy = sunY - 110 + i * 18;
            if (i > 5 && i % 2 === 1)
                continue;
            const half = Math.sqrt(Math.max(0, 110 * 110 - (yy + 7 - sunY) ** 2));
            const c = Phaser.Display.Color.Interpolate.ColorWithColor(Phaser.Display.Color.ValueToColor(NEON.yellow), Phaser.Display.Color.ValueToColor(NEON.pink), 11, i);
            g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 0.85).fillRect(sunX - half, yy, half * 2, 14);
        }
        this.drawSkyline(g, this.far, d * 0.12, 0x2b1250, false);
        this.drawSkyline(g, this.mid, d * 0.35, 0x140828, true);
        // Ground with scrolling perspective grid, and gaps cut out of it.
        g.fillStyle(0x0b0418, 1).fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
        g.lineStyle(1, NEON.pink, 0.35);
        for (let i = 0; i < 6; i++) {
            const yy = GROUND_Y + ((i * i * 4 + (d * 0.05) % 4) | 0) + i * 8;
            if (yy < HEIGHT)
                g.lineBetween(0, yy, WIDTH, yy);
        }
        const spacing = 60;
        const offset = d % spacing;
        for (let x = -offset - spacing * 6; x < WIDTH + spacing * 6; x += spacing) {
            const vanishX = WIDTH / 2 + (x - WIDTH / 2) * 0.15;
            g.lineBetween(vanishX, GROUND_Y, x + (x - WIDTH / 2) * 1.5, HEIGHT);
        }
        for (const gap of this.gaps) {
            const sx = gap.x - d + PLAYER_X;
            g.fillStyle(0x05050d, 1).fillRect(sx, GROUND_Y - 1, gap.w, HEIGHT - GROUND_Y + 1);
            g.lineStyle(2, NEON.pink, 0.9).lineBetween(sx, GROUND_Y, sx, HEIGHT).lineBetween(sx + gap.w, GROUND_Y, sx + gap.w, HEIGHT);
        }
        g.lineStyle(6, NEON.pink, 0.15).lineBetween(0, GROUND_Y, WIDTH, GROUND_Y);
        g.lineStyle(2, NEON.pink, 1);
        // Draw the floor edge in segments so the gaps stay open.
        let cursor = 0;
        for (const gap of [...this.gaps].sort((a, b) => a.x - b.x)) {
            const sx = gap.x - d + PLAYER_X;
            if (sx > cursor)
                g.lineBetween(cursor, GROUND_Y, Math.min(sx, WIDTH), GROUND_Y);
            cursor = Math.max(cursor, sx + gap.w);
        }
        if (cursor < WIDTH)
            g.lineBetween(cursor, GROUND_Y, WIDTH, GROUND_Y);
        for (const b of this.blocks) {
            const sx = b.x - d + PLAYER_X;
            g.fillStyle(NEON.orange, 0.15).fillRect(sx - 4, GROUND_Y - b.h - 4, b.w + 8, b.h + 4);
            g.fillStyle(0x2a0e05, 1).fillRect(sx, GROUND_Y - b.h, b.w, b.h);
            g.lineStyle(2, NEON.orange, 1).strokeRect(sx, GROUND_Y - b.h, b.w, b.h);
            g.lineBetween(sx, GROUND_Y - b.h, sx + b.w, GROUND_Y);
        }
        for (const dr of this.drones) {
            const sx = dr.x - d + PLAYER_X;
            const bob = Math.sin(this.elapsed / 150 + dr.x) * 2;
            const top = DRONE_BOTTOM - DRONE_H + bob;
            g.fillStyle(NEON.green, 0.15).fillRoundedRect(sx - 4, top - 4, dr.w + 8, DRONE_H + 8, 8);
            g.fillStyle(0x062a14, 1).fillRoundedRect(sx, top, dr.w, DRONE_H, 6);
            g.lineStyle(2, NEON.green, 1).strokeRoundedRect(sx, top, dr.w, DRONE_H, 6);
            // Blinking warning lights.
            if (Math.floor(this.elapsed / 200) % 2 === 0)
                g.fillStyle(NEON.pink, 1).fillCircle(sx + 10, top + DRONE_H / 2, 3).fillCircle(sx + dr.w - 10, top + DRONE_H / 2, 3);
            // Thin laser under the drone to show the danger zone.
            g.lineStyle(1, NEON.green, 0.35).lineBetween(sx + 6, DRONE_BOTTOM + bob + 3, sx + dr.w - 6, DRONE_BOTTOM + bob + 3);
        }
        for (const c of this.coins) {
            const sx = c.x - d + PLAYER_X;
            const squash = Math.abs(Math.sin(this.elapsed / 180 + c.x * 0.05));
            g.fillStyle(NEON.yellow, 0.2).fillCircle(sx, c.y, 11);
            g.fillStyle(NEON.yellow, 1).fillEllipse(sx, c.y, 4 + 10 * squash, 14);
        }
        if (this.alive)
            this.drawRunner(g);
    }
    drawSkyline(g, buildings, scroll, color, windows) {
        const total = buildings.reduce((sum, b) => Math.max(sum, b.x + b.w), 0) + 20;
        for (const b of buildings) {
            const x = ((b.x - scroll) % total + total) % total - 60;
            g.fillStyle(color, 1).fillRect(x, GROUND_Y - b.h, b.w, b.h);
            if (windows) {
                g.lineStyle(1, NEON.purple, 0.5).strokeRect(x, GROUND_Y - b.h, b.w, b.h);
                b.windows.forEach((on, i) => {
                    if (!on)
                        return;
                    const wx = x + 8 + (i % 3) * ((b.w - 16) / 3);
                    const wy = GROUND_Y - b.h + 12 + Math.floor(i / 3) * 22;
                    if (wy < GROUND_Y - 10)
                        g.fillStyle(i % 2 ? NEON.cyan : NEON.pink, 0.55).fillRect(wx, wy, 8, 10);
                });
            }
        }
    }
    drawRunner(g) {
        const x = PLAYER_X;
        const y = this.y;
        if (this.sliding) {
            const w = PLAYER_H * 0.9;
            g.fillStyle(NEON.cyan, 0.18).fillRoundedRect(x - w / 2 - 4, y - SLIDE_H - 4, w + 8, SLIDE_H + 8, 10);
            g.fillStyle(NEON.cyan, 1).fillRoundedRect(x - w / 2, y - SLIDE_H, w, SLIDE_H, 9);
            g.fillStyle(NEON.bg, 1).fillRoundedRect(x + w / 2 - 14, y - SLIDE_H + 5, 10, 6, 2);
            return;
        }
        const top = y - PLAYER_H;
        // Legs scissor while running; tucked in the air.
        const swing = this.grounded ? Math.sin(this.runPhase) * 9 : 5;
        g.lineStyle(5, NEON.purple, 1);
        g.lineBetween(x - 4, y - 16, x - 4 + swing, y);
        g.lineBetween(x + 4, y - 16, x + 4 - swing, y);
        g.fillStyle(NEON.cyan, 0.18).fillRoundedRect(x - PLAYER_W / 2 - 4, top - 4, PLAYER_W + 8, PLAYER_H - 10, 12);
        g.fillStyle(NEON.cyan, 1).fillRoundedRect(x - PLAYER_W / 2, top, PLAYER_W, PLAYER_H - 16, 10);
        // Visor.
        g.fillStyle(NEON.bg, 1).fillRoundedRect(x + 1, top + 7, 11, 7, 2);
        g.fillStyle(NEON.pink, 1).fillRect(x + 3, top + 9, 7, 3);
    }
    updateHud() {
        const metres = Math.floor(this.distance / PX_PER_METRE);
        if (metres >= 1000)
            unlock('runner.1k');
        if (metres >= 3000)
            unlock('runner.3k');
        this.distText.setText(`${metres}m`);
        this.coinText.setText(`COINS ${this.coinsTaken}`);
    }
}
