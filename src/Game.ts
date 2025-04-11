import { Application, Assets, Sprite, Container } from 'pixi.js';
import { Input } from './Input';
import { Hero } from './Player/Hero';
import { ThrowableAxe } from './Player/ThrowableAxe';
import { Level } from './Level';
import * as Matter from "matter-js";
import { FoodUI } from "./UI/FoodUI";
import { ScoreUI } from "./UI/ScoreUI";
import { StartScreen } from './UI/StartScreen';
import { EndScreen } from './UI/EndScreen';

export class Game {
    app: Application;
    hero: Hero;
    input: Input;
    levelContainer: Container;
    level: Level;
    backgroundSpeed: number = 1;
    parallaxLayers: { sprite: Sprite, speed: number, type: string }[] = [];
    physics: Matter.Engine;

    foodUI: FoodUI;
    scoreUI: ScoreUI;
    paused: boolean;
    thrownAxes: ThrowableAxe[] = [];

    constructor() {
        this.app = new Application();

        this.app.init({
            width: 1280,
            height: 720,
            backgroundColor: 0x87ceeb,
            resolution: window.devicePixelRatio || 1,
            resizeTo: window,
        }).then(async () => {
           
            document.getElementById("pixi-canvas")?.appendChild(this.app.canvas);

            this.setupStartScreen();
/*
            this.levelContainer = new Container();

            await this.loadAssets();

            this.input = new Input();

            this.createPhysics();

            this.hero = new Hero(this.input, this);

            this.level = new Level(this,this.input);
            this.app.stage.addChild(this.level);
            this.app.stage.addChild(this.hero.container);
            this.createUI();

            this.setEvents();

            this.app.ticker.add(() => this.update());
            */
        });
    }

    private setupStartScreen() {
        const startScreen = new StartScreen(() => {
            console.log("Start game callback triggered");
            this.startGame(); // Start the game when the button is clicked
            this.app.stage.removeChild(startScreen); // Remove the start screen after the game starts
        });
    
        this.app.stage.addChild(startScreen);
    }

    private startGame() {
        this.paused = false;
        this.setupLevel();
    }

    private async setupLevel() {
        this.levelContainer = new Container();

        await this.loadAssets();

        this.input = new Input();

        this.createPhysics();

        this.hero = new Hero(this.input, this);
        this.hero.on('heroDead', () => {
            this.showEndScreen();
        });

        this.level = new Level(this,this.input);
        this.app.stage.addChild(this.level);
        this.app.stage.addChild(this.hero.container);
        this.createUI();

        this.setEvents();
        this.app.ticker.add((delta:number) => {
            this.update(delta); 
        });
        //this.app.ticker.add(this.update.bind(this));
    }

    showEndScreen(){
        const score = this.hero.score;
        const endScreen = new EndScreen(this, score);
        this.app.stage.addChild(endScreen);
    }

    restartGame(){
        location.reload();
    }

    async loadAssets() {
        await Assets.load('assets/atlas/Background.json');
        await Assets.load('assets/atlas/Level.json');
        await Assets.load('assets/atlas/Level.png');

        await Assets.load({
            alias: 'meet_0',
            src: 'assets/A-Level/Sprites/Single_Sprites/Food/meet_0.png'
        });

        // Preload hero animation frames
        const heroFrames: string[] = [];

        for (let i = 0; i <= 15; i++) {
            heroFrames.push(`assets/Player/Sprites/IDLE/IDLE_M_Human_${i}.png`);
            heroFrames.push(`assets/Player/Sprites/RUN/RUN_M_Human_${i}.png`);
            heroFrames.push(`assets/Player/Sprites/JUMP/JUMP_M_Human_${i}.png`);
        }

        await Assets.load(heroFrames);

        const dinoFrames: string[] = [];
        for (let i = 0; i <= 7; i++) {
            dinoFrames.push(`assets/freedinosprite/Idle_${i}.png`);
            dinoFrames.push(`assets/freedinosprite/Run_${i}.png`);
            dinoFrames.push(`assets/freedinosprite/Jump_${i}.png`);
        }

        await Assets.load(dinoFrames);
        
        await Assets.load(['assets/Player/Sprites/WEAPONS/AXE_0000.png']);
        

        this.createParallaxBackground();    

        this.app.stage.addChild(this.levelContainer);
    }

