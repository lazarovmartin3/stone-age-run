import { Container, Sprite, Texture, Rectangle } from 'pixi.js';
import { Assets } from 'pixi.js';
import { Platform } from './Platform';
import { Game } from "../src/Game";
import { Food } from "./Food";
import { Config } from "../src/Config";
import { Input } from './Input';
import * as Matter from "matter-js";
import {Enemy } from "./Enemy";

type LevelObject = {
    type: string;
    x: number;
    y: number;
};

export class Level extends Container {

    platforms: Platform[] = [];
    game: Game;
    input: Input;
    foods: Food[] = [];
    enemies: Enemy[] = [];
    vx = 0;
    speed = 4;

    lastPlatformX: number = 0;
    platformWidth: number = 630;
    platformGap: number = 150;

    spawnStarted: boolean = false;
    spawnDelay: number = 2000;
    lastSpawnTime: number = 0;

constructor(game:Game,input: Input) {
    super();
    this.levelTexture = Texture.from('assets/atlas/Level.png');
    this.levelData = Assets.get('assets/atlas/Level.json').data;

    this.input = input;

    this.game = game;
    this.createInitialLevel();
    this.foods = [];
    //this.createFoods();

    this.enemies = [];
    //this.createEnemies();
}

createInitialLevel() {
    for (let i = 0; i < 10; i++) {
        const x = i * (this.platformWidth + this.platformGap);
        const y = 300 + Math.floor(Math.random() * 4) * 100;
        this.spawnPlatform(x, y);
    }
    this.lastSpawnTime = Date.now();
}

spawnPlatform(x: number, y?: number) {
    const type = 'stone_platform_2';

    // Random Y if not passed
    if (!y) {
        y = 300 + Math.floor(Math.random() * 4) * 100;
    }

    const platform = new Platform(this.game, type, x, y);
    this.addChild(platform);
    this.platforms.push(platform);
    this.lastPlatformX = x;
}

    createFoods(x: number, y: number){
        const offset = Config.foods.offset.min + Math.random() * ( Config.foods.offset.max -  Config.foods.offset.min);
        /*this.platforms.forEach((obj) => {
            if(Math.random() < Config.foods.chance){
                const food = new Food(obj.x, obj.y - y, this.game);
                this.addChild(food.sprite);
                this.foods.push(food);
            }
        });*/     
        if(Math.random() < Config.foods.chance){
            const food = new Food(x, y - offset, this.game);
            this.addChild(food.sprite);
            this.foods.push(food);
        }
    }

    createEnemies(x: number, y: number){
        const offset = Config.enemy.offset.min + Math.random() * ( Config.enemy.offset.max -  Config.enemy.offset.min);
        /*this.platforms.forEach((obj) => {
            if(Math.random() < Config.enemy.chance){
                const enemy = new Enemy(this.game,obj.x + offset, obj.y - 160);
                this.addChild(enemy.container);
                this.enemies.push(enemy);
            }
        });*/
        if(Math.random() < Config.enemy.chance){
            const enemy = new Enemy(this.game, x + offset, y - 160);
            this.addChild(enemy.container);
            this.enemies.push(enemy);
        }
    }

    update(delta: number) {
        /*this.platforms.forEach((platform) => {
            platform.updateBodyPosition(levelOffsetX);
        });

        this.foods.forEach(food => {
            food.updateBodyPosition(levelOffsetX);
        });*/
        this.handleInput();
        this.enemies.forEach(enemy => enemy.update(delta));

        /*const screenLeftEdge = -levelOffsetX - this.platformWidth;

        // Remove old platforms
        this.platforms = this.platforms.filter(platform => {
            if (platform.x + this.platformWidth < screenLeftEdge) {
                this.removeChild(platform);
                Matter.World.remove(this.game.physics.world, platform.body);
                return false;
            }
            return true;
        });*/

        // Check if we need to spawn a new platform
        const lastPlatform = this.platforms[this.platforms.length - 1];

        const screenRightEdge = window.innerWidth;
        const thresholdX = lastPlatform.x + this.platformWidth + this.platformGap;

        if (thresholdX < screenRightEdge + 300) {
            const newX = lastPlatform.x + this.platformWidth + this.platformGap;
            const newY = 300 + Math.floor(Math.random() * 4) * 100; // e.g. 300–600
            this.spawnPlatform(newX, newY);

            if (this.shouldSpawnEntities()) {
                this.createEnemies(newX, newY);
                this.createFoods(newX, newY);
            }
        }
    }

    shouldSpawnEntities(): boolean {
        if (!this.spawnStarted) {
            if (Date.now() - this.lastSpawnTime > this.spawnDelay) {
                this.spawnStarted = true;
            }
            return false;
        }
        return true;
    }

    handleInput() {
        this.vx = 0;

        if (this.input.isKeyDown('ArrowLeft') || this.input.isKeyDown('KeyA')) {
            this.vx = Config.hero.speed;
        }

        if (this.input.isKeyDown('ArrowRight') || this.input.isKeyDown('KeyD')) {
            this.vx = -Config.hero.speed;
        }
        
        const isHeroStuck = this.game.hero.container.x <  this.game.hero.origin_x ;

        if(!isHeroStuck){
            
        }
        this.platforms.forEach((platform) => {
            platform.move(this.vx);
        });

        this.foods.forEach(food => {
            food.move(this.vx);
        });

        this.enemies.forEach(enemy => {
            enemy.move(this.vx);
        });

    }
}