import * as PIXI from 'pixi.js';
import { Config } from "../Config";

export class ScoreUI extends PIXI.Text{

    constructor(){
        super();
        this.x = Config.food.x;
        this.y = Config.food.y + 30;
        this.style = Config.food.style;
        this.anchor.set(Config.food.anchor);
        this.text = "Score: 0";
    }

    renderScore(score: number) {
        this.text = `Score: ${score}`;
    }
}
