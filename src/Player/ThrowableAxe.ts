import { Sprite, Texture } from "pixi.js";
import Matter from "matter-js";
import { Game } from "../Game";

export class ThrowableAxe {
    sprite: Sprite;
    body: Matter.Body;
    speed = 40;

    constructor(private game: Game, x: number, y: number) {
        this.sprite = Sprite.from('assets/Player/Sprites/WEAPONS/AXE_0000.png');
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;

        const width = this.sprite.width;
        const height = this.sprite.height;

        this.body = Matter.Bodies.rectangle(x, y, width, height, {
            label: "axe",
            isSensor: true,
            restitution: 0.5,
        });

        Matter.Body.setVelocity(this.body, { x: this.speed, y: 0 });

        game.addPhysicsBody(this.body);
        game.app.stage.addChild(this.sprite);
        this.body.weaponAxeThrowable = this;
        this.body.gameObject = this;
    }

    update() {
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;

        // Remove axe when out of screen
        if (this.sprite.x > window.innerWidth + 100) {
            Matter.World.remove(this.game.physics.world, this.body);
            this.sprite.destroy();
            return false;
        }

        return true;
    }
}
