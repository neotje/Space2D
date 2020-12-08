import { Game } from "../game";
import { Component } from "../game/component";
import { Calc } from "../calc";
import { PhysicsComponent } from "./physicscomponent";

interface DebugVector {
    name: string;
    v: Calc.Vector;
    color: string;
}

interface DebugValue {
    name: string;
    val: any;
    color: string;
}

/**
 * @category Component
 */
export class DebugComponent extends Component {

    vectors: DebugVector[] = [];
    values: DebugValue[] = [];

    constructor(name: string) {
        super(name, "DebugComponent");
    }

    /**
     * check if debugger has vector.
     * @param name 
     */
    hasVector(name: string): number {
        for (let i = 0; i < this.vectors.length; i++) {
            const dv = this.vectors[i];
            if (dv.name == name) {
                return i;
            }
        }
        return -1;
    }

    /**
     * update/add vector to draw
     * @param name Vector name 
     * @param v 
     * @param color 
     */
    vector(name: string, v: Calc.Vector, color?: string): void {
        var i = this.hasVector(name);
        if (i == -1) {
            this.vectors.push({
                name,
                v,
                color: (color) ? color: '#ff0000'
            });
        } else {
            this.vectors[i].v = v;
        }
    }

    /**
     * check if debbuging component has value
     * @param name 
     */
    hasValue(name: string): number {
        for (let i = 0; i < this.values.length; i++) {
            const dv = this.values[i];
            if (dv.name == name) {
                return i;
            }
        }
        return -1;
    }

    /**
     * add/update value to show
     * @param name 
     * @param val 
     * @param color 
     */
    value(name: string, val: any, color?: string): void {
        var i = this.hasValue(name);
        if (i == -1) {
            this.values.push({
                name,
                val,
                color: (color) ? color: '#ff0000'
            });
        } else {
            this.values[i].val = val;
        }
    }



    draw() {
        Game.renderer.drawPoint(this.parent.worldPosition, "#ffffff", 3);

        for (const dv of this.vectors) {
            Game.renderer.drawLine({
                start: this.parent.worldPosition,
                end: this.parent.worldPosition.add(dv.v),
                color: dv.color
            });
        }

        var y: number = -(2 + this.values.length) * 7
        var x: number = 15
        var posx: number = 0

        var p: PhysicsComponent = this.parent.getComponentByType("PhysicsComponent")
        if (p && p.collisionShape) {
            posx = p.collisionShape.boundingBox.max.x
        }

        var parentPos: Calc.Vector = this.parent.worldPosition

        parentPos.x += posx

        Game.renderer.drawText(parentPos, new Calc.Vector(x, y), `#${this.parent.id} ${this.parent.name}`);
        Game.renderer.drawText(parentPos, new Calc.Vector(x, y + 14), `x:${Calc.roundTo(this.parent.worldPosition.x, 4)}`);
        Game.renderer.drawText(parentPos, new Calc.Vector(x, y + 2 * 14), `y:${Calc.roundTo(this.parent.worldPosition.y, 4)}`);

        for (let i = 0; i < this.values.length; i++) {
            var yOff: number = 15 + (i + 2) * 14

            const dval = this.values[i]

            if (typeof(dval.val) == "number") {
                dval.val = Calc.roundTo(dval.val, 10)
            }

            Game.renderer.drawText(parentPos, new Calc.Vector(x, y + yOff), `${dval.name}: ${dval.val}`)
        }
    }
}