import Phaser from '../phaser-shim.js';
import { PALETTES } from './palette.js';
import { getSettings } from './settings.js';
export const PIXEL_FONT = '"Press Start 2P", monospace';
/** The active colors, chosen from the player's palette setting when the page loads. */
export const NEON = {
    ...PALETTES[getSettings().palette] ?? PALETTES.neon,
    white: 0xffffff,
    muted: 0x8a8ab8,
    bg: 0x05050d,
};
/** True when the player asked for reduced motion: skip decorative animation. */
export function reducedMotion() {
    return getSettings().reducedMotion;
}
export function hex(color) {
    return `#${color.toString(16).padStart(6, '0')}`;
}
/** Neon text: bright fill with a same-color shadow blur for the glow. */
export function neonText(scene, x, y, text, size, color) {
    const c = hex(color);
    return scene.add
        .text(x, y, text, { fontFamily: PIXEL_FONT, fontSize: `${size}px`, color: c, align: 'center' })
        .setOrigin(0.5)
        .setShadow(0, 0, c, 12, false, true);
}
/** Registers a one-shot "start" action on click/tap, Space, Enter or any gamepad button. */
export function onStart(scene, action) {
    let fired = false;
    const go = () => {
        if (fired)
            return;
        fired = true;
        action();
    };
    scene.input.once('pointerdown', go);
    scene.input.keyboard?.once('keydown-SPACE', go);
    scene.input.keyboard?.once('keydown-ENTER', go);
    scene.input.gamepad?.once('down', go);
}
/** Blinking "press start" style prompt. */
export function blinkingPrompt(scene, x, y, text, size = 16) {
    const prompt = neonText(scene, x, y, text, size, NEON.white);
    if (!reducedMotion())
        scene.tweens.add({ targets: prompt, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });
    return prompt;
}
/** Faint grid backdrop used by every game. */
export function drawGrid(scene, width, height, step = 40, color = NEON.purple) {
    const g = scene.add.graphics().setDepth(-10);
    g.lineStyle(1, color, 0.08);
    for (let x = 0; x <= width; x += step)
        g.lineBetween(x, 0, x, height);
    for (let y = 0; y <= height; y += step)
        g.lineBetween(0, y, width, y);
}
/** Text that rises and fades, for score popups. */
export function floatText(scene, x, y, text, color, size = 12) {
    const t = neonText(scene, x, y, text, size, color).setDepth(20);
    scene.tweens.add({ targets: t, y: y - 40, alpha: 0, duration: 700, ease: 'Cubic.easeOut', onComplete: () => t.destroy() });
}
/**
 * Big centered banner that pops in and fades out. A new banner at the same height replaces the
 * previous one, so quick successive events (e.g. back-to-back line clears) never draw on top of each other.
 */
export function showBanner(scene, text, color = NEON.cyan, y) {
    const { width, height } = scene.scale.gameSize;
    const by = y ?? height / 2 + 40;
    const slot = `banner:${Math.round(by)}`;
    const previous = scene.data.get(slot);
    if (previous?.active) {
        scene.tweens.killTweensOf(previous);
        previous.destroy();
    }
    const banner = neonText(scene, width / 2, by, text, 28, color).setDepth(30).setScale(0.5).setAlpha(0);
    scene.data.set(slot, banner);
    scene.tweens.chain({
        targets: banner,
        tweens: [
            { scale: 1, alpha: 1, duration: 300, ease: 'Back.easeOut' },
            { alpha: 0, duration: 400, delay: 900 },
        ],
        onComplete: () => banner.destroy(),
    });
}
/** Creates (once) and returns the key of a small white dot texture for particle effects. */
export function sparkTexture(scene) {
    if (!scene.textures.exists('spark')) {
        const g = scene.make.graphics({}, false);
        g.fillStyle(0xffffff).fillCircle(4, 4, 4).generateTexture('spark', 8, 8);
        g.destroy();
    }
    return 'spark';
}
/** One-shot particle emitter for bursts: call `emitter.explode(count, x, y)` after setting a tint. */
export function burstEmitter(scene, speed = 300, lifespan = 650) {
    return scene.add
        .particles(0, 0, sparkTexture(scene), {
        speed: { min: speed * 0.25, max: speed },
        lifespan,
        scale: { start: 1, end: 0 },
        alpha: { start: 1, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        emitting: false,
    })
        .setDepth(50);
}
/** Fades the camera out, then starts another scene. */
export function fadeToScene(scene, key, data) {
    scene.cameras.main.fadeOut(250, 5, 5, 13);
    scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.start(key, data));
}
