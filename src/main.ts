import { Assets } from 'pixi.js';
import { Game } from './Game';

async function loadAssets() {
    const idleFrames: string[] = [];

    for (let i = 0; i <= 15; i++) {
        const path = `assets/Player/Sprites/IDLE/IDLE_M_Human_${i}.png`;
        idleFrames.push(path);
    }

    await Assets.load(idleFrames);
}

loadAssets().then(() => {
    new Game();
});
