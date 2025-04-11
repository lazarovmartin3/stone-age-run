import { AnimatedSprite, Texture, Container, EventEmitter, Ticker } from 'pixi.js';
import * as Matter from "matter-js";
import { Game } from "./Game";
import { Config } from "./Config";
import { Fireball } from "./Fireball";

enum EnemyState{
    Idle, Walk, Jump
};

export class Enemy {

   private container: Container = new Container();
   private idle: AnimatedSprite;
   private run: AnimatedSprite;
   private jump: AnimatedSprite;

   private state: EnemyState = EnemyState.Idle;
   private stateTimer = 0;
   private attackTimer = 0;
 
   private currentAnimation: AnimatedSprite;

   private gravity = Config.common.gravity;
   private jumpStrength = -25;
   private grounded = false;
 
   private body: Matter.Body;
   private isJumping = false;
   private isWalking = false;
   private origin_y: number;
   private fireballs: Fireball[] = [];

    constructor(private game: Game, x: number, y: number){

        this.origin_y = y;
        this.idle = this.createAnimation('Idle');
        this.run = this.createAnimation('Run');
        this.jump = this.createAnimation('Jump');

        this.container.addChild(this.idle, this.run, this.jump);

        //this.currentAnimation = this.idle;
        this.showAnimation(this.idle);

        this.container.scale.set(0.5);
        this.container.x = x;
        this.container.y = y;
        this.container.scale.x = -0.5;

        this.createBody();
    }


    createAnimation(type: 'Idle' | 'Run' | 'Jump'): AnimatedSprite {
        const textures: Texture[] = [];
        for (let i = 0; i <= 7; i++) { // Loop from 0 to 7 (8 frames)
            textures.push(Texture.from(`assets/freedinosprite/${type}_${i}.png`));
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

        if(!this.currentAnimation) this.currentAnimation = anim;
        this.currentAnimation.visible = false;
        this.currentAnimation = anim;
        this.currentAnimation.visible = true;
    }

    createBody(){
            //const sprite = this.idle;
            const width = this.container.width / 2;
            const height = this.container.height;
    
            const x = this.container.x;
            const y = this.container.y;
    
            this.body = Matter.Bodies.rectangle(x, y, width, height, {
                isStatic: false,
                label: 'enemy',
                restitution: 0,
                friction: 0.1,
                frictionAir: 0.08,
                inertia: Infinity,
                angle: 0,
                render: {
                    fillStyle: '#00ff00'
                }
            });
    
            this.game.addPhysicsBody(this.body);
            this.body.gameEnemy = this;
        }
    

    move(vx: number){
        if(this.body){
            this.container.x += vx;

            Matter.Body.setPosition(this.body, {x: this.body.position.x + vx, y: this.body.position.y});
        }
    }

    update(delta: Ticker) {
        // Check if enemy is grounded (on the platform)
        if (this.body.velocity.y === 0) {
            this.grounded = true;
            this.isJumping = false;
        } else {
            this.grounded = false;
            this.isJumping = true;
        }

        // Update the animation based on the enemy state
        if (this.isJumping) {
            this.showAnimation(this.jump);
        } else if (this.isWalking) {
            this.showAnimation(this.run);
        } else {
            this.showAnimation(this.idle);
        }

        // Add gravity effect if the enemy is not grounded
        if (!this.grounded) {
            this.body.force.y = this.gravity;
        }

        this.updateStates(delta);
        this.createFireball(delta);
        this.fireballs.forEach((fireball) => {
            if (fireball) fireball.update();
        });
        this.clearFirballs();
    }

    updateStates(delta: Ticker){
        this.stateTimer += delta.deltaTime;

        switch (this.state) {
            case EnemyState.Idle:
                this.showAnimation(this.idle);
                if (this.stateTimer > 2000) {
                    this.changeState(Math.random() < 0.5 ? EnemyState.Walk : EnemyState.Jump);
                }
                break;
    
            case EnemyState.Walk:
                this.showAnimation(this.run);
                this.move(-1);
                if (this.stateTimer > 1000) {
                    this.changeState(EnemyState.Idle);
                }
                break;
    
            case EnemyState.Jump:
                this.showAnimation(this.jump);
                if (this.grounded) {
                    Matter.Body.setVelocity(this.body, { x: 0, y: this.jumpStrength });
                    this.grounded = false;
                }
                if (this.stateTimer > 1000) {
                    this.changeState(EnemyState.Idle);
                }
                break;
        }
    
        // Sync sprite position
        this.container.x = this.body.position.x;
        this.container.y = this.body.position.y;
    }

    changeState(newState: EnemyState) {
        this.state = newState;
        this.stateTimer = 0;
    }

    performJump() {
        if (this.grounded) {
            this.body.force.y = this.jumpStrength;
            this.isJumping = true;
            this.grounded = false;
            this.showAnimation(this.jump); 
        }
    }

    walk() {
        this.isWalking = true;
        this.showAnimation(this.run);
    }

    stopWalking() {
        this.isWalking = false;
        this.showAnimation(this.idle); 
    }

    createFireball(detla: Ticker) {
        this.attackTimer += detla.deltaTime;
        if (this.attackTimer > 200) {
            const fireball = new Fireball(this.game, this.container.x, this.container.y, this);
            this.fireballs.push(fireball);
            this.attackTimer = 0;
        }
    }

    clearFireball(fireball: Fireball) {
        fireball.destroy();
        const index = this.fireballs.indexOf(fireball);
        if (index !== -1) {
            this.fireballs.splice(index, 1);
        }
    }

    clearFirballs() {
        this.fireballs = this.fireballs.filter((fireball) => {
            const stillVisible = fireball.sprite.x > -100;
            if (!stillVisible) fireball.destroy();
            return stillVisible;
        });
    }

    // To detect platform collision, ensure the enemy is grounded and on the platform
    detectPlatformCollision() {
        // Handle platform collision logic, and adjust the enemy's y position accordingly
        if (this.body.position.y + this.body.bounds.max.y >= this.origin_y) {
            this.grounded = true;
            this.body.velocity.y = 0; // Stop falling when grounded
            this.body.position.y = this.origin_y - this.body.bounds.max.y;
        }
    }

    die(){
        Matter.World.remove(this.game.physics.world, this.body);
        this.container.destroy();

        const index = this.game.level.enemies.indexOf(this);
        if (index !== -1) {
            this.game.level.enemies.splice(index, 1);
        }
    }
    
}