import { AnimatedSprite, Texture, Container, EventEmitter } from 'pixi.js';
import { Input } from '../Input';
import * as Matter from "matter-js";
import { Game } from "../Game";
import { Food } from "../Food";
import { Config } from "../Config";

export class Hero extends EventEmitter{
    container: Container = new Container();
    input: Input;

    idle: AnimatedSprite;
    run: AnimatedSprite;
    jump: AnimatedSprite;

    currentAnimation: AnimatedSprite;

    vx = 0;
    vy = 0;
    gravity = Config.common.gravity;
    jumpStrength = -25;
    grounded = false;

    food_collected: number;
    score: number;

    body: Matter.Body;
    origin_x = screen.width / 2;
    origin_y = 300;

    constructor(input: Input, private game: Game) {
        super();
        this.input = input;

        this.idle = this.createAnimation('IDLE');
        this.run = this.createAnimation('RUN');
        this.jump = this.createAnimation('JUMP');

        // Add all animations to container
        this.container.addChild(this.idle, this.run, this.jump);

        // Set default animation
        this.currentAnimation = this.idle;
        this.showAnimation(this.idle);

        //Spawn point
        this.container.x = this.origin_x;
        this.container.y = this.origin_y;
        this.createBody();

        this.food_collected = 0;
        this.score = 0;

    }

    createAnimation(type: 'IDLE' | 'RUN' | 'JUMP'): AnimatedSprite {
        const textures: Texture[] = [];
        for (let i = 0; i <= 15; i++) {
            textures.push(Texture.from(`assets/Player/Sprites/${type}/${type}_M_Human_${i}.png`));
        }

        const anim = new AnimatedSprite(textures);
        anim.anchor.set(0.2);
        anim.animationSpeed = 0.2;
        anim.loop = true;
        anim.visible = false;
        anim.play();
        return anim;
    }

    showAnimation(anim: AnimatedSprite) {
        if (this.currentAnimation === anim) return;

        this.currentAnimation.visible = false;
        this.currentAnimation = anim;
        this.currentAnimation.visible = true;
    }

    update() {
        this.handleInput();

         // Apply gravity
         if(!this.grounded){
            this.vy += this.gravity;
         }
         
         // Apply velocity with Matter.js
         Matter.Body.setVelocity(this.body, { x: 0, y: this.vy });

         this.syncWithBody();

         if (this.container.y > window.innerHeight) {
            this.die();
        }

        // Set proper animation
        if (!this.grounded) {
            this.showAnimation(this.jump);
        } else if (this.vx !== 0) {
            this.showAnimation(this.run);
        } else {
            this.showAnimation(this.idle);
        }
    }

    handleInput() {
        this.vx = 0;

        if (this.input.isKeyDown('ArrowLeft') || this.input.isKeyDown('KeyA')) {
            this.vx = -Config.hero.speed;
        }

        if (this.input.isKeyDown('ArrowRight') || this.input.isKeyDown('KeyD')) {
            this.vx = Config.hero.speed;
        }

        if ((this.input.isKeyDown('ArrowUp') || this.input.isKeyDown('KeyW') || this.input.isKeyDown('Space')) && this.grounded) {
            this.startJump();
        }
    }

    startJump(){
        this.grounded = false;
        this.vy = this.jumpStrength;
    }

    stopFalling(y: number) {
        this.vy = 0;
        this.container.y = y;
        this.grounded = true;
    }

    createBody(){
        const sprite = this.idle;
        const width = sprite.width;
        const height = sprite.height;

        const x = this.container.x;
        const y = this.container.y;

        this.body = Matter.Bodies.rectangle(x, y, width, height, {
            isStatic: false,
            label: 'hero',
            restitution: 0,
            friction: 0.1,
            frictionAir: 0.08,
            inertia: Infinity,
            angle: 0,
            render: {
                fillStyle: '#00ff00'
            }
        });

            this.body.render.fillStyle = "#000000"
            this.game.addPhysicsBody(this.body);
            this.body.gameHero = this;
    }

    syncWithBody() {
        this.container.x = this.body.position.x - this.idle.width / 4;
        this.container.y = this.body.position.y - this.idle.height / 4;
    }

    stayOnPlatform(){
        this.grounded = true;
    }

    collectFood(food: Food){
        Matter.World.remove(this.game.physics.world, food.body);
        food.sprite.destroy();

        const index = this.game.level.foods.indexOf(food);
        if (index !== -1) {
            this.game.level.foods.splice(index, 1);
        }
        this.food_collected += 1;
        this.score += 1;
        this.emit("score");
    }

    enemyKilled(){
        this.score += 1;
        this.emit("score");
    }

    die(){
        this.food_collected--;
        if(this.food_collected < 1){
            this.emit('heroDead');
        }
        else{
            this.emit("score");
        }
    }
}
