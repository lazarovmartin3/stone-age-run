import { Sprite, Texture } from "pixi.js";
import Matter from "matter-js";
import { Game } from "./Game";
import { Enemy } from "./Enemy";

export class Fireball {
    public sprite: Sprite;
    private body: Matter.Body;
    private speed = -20;
    private parentEnemy: Enemy;

    constructor(private game: Game, x: number, y: number, parent: Enemy) {

        this.sprite = Sprite.from('assets/freedinosprite/fireball.png');
        this.sprite.anchor.set(0.5);
        //this.sprite.scale.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;

        this.parentEnemy = parent;
        const width = this.sprite.width;
        const height = this.sprite.height;

        this.body = Matter.Bodies.rectangle(x, y, width, height, {
            label: "fireball",
            isSensor: true,
            restitution: 0.5,
        });

        Matter.Body.setVelocity(this.body, { x: this.speed, y: 0 });

        game.addPhysicsBody(this.body);
        game.app.stage.addChild(this.sprite);
        this.body.enemyFireball = this;
    }

    update() {
        Matter.Body.setVelocity(this.body, { x: this.speed, y: 0 });

        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
    }

    destroy() {
        Matter.World.remove(this.game.physics.world, this.body);
        this.sprite.destroy();
    }

    playerIsHit() {
        this.parentEnemy.clearFireball(this);
    }
}
