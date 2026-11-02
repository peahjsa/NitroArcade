import { loadJSON, saveJSON } from './storage.js';
/**
 * Arcade-wide player settings, shared by the hub and every game (saved on this device).
 * No Phaser here, so the hub can use it without loading the game engine.
 */
/** Actions players can rebind. Game-specific extras (e.g. Stack's rotate keys) keep their defaults. */
export const REBINDABLE = ['left', 'right', 'up', 'down', 'action', 'alt', 'pause', 'mute'];
/** Human-readable default keys per action, for the settings screen. */
export const DEFAULT_KEY_LABELS = {
    left: '← / A',
    right: '→ / D',
    up: '↑ / W',
    down: '↓ / S',
    action: 'Space / Enter',
    alt: 'Shift / X',
    pause: 'P / Esc',
    mute: 'M',
};
const KEY = 'settings';
function prefersReducedMotion() {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    catch {
        return false;
    }
}
function defaults() {
    return { volume: 0.8, muted: false, reducedMotion: prefersReducedMotion(), palette: 'neon', bindings: {} };
}
let current = { ...defaults(), ...loadJSON(KEY, {}) };
const listeners = new Set();
export function getSettings() {
    return current;
}
export function updateSettings(patch) {
    current = { ...current, ...patch };
    saveJSON(KEY, current);
    listeners.forEach((fn) => fn(current));
    return current;
}
export function resetSettings() {
    current = defaults();
    saveJSON(KEY, current);
    listeners.forEach((fn) => fn(current));
    return current;
}
/** Calls `fn` whenever settings change. Returns an unsubscribe function. */
export function onSettingsChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}
