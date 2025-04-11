import { Container, Graphics, Text } from 'pixi.js';
import { Game } from '../Game';

export class EndScreen extends Container {
    private restartButton: Graphics;
    private scoreText: Text;

    constructor(private game: Game, score: number) {
        super();

        // Background
        const bg = new Graphics();
        bg.beginFill(0x000000, 0.7); // Semi-transparent black background
        bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
        bg.endFill();
        this.addChild(bg);

        // Score Text
        this.scoreText = new Text(`Score: ${score}`, { font: '36px Arial', fill: 'white' });
        this.scoreText.x = window.innerWidth / 2 - this.scoreText.width / 2;
        this.scoreText.y = window.innerHeight / 2 - 100;
        this.addChild(this.scoreText);

        // Restart Button
        this.restartButton = new Graphics();
        this.restartButton.beginFill(0x00FF00); // Green color
        this.restartButton.drawRect(0, 0, 200, 50);
        this.restartButton.endFill();
        this.restartButton.x = window.innerWidth / 2 - 100;
        this.restartButton.y = window.innerHeight / 2 + 20;

        const restartText = new Text('Restart Game', { font: '24px Arial', fill: '#FFFFFF' });
        restartText.x = this.restartButton.x + 50;
        restartText.y = this.restartButton.y + 10;

        this.restartButton.interactive = true;
        this.restartButton.buttonMode = true;
        this.restartButton.on('pointerdown', this.handleRestartClick.bind(this));

        this.addChild(this.restartButton);
        this.addChild(restartText);
    }

    // Handle restart button click
    private handleRestartClick() {
        this.game.restartGame();
    }
}