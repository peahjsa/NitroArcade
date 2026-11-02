import Phaser from '../phaser-shim.js';
import { drainRecentUnlocks, recordPlay } from './achievements.js';
import { ArcadeControls } from './controls.js';
import { OptionMenu } from './menu.js';
import { getHighScore, submitHighScore } from './storage.js';
import { isTouchDevice } from './touch.js';
import { blinkingPrompt, fadeToScene, NEON, neonText, onStart } from './ui.js';
/**
 * Draws the standard menu (title, best score, blinking prompt, help text) and starts the game
 * on click, tap, Space, Enter or any gamepad button. Draw any background decoration before calling this.
 */
export function buildMenu(scene, opts) {
    const { width, height } = scene.scale.gameSize;
    const [top, bottom] = opts.title;
    const [c1, c2] = opts.colors ?? [NEON.pink, NEON.cyan];
    neonText(scene, width / 2, 170, top, 56, c1);
    neonText(scene, width / 2, 240, bottom, 56, c2);
    const best = getHighScore(opts.gameId);
    if (best > 0)
        neonText(scene, width / 2, 320, `BEST ${best.toLocaleString()}`, 16, NEON.yellow);
    scene.add
        .text(width / 2, height - 60, opts.help, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        color: '#8a8ab8',
        align: 'center',
        lineSpacing: 6,
    })
        .setOrigin(0.5);
    const startScene = opts.startScene ?? 'Game';
    if (opts.modes) {
        let started = false;
        new OptionMenu(scene, new ArcadeControls(scene), {
            x: width / 2,
            y: 410,
            spacing: 300,
            items: opts.modes.map((m) => ({
                label: m.label,
                onSelect: () => {
                    if (started)
                        return;
                    started = true;
                    fadeToScene(scene, startScene, m.data);
                },
            })),
        });
        return;
    }
    blinkingPrompt(scene, width / 2, 410, isTouchDevice() ? 'TAP TO START' : 'CLICK OR PRESS SPACE');
    onStart(scene, () => fadeToScene(scene, startScene, opts.startData ?? {}));
}
/**
 * Shared game-over screen: final score, high-score check, any trophies earned this run, and
 * Play again / Menu options. Register it as 'GameOver'.
 */
export class ArcadeGameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    create(data) {
        const { width } = this.scale.gameSize;
        const isRecord = submitHighScore(data.gameId, data.score);
        recordPlay(data.gameId, data.score);
        const earned = drainRecentUnlocks();
        this.cameras.main.fadeIn(250, 5, 5, 13);
        neonText(this, width / 2, 130, 'GAME OVER', 48, NEON.pink);
        neonText(this, width / 2, 220, data.score.toLocaleString(), 40, NEON.cyan);
        if (data.detail)
            neonText(this, width / 2, 270, data.detail, 14, NEON.white);
        if (isRecord) {
            const record = neonText(this, width / 2, 315, 'NEW HIGH SCORE!', 18, NEON.yellow);
            this.tweens.add({ targets: record, scale: 1.15, duration: 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
        else {
            neonText(this, width / 2, 315, `BEST ${getHighScore(data.gameId).toLocaleString()}`, 14, NEON.yellow);
        }
        if (earned.length) {
            const names = earned.map((t) => t.title.toUpperCase());
            const line = names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2} MORE` : names.join(', ');
            neonText(this, width / 2, 365, `TROPHY: ${line}`, 11, NEON.green);
        }
        // Short delay so the input that ended the run doesn't instantly pick an option.
        this.time.delayedCall(600, () => {
            let chosen = false;
            const go = (key, payload) => {
                if (chosen)
                    return;
                chosen = true;
                fadeToScene(this, key, payload);
            };
            new OptionMenu(this, new ArcadeControls(this), {
                x: width / 2,
                y: 450,
                spacing: 300,
                size: 18,
                items: [
                    { label: 'PLAY AGAIN', onSelect: () => go(data.restartScene ?? 'Game', data.restartData ?? {}) },
                    { label: 'MENU', onSelect: () => go('Menu') },
                ],
            });
        });
    }
}
