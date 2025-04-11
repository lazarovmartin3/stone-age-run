import { Sprite, Texture } from "pixi.js";
import * as Matter from "matter-js";
import { Game } from "../src/Game";

export class Food{
    
    sprite: Sprite;
    body: Matter.Body;
    private game: Game;
    
    constructor(x: number, y: number, game: Game){
        this.game = game;
        this.createSprite(x,y);
        this.createBody();
    }

    createSprite(x:number, y: number){
        this.sprite = new Sprite(Texture.from("meet_0")); 
        this.sprite.x = x;
        this.sprite.y = y;
    }

    createBody() {
            const x = this.sprite.x + 50;
            const y = this.sprite.y + 40;
            //const centerX = this.x + width / 2 ;
            //const centerY = this.y + height / 2 ;
    
            this.body = Matter.Bodies.rectangle(x, y, this.sprite.width, this.sprite.height, {
                isStatic: true,
                friction: 0,
                label: 'food',
                render: {
                    fillStyle: '#000000'
                }
            });
    
            this.game.addPhysicsBody(this.body);
            this.body.gamefood = this;
            this.body.isSensor = true;
    }

    updateBodyPosition(levelOffsetX: number) {
            if (this.body) {
                const width = this.sprite.width;
                const height = this.sprite.height;
                const worldX = this.sprite.x + levelOffsetX;
                const worldY = this.sprite.y;
        
                Matter.Body.setPosition(this.body, { x: worldX, y: worldY });
            }
    }

     move(vx: number){
            if(this.body){
                this.sprite.x += vx;

                Matter.Body.setPosition(this.body, {x: this.body.position.x + vx, y: this.body.position.y});
            }
        }
}