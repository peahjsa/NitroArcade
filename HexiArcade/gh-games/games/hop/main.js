
import { startArcadeGame } from '../../shared/phaser-config.js';
import { ArcadeGameOverScene } from '../../shared/scenes.js';
import { HEIGHT, WIDTH } from './config.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
void startArcadeGame({
    width: WIDTH,
    height: HEIGHT,
    scenes: [MenuScene, GameScene, ArcadeGameOverScene],
});
