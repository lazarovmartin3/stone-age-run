import { Container, Text, Graphics } from 'pixi.js';

export class StartScreen extends Container {
    constructor(startGameCallback: () => void) {
        super();

        // Background
        const bg = new Graphics();
        bg.beginFill(0x000000, 0.5); // semi-transparent black
        bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
        bg.endFill();
        this.addChild(bg);

        // Start Game button
        const button = new Graphics();
        button.beginFill(0x00FF00); // Green color
        button.drawRect(0, 0, 200, 50);
        button.endFill();
        button.x = window.innerWidth / 2 - 100;
        button.y = window.innerHeight / 2 - 25;

        // Start Game button text
        const buttonText = new Text('Start Game', { font: '20px Arial', fill: '#FFFFFF' });
        buttonText.x = button.x + 50;
        buttonText.y = button.y + 10;

        // Make the button interactive
        button.interactive = true;
        button.buttonMode = true;

        // Trigger callback when the button is clicked
        button.on('pointerdown', () => {
            console.log("Start Game button clicked");
            startGameCallback(); // Call the callback function passed from the Game class
        });

        // Add button and text to the screen
        this.addChild(button);
        this.addChild(buttonText);
    }
}
