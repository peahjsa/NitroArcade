import { PX } from './config.js';
/**
 * Original pixel art for Star Siege, as bitmaps ('#' = lit pixel). Each alien has two frames
 * for its marching animation. Textures are generated once, in white, and tinted per row.
 */
const ART = {
    orb: [
        ['..#####..', '.#######.', '##.###.##', '#########', '.#.#.#.#.', '#.......#'],
        ['..#####..', '.#######.', '##.###.##', '#########', '#.#.#.#.#', '.#.....#.'],
    ],
    stinger: [
        ['....###....', '...#####...', '..##.#.##..', '.#########.', '#.#######.#', '#..#...#..#', '..#.....#..'],
        ['....###....', '...#####...', '..##.#.##..', '.#########.', '#.#######.#', '...#...#...', '.#.......#.'],
    ],
    drone: [
        ['..######..', '.########.', '##.####.##', '##########', '.##.##.##.', '##......##'],
        ['..######..', '.########.', '##.####.##', '##########', '.##.##.##.', '.##....##.'],
    ],
    cannon: [['......#......', '.....###.....', '.###########.', '#############', '#############']],
    mothership: [
        ['.....######.....', '...##########...', '..############..', '.##.##.##.##.##.', '################', '..###..##..###..'],
    ],
};
/** Row kinds from top to bottom, and what each is worth. */
export const ROW_KINDS = ['orb', 'stinger', 'stinger', 'drone', 'drone'];
export const ALIEN_POINTS = { orb: 30, stinger: 20, drone: 10 };
function draw(scene, key, rows) {
    if (scene.textures.exists(key))
        return;
    const w = rows[0].length * PX;
    const h = rows.length * PX;
    const g = scene.make.graphics({}, false);
    g.fillStyle(0xffffff, 1);
    rows.forEach((row, y) => [...row].forEach((c, x) => c === '#' && g.fillRect(x * PX, y * PX, PX, PX)));
    g.generateTexture(key, w, h);
    g.destroy();
}
/** Creates every Star Siege texture (safe to call from several scenes). */
export function makeSprites(scene) {
    for (const kind of ['orb', 'stinger', 'drone']) {
        ART[kind].forEach((frame, i) => draw(scene, `${kind}${i}`, frame));
    }
    draw(scene, 'cannon', ART.cannon[0]);
    draw(scene, 'mothership', ART.mothership[0]);
}
