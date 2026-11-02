import Phaser from '../phaser-shim.js';
import { NEON, PIXEL_FONT } from './ui.js';
export function isTouchDevice() {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}
/**
 * Calls `handler` with the swipe direction, or 'tap' for a short press without movement.
 * Each finger is tracked separately, so two players can swipe at the same time.
 */
export function onSwipe(scene, handler, opts = {}) {
    const threshold = opts.threshold ?? 30;
    const active = new Map();
    scene.input.on('pointerdown', (p) => {
        if (opts.region && !opts.region.contains(p.x, p.y))
            return;
        active.set(p.id, { x: p.x, y: p.y, swiped: false });
    });
    scene.input.on('pointermove', (p) => {
        const t = active.get(p.id);
        if (!t || !p.isDown || !opts.continuous)
            return;
        const dir = direction(p.x - t.x, p.y - t.y, threshold);
        if (dir) {
            handler(dir);
            t.swiped = true;
            t.x = p.x;
            t.y = p.y;
        }
    });
    const release = (p) => {
        const t = active.get(p.id);
        if (!t)
            return;
        active.delete(p.id);
        const dir = direction(p.x - t.x, p.y - t.y, threshold);
        if (dir)
            handler(dir);
        else if (!t.swiped)
            handler('tap');
    };
    // A finger that slides off the canvas edge still completes its swipe.
    scene.input.on('pointerup', release);
    scene.input.on('pointerupoutside', release);
}
function direction(dx, dy, threshold) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold)
        return null;
    if (Math.abs(dx) > Math.abs(dy))
        return dx > 0 ? 'right' : 'left';
    return dy > 0 ? 'down' : 'up';
}
/**
 * On-screen analog stick. It appears wherever the player first touches inside its zone
 * (so it works for any hand size), and reports x/y in -1..1.
 */
export class VirtualStick {
    constructor(scene, zone, radius = 60) {
        this.x = 0;
        this.y = 0;
        this.pointerId = null;
        const home = { x: zone.x + radius + 30, y: zone.bottom - radius - 30 };
        this.base = scene.add.circle(home.x, home.y, radius, NEON.cyan, 0.08).setStrokeStyle(2, NEON.cyan, 0.5).setDepth(900);
        this.knob = scene.add.circle(home.x, home.y, radius * 0.45, NEON.cyan, 0.35).setDepth(901);
        scene.input.on('pointerdown', (p) => {
            if (this.pointerId !== null || !zone.contains(p.x, p.y))
                return;
            this.pointerId = p.id;
            this.base.setPosition(p.x, p.y);
            this.knob.setPosition(p.x, p.y);
        });
        scene.input.on('pointermove', (p) => {
            if (p.id !== this.pointerId)
                return;
            const dx = p.x - this.base.x;
            const dy = p.y - this.base.y;
            const len = Math.min(Math.hypot(dx, dy), radius);
            const angle = Math.atan2(dy, dx);
            this.knob.setPosition(this.base.x + Math.cos(angle) * len, this.base.y + Math.sin(angle) * len);
            this.x = (Math.cos(angle) * len) / radius;
            this.y = (Math.sin(angle) * len) / radius;
        });
        const release = (p) => {
            if (p.id !== this.pointerId)
                return;
            this.pointerId = null;
            this.x = 0;
            this.y = 0;
            this.base.setPosition(home.x, home.y);
            this.knob.setPosition(home.x, home.y);
        };
        scene.input.on('pointerup', release);
        scene.input.on('pointerupoutside', release);
    }
    get value() {
        return { x: this.x, y: this.y };
    }
}
/** Round on-screen button. Tracks its own pointer so it works alongside a stick (multi-touch). */
export class VirtualButton {
    constructor(scene, x, y, label, color = NEON.pink, radius = 42) {
        this.pointers = new Set();
        this.circle = scene.add.circle(x, y, radius, color, 0.12).setStrokeStyle(2, color, 0.7).setDepth(900);
        scene.add
            .text(x, y, label, { fontFamily: PIXEL_FONT, fontSize: '12px', color: '#e8e8ff' })
            .setOrigin(0.5)
            .setDepth(901);
        const hit = new Phaser.Geom.Circle(x, y, radius * 1.3);
        scene.input.on('pointerdown', (p) => {
            if (hit.contains(p.x, p.y)) {
                this.pointers.add(p.id);
                this.circle.setFillStyle(color, 0.35);
            }
        });
        const release = (p) => {
            if (this.pointers.delete(p.id) && this.pointers.size === 0)
                this.circle.setFillStyle(color, 0.12);
        };
        scene.input.on('pointerup', release);
        scene.input.on('pointerupoutside', release);
    }
    get isDown() {
        return this.pointers.size > 0;
    }
    /** True if a touch at (x, y) would land on this button (so other handlers can ignore it). */
    contains(x, y) {
        return Phaser.Geom.Circle.Contains(new Phaser.Geom.Circle(this.circle.x, this.circle.y, this.circle.radius * 1.3), x, y);
    }
}
