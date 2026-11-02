import Phaser from '../phaser-shim.js';
import { getSettings } from './settings.js';
export const DEFAULT_BINDINGS = {
    left: { keys: ['LEFT', 'A'], buttons: [14], stick: 'left' },
    right: { keys: ['RIGHT', 'D'], buttons: [15], stick: 'right' },
    up: { keys: ['UP', 'W'], buttons: [12], stick: 'up' },
    down: { keys: ['DOWN', 'S'], buttons: [13], stick: 'down' },
    action: { keys: ['SPACE', 'ENTER'], buttons: [0] },
    alt: { keys: ['SHIFT', 'X'], buttons: [1] },
    pause: { keys: ['P', 'ESC'], buttons: [9] },
    mute: { keys: ['M'], buttons: [8] },
};
/** Keyboard halves for local two-player games (each player also gets their own gamepad). */
const PLAYER_KEYS = {
    1: { left: ['A'], right: ['D'], up: ['W'], down: ['S'], action: ['SPACE'], alt: ['SHIFT'], pause: ['P', 'ESC'], mute: ['M'] },
    2: { left: ['LEFT'], right: ['RIGHT'], up: ['UP'], down: ['DOWN'], action: ['ENTER'], alt: ['CTRL'], pause: ['P', 'ESC'], mute: ['M'] },
};
const STICK_DEADZONE = 0.25;
/** How far the stick must move before it counts as a digital direction press. */
const STICK_PRESS = 0.5;
export class ArcadeControls {
    constructor(scene, extra, options = {}) {
        this.scene = scene;
        this.options = options;
        this.keysByAction = new Map();
        this.actionsByKeyCode = new Map();
        this.virtual = new Map();
        this.down = new Set();
        this.prevNonKey = new Set();
        this.pressed = new Set();
        this.latched = new Set();
        this.bindings = { ...this.resolveDefaults(), ...(extra ?? {}) };
        const kb = scene.input.keyboard;
        if (kb) {
            for (const [name, binding] of Object.entries(this.bindings)) {
                const keys = (binding.keys ?? []).map((k) => kb.addKey(k));
                this.keysByAction.set(name, keys);
                for (const key of keys) {
                    const list = this.actionsByKeyCode.get(key.keyCode) ?? [];
                    list.push(name);
                    this.actionsByKeyCode.set(key.keyCode, list);
                }
            }
            // Latch key presses from events so a tap shorter than one frame is never missed.
            kb.on('keydown', (e) => {
                if (e.repeat)
                    return;
                for (const name of this.actionsByKeyCode.get(e.keyCode) ?? [])
                    this.latched.add(name);
            });
        }
        scene.events.on(Phaser.Scenes.Events.PRE_UPDATE, this.refresh, this);
        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.events.off(Phaser.Scenes.Events.PRE_UPDATE, this.refresh, this));
    }
    /** Default bindings for this seat: per-player key halves, or the solo keys with the player's custom bindings. */
    resolveDefaults() {
        const out = {};
        const custom = getSettings().bindings;
        for (const [name, b] of Object.entries(DEFAULT_BINDINGS)) {
            const keys = this.options.player
                ? PLAYER_KEYS[this.options.player][name]
                : custom[name]
                    ? [custom[name].code]
                    : b.keys;
            out[name] = { ...b, keys };
        }
        return out;
    }
    /** This seat's gamepad: the first connected pad for solo play, or pad 1 / pad 2 in two-player games. */
    get pad() {
        const gp = this.scene.input.gamepad;
        if (!gp || gp.total === 0)
            return undefined;
        const pads = gp
            .getAll()
            .filter((p) => p.connected)
            .sort((a, b) => a.index - b.index);
        return pads[(this.options.player ?? 1) - 1];
    }
    get usingGamepad() {
        return this.pad !== undefined;
    }
    /** Adds an extra source (e.g. an on-screen button) that holds a binding down. */
    addVirtual(name, isDown) {
        const list = this.virtual.get(name) ?? [];
        list.push(isDown);
        this.virtual.set(name, list);
    }
    /** Adds an analog stick source (e.g. an on-screen joystick) merged into axisX/axisY. */
    setStick(source) {
        this.stickSource = source;
    }
    isDown(name) {
        return this.down.has(name);
    }
    justPressed(name) {
        return this.pressed.has(name);
    }
    get axisX() {
        return this.axis('x');
    }
    get axisY() {
        return this.axis('y');
    }
    axis(which) {
        const stick = this.stickValue();
        const analog = which === 'x' ? stick.x : stick.y;
        if (Math.abs(analog) > STICK_DEADZONE)
            return analog;
        const neg = which === 'x' ? 'left' : 'up';
        const pos = which === 'x' ? 'right' : 'down';
        // Keys and d-pad only; the stick was already handled above.
        return (this.digitalDown(pos) ? 1 : 0) - (this.digitalDown(neg) ? 1 : 0);
    }
    stickValue() {
        let x = 0;
        let y = 0;
        const pad = this.pad;
        if (pad) {
            x = pad.leftStick.x;
            y = pad.leftStick.y;
        }
        if (this.stickSource) {
            const v = this.stickSource();
            if (Math.abs(v.x) > Math.abs(x))
                x = v.x;
            if (Math.abs(v.y) > Math.abs(y))
                y = v.y;
        }
        return { x, y };
    }
    keyDown(name) {
        return (this.keysByAction.get(name) ?? []).some((k) => k.isDown);
    }
    buttonDown(name) {
        const pad = this.pad;
        return !!pad && (this.bindings[name]?.buttons ?? []).some((i) => pad.buttons[i]?.pressed);
    }
    digitalDown(name) {
        return this.keyDown(name) || this.buttonDown(name) || (this.virtual.get(name) ?? []).some((fn) => fn());
    }
    refresh() {
        const stick = this.stickValue();
        const down = new Set();
        const nonKeyDown = new Set();
        for (const [name, b] of Object.entries(this.bindings)) {
            const stickDown = (b.stick === 'left' && stick.x < -STICK_PRESS) ||
                (b.stick === 'right' && stick.x > STICK_PRESS) ||
                (b.stick === 'up' && stick.y < -STICK_PRESS) ||
                (b.stick === 'down' && stick.y > STICK_PRESS);
            const other = this.buttonDown(name) || stickDown || (this.virtual.get(name) ?? []).some((fn) => fn());
            if (other)
                nonKeyDown.add(name);
            if (other || this.keyDown(name))
                down.add(name);
        }
        // Edge detection: keyboard presses come from latched events, everything else from frame-to-frame state.
        const pressed = new Set(this.latched);
        for (const name of nonKeyDown)
            if (!this.prevNonKey.has(name))
                pressed.add(name);
        this.latched.clear();
        this.prevNonKey = nonKeyDown;
        this.down = down;
        this.pressed = pressed;
    }
}
