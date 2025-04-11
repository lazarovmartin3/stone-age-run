import * as PIXI from 'pixi.js';
import { Config } from "../Config";

export class FoodUI extends PIXI.Text{

    constructor(){
        super();
        this.x = Config.food.x;
        this.y = Config.food.y;
        this.style = Config.food.style;
        this.anchor.set(Config.food.anchor);
        this.text = "Food: 0";
    }

    renderFood(hunger: number) {
        this.text = `Food: ${hunger}`;
    }
}
