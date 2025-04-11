import { Container, Sprite, Texture } from 'pixi.js';
import * as Matter from "matter-js";
import { Game } from "../src/Game";

export class Platform extends Sprite {
    body: Matter.Body;
    private game: Game;
    private container: Container;

    constructor(game: Game, type: string, x: number, y: number) {
        const texture = Texture.from(`${type}.png`);
        super(texture);

        this.game = game;
        this.position.set(x, y);

        // Optional styling
        if (type.includes('stone_platform')) {
            this.tint = 0xAAAAAA;
        }
        this.createContainer();
        this.createBody();
    }

    createContainer(){
        this.container = new Container();
        this.container.x = this.x;
        this.container.y = this.y;
    }

    createBody() {
        this.body = Matter.Bodies.rectangle(this.width / 2 + this.container.x, this.height / 2 + this.container.y , this.width - 50, this.height, {friction: 0, isStatic: true});
        this.game.addPhysicsBody(this.body);
        this.body.gamePlatform = this;
        this.body.render.fillStyle = "#000000";
    }

    updateBodyPosition(levelOffsetX: number) {
        if (this.body) {
            const width = this.texture.width;
            const height = this.texture.height;
            const worldX = this.x - 100 + levelOffsetX + width / 2;
            const worldY = this.y - 55 + height / 2;
    
            Matter.Body.setPosition(this.body, { x: worldX, y: worldY });
        }
    }

    move(vx: number){
        if(this.body){
            this.x += vx;
            Matter.Body.setPosition(this.body, {x: this.body.position.x + vx, y: this.body.position.y});
        }
    }
}
