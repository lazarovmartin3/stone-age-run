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

        const instructions = new Text(
            `Help the caveman find food—but watch out for dinosaurs!\n\n` +
            `Controls:\n` +
            `W - Jump\nA / D - Move left and right\nLeft Mouse Button - Throw axe\n\n` +
            `Rules:\n` +
            `🍖 Eating meat gives strength.\n🔥 Getting hit by fireballs or enemies reduces food.\n☠️ Falling off the platform results in instant death.`,
            {
                fontFamily: 'Arial',
                fontSize: 20,
                fill: '#ffffff',
                wordWrap: true,
                wordWrapWidth: 500,
                lineHeight: 28
            }
        );
        instructions.x = 250;
        instructions.y = window.innerHeight / 2 - 200;
        this.addChild(instructions);

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
