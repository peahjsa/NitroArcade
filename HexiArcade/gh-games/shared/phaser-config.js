import Phaser from '../phaser-shim.js';
import { onUnlock } from './achievements.js';
import { hideLoader, initGameChrome } from './chrome.js';
import { registerOffline } from './pwa.js';
import { getSettings } from './settings.js';
import { showToast } from './toast.js';
import { PIXEL_FONT } from './ui.js';
/**
 * With reduced motion on, camera shake and flash become no-ops for every game, so no game has to
 * remember to check the setting before each effect.
 */
function applyReducedMotion() {
    if (!getSettings().reducedMotion)
        return;
    const proto = Phaser.Cameras.Scene2D.Camera.prototype;
    proto.shake = function () {
        return this;
    };
    proto.flash = function () {
        return this;
    };
}
/** Standard Phaser setup for arcade games: fixed logical resolution scaled to fit any screen. */
export function createArcadeGame(opts) {
    applyReducedMotion();
    const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: 'game',
        width: opts.width ?? 800,
        height: opts.height ?? 600,
        backgroundColor: opts.backgroundColor ?? '#05050d',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: opts.physics ?? { default: 'arcade', arcade: { debug: false } },
        // Three pointers so a touch stick and two buttons can be held at once; gamepads via the Gamepad API.
        input: { activePointers: 3, gamepad: true },
        scene: opts.scenes,
    });
    // Swap the page's "loading" placeholder for the game once its first frame is drawn.
    game.events.once(Phaser.Core.Events.POST_RENDER, hideLoader);
    // Handy for debugging and automated tests in `npm run dev`; stripped from production builds.
    if (import.meta.env.DEV)
        window.game = game;
    return game;
}
/**
 * Waits (briefly) for the pixel font so Phaser doesn't render text in the fallback font, then starts the game.
 * Use this from each game's main.ts.
 */
export async function startArcadeGame(opts) {
    registerOffline();
    initGameChrome();
    onUnlock((t) => showToast('Trophy unlocked', t.title));
    try {
        await Promise.race([document.fonts.load(`16px ${PIXEL_FONT}`), new Promise((r) => setTimeout(r, 1500))]);
    }
    catch {
        /* font loading unsupported; fall back to monospace */
    }
    return createArcadeGame(opts);
}