    createParallaxBackground() {
        const cloudSpacing = 400;
        const screenWidth = this.app.screen.width;

        // Clouds
        for (let i = 0; i < Math.ceil(screenWidth / cloudSpacing) + 1; i++) {
            const cloud = Sprite.from('Cloud.png');
            cloud.y = 100 + Math.random() * 50;
            cloud.x = i * cloudSpacing;
            cloud.tint = 0xFFFFFF; 
            this.app.stage.addChild(cloud);
            this.parallaxLayers.push({ sprite: cloud, speed: 0.2, type: 'cloud' });
        }

        // Hills
        const hills = Sprite.from('Mountain_1.png');
        hills.y = this.app.screen.height - hills.height + 50;
        hills.x = 0;
        hills.tint = 0x6B8E23; 
        this.app.stage.addChild(hills);
        this.parallaxLayers.push({ sprite: hills, speed: 0.1, type: 'hills' });
        const hills_1 = Sprite.from('Mountain_1.png');
        hills_1.y = this.app.screen.height - hills_1.height + 50;
        hills_1.x = 500;
        hills_1.tint = 0x6B8E23; 
        this.app.stage.addChild(hills_1);
        this.parallaxLayers.push({ sprite: hills_1, speed: 0.1, type: 'hills' });
        // Mountains
        const mountains = Sprite.from('Mountain_0.png');
        mountains.y = this.app.screen.height - mountains.height;
        mountains.x = 0;
        mountains.tint = 0x4682B4;
        this.app.stage.addChild(mountains);
        this.parallaxLayers.push({ sprite: mountains, speed: 0.05, type: 'mountains' });
        const mountains_1 = Sprite.from('Mountain_0.png');
        mountains_1.y = this.app.screen.height - mountains_1.height;
        mountains_1.x = 500;
        mountains_1.tint = 0x4682B4;
        this.app.stage.addChild(mountains_1);
        this.parallaxLayers.push({ sprite: mountains_1, speed: 0.05, type: 'mountains' });
    }

    updateParallaxBackground() {
        const screenWidth = this.app.screen.width;
    
        this.parallaxLayers.forEach(layer => {
            if (layer.type === 'cloud') {
                layer.sprite.x -= layer.speed;
                if (layer.sprite.x < -layer.sprite.width) {
                    layer.sprite.x = screenWidth + Math.random() * 200;
                    layer.sprite.y = 100 + Math.random() * 100;
                }
            }
        });
    }


    update(delta: number) {
        this.hero?.update();
        this.updateParallaxBackground();

        this.level?.update(delta);
        this.hero.syncWithBody();
        this.thrownAxes = this.thrownAxes.filter(axe => axe.update());
    }

    createPhysics(){
        this.physics = Matter.Engine.create();
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, this.physics);

        //renderer to debug Matter bodies
        /*const render = Matter.Render.create({
            element: document.getElementById("matter-canvas"),
            engine: this.physics,
            options:{
                width: window.innerWidth,
                height: window.innerHeight,
                pixelRatio: 1,
                wireframes: false
            }
        });

        Matter.Render.run(render);*/
    }

    addPhysicsBody(body: Matter.Body){
        Matter.World.add(this.physics.world, body);
    }

    setEvents(){
        Matter.Events.on(this.physics,"collisionStart", this.onCollisionStart.bind(this));
    }

    onCollisionStart(event){
            const colliders = [
            event.pairs[0].bodyA,
            event.pairs[0].bodyB
        ];

        const hero = colliders.find(body => body.gameHero);
        const platform = colliders.find(body => body.gamePlatform);
        const food = colliders.find(body => body.gamefood);
        const enemy = colliders.find(body => body.gameEnemy);
        const weaponAxeThrowable = colliders.find(body => body.weaponAxeThrowable);

        if(hero && platform){
            this.hero.stayOnPlatform();
        }

        if(hero && food){
            this.hero.collectFood(food.gamefood);
        }

        if(hero && enemy){
            this.hero.die();
        }

        if(weaponAxeThrowable && enemy){
            enemy.gameEnemy.die();

            const axe = weaponAxeThrowable.weaponAxeThrowable?.gameObject;

            if(axe){
                Matter.World.remove(this.physics.world, weaponAxeThrowable);
                axe.sprite?.destroy();
                const index = this.thrownAxes.indexOf(axe);
                if(index !== -1){
                    this.thrownAxes.splice(index, 1);
                }
            }

            this.hero.enemyKilled();
        }

        this.app.canvas.addEventListener("pointerdown", (e) => {
            if (e.button === 0) {
                const axe = new ThrowableAxe(this, this.hero.container.x + 50, this.hero.container.y);
                this.thrownAxes.push(axe);
            }
        });
        
    }

    createUI(){
        this.foodUI = new FoodUI();
        this.app.stage.addChild(this.foodUI);

        this.scoreUI = new ScoreUI();
        this.app.stage.addChild(this.scoreUI);

        this.hero.on("score", ()=>{
            this.foodUI.renderFood(this.hero.food_collected);
            this.scoreUI.renderScore(this.hero.score);
        });
    }
}
