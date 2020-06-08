import { Component } from "../game/component";
import { Vector } from "../math/vector";
import { getDeltaTime, root, renderer } from "../game";
import { gravityForce } from "../physics";
import { roundTo } from "../math";

interface PhysicalProperties {
    mass: number;
    velocity?: Vector;
    debug?: boolean;
}

interface Constrains {
    x: boolean;
    y: boolean;
}

export class PhysicsComponent extends Component {

    mass: number;
    velocity: Vector;
    a: Vector;
    f: Vector = new Vector(0, 0);
    debug: boolean;
    constrains: Constrains = {
        x: false,
        y: false
    }

    private debugPoints: Vector[] = [];
    private t: number = 0;
    private heaviestBody: PhysicsComponent;

    constructor(name: string, props: PhysicalProperties, constrains?: Constrains) {
        super(name, "PhysicsComponent");

        this.mass = props.mass;
        this.velocity = (props.velocity) ? props.velocity : new Vector(0, 0);
        this.debug = (props.debug) ? props.debug : false;
        this.constrains = (constrains) ? constrains : this.constrains; 
    }

    loopStart() {
        this.f = new Vector(0, 0);
    }

    update() {
        var dt = getDeltaTime();
        
        // save some debug data
        if (this.debug) {
            this.t += dt;

            if (this.t > 0.01) {                                
                this.debugPoints.push(this.parent.worldPosition);
                this.t = 0;
            }
        }
        
        // get all physics components
        var components: PhysicsComponent[] = root.findComponent('.' + this.type);
        
        for (const component of components) {
            if (component.id != this.id) {
                var Fg = gravityForce(this.mass, component.mass, Math.abs(this.parent.worldPosition.distanceTo(component.parent.worldPosition)));

                if (!this.heaviestBody) {
                    this.heaviestBody = component;
                }
                if (component.mass > this.heaviestBody.mass) {
                    this.heaviestBody = component;
                }

                var angle = this.parent.worldPosition.lookAt(component.parent.worldPosition).angle;

                var FgV = new Vector(2*Fg, 0);
                FgV.angle = angle;

                this.f.add(FgV)

                //ddconsole.log(this.parent.id, Fg);          
            }
        }
        

        var dt = getDeltaTime();

        this.a = this.f.copy().divide(this.mass);

        this.velocity.add(this.a.copy().scale(dt));

        if (this.constrains.x) {
            this.velocity.x = 0;
        }
        if (this.constrains.y) {
            this.velocity.y = 0;
        }

        this.parent.worldPosition = this.parent.worldPosition.add(this.velocity.copy().scale(dt));
    }

    draw() {
        //console.log(this.debugPoints);

        if (this.debug) {
            renderer.drawLine({
                start: this.parent.worldPosition,
                end: this.parent.worldPosition.add(this.velocity),
                color: '#ff0000'
            });
    
            renderer.drawLine({
                start: this.parent.worldPosition,
                end: this.parent.worldPosition.add(this.a.copy().scale(1)),
                color: '#00ff00'
            });

            renderer.drawText(this.parent.worldPosition, new Vector(0,29), `v: ${roundTo(this.velocity.magnitude, 3)}`);
            renderer.drawText(this.parent.worldPosition, new Vector(0,29 + 1*14), `m: ${roundTo(this.mass, 3)}`);
            renderer.drawText(this.parent.worldPosition, new Vector(0,29 + 2*14), `a: ${roundTo(this.a.magnitude, 3)}`);
            //renderer.drawText(this.parent.worldPosition, new Vector(0,43), `a: ${this.a.magnitude}`);
            renderer.drawText(this.parent.worldPosition, new Vector(0,29 + 3*14), `Fres: ${roundTo(this.f.magnitude, 3)}`);

            if (this.debugPoints.length > 1) {
                renderer.drawPointList(this.debugPoints);
            }
    
            if (this.debugPoints.length > 250) {
                this.debugPoints.shift();
            }

            if (this.heaviestBody) {
                var r = this.parent.worldPosition.distanceTo(this.heaviestBody.parent.worldPosition);
                renderer.drawText(this.parent.worldPosition, new Vector(0,29 + 4*14), `r: ${roundTo(r, 3)}`);
            }
        }
        
        
    }
}