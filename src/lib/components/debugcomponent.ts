import { Game } from "../game";
import { Component } from "../game/component";
import { Calc } from "../calc";
import { PhysicsComponent } from "./physicscomponent";
import { rectangle } from "../game/renderer";


interface DebugComponentProps {
    enable?: boolean;
}

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

    vectors: DebugVector[] = []
    values: DebugValue[] = []
    fontSize: number = 12

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
     * update/add vector to draw.
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
     * check if debbuging component has value.
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
     * add/update value to show.
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
                color: (color) ? color: '#fff'
            });
        } else {
            this.values[i].val = val;
        }
    }


    drawRect(opt: rectangle): void {
        if (this.enable) Game.renderer.drawRect(opt)
    }



    draw() {
        // font style
        var font = this.fontSize + "px sans-serif"

        // draw object position point
        Game.renderer.drawPoint(this.parent.worldPosition, "#fff", 3)

        // draw vectors
        // for (const dv of this.vectors) {
        //     Game.renderer.drawLine({
        //         start: this.parent.worldPosition,
        //         end: this.parent.worldPosition.add(dv.v),
        //         color: dv.color
        //     });
        //     Game.renderer.drawText(this.parent.worldPosition.add(dv.v), new Calc.Vector(0, -5), dv.name, {
        //         font: font,
        //         color: dv.color
        //     })
        // }

        // text position variable
        var textOffset = new Calc.Vector(10, 1.5 * -(3 + this.values.length) * this.fontSize)
        var textPos = this.parent.worldPosition

        // determine the x position of the debug text.
        var p: PhysicsComponent = this.parent.getComponentByType("PhysicsComponent")
        if (p && p.collisionShape) {
            textPos.x += p.collisionShape.boundingBox.max.x
        }

        // draw name and position info
        Game.renderer.drawText(textPos, textOffset, `#${this.parent.id} ${this.parent.name}`, {
            font: font
        });
        Game.renderer.drawText(textPos, textOffset.addY(this.fontSize + 2), `x:${Calc.roundTo(this.parent.worldPosition.x, 4)}`, {
            font: font
        });
        Game.renderer.drawText(textPos, textOffset.addY(this.fontSize + 2), `y:${Calc.roundTo(this.parent.worldPosition.y, 4)}`, {
            font: font
        });

        textOffset.addY(14)
        for (let i = 0; i < this.values.length; i++) {
            const dval: DebugValue = this.values[i]

            if (typeof(dval.val) == "number") {
                dval.val = Calc.roundTo(dval.val, 10)
            }

            Game.renderer.drawText(textPos, textOffset.addY(this.fontSize + 2), `${dval.name}: ${dval.val}`, {
                font: font,
                color: dval.color
            })
        }
    }
}