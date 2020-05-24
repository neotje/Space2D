import { Component } from "../component";
import { Vector } from "../vector";
import { getDeltaTime, root, renderer } from "../game";
import { Constants } from "../physics/constants";
import { roundTo } from "../physics/formulas";
import { GameObject } from "../gameobject";

interface PhysicalProperties {
    mass: number;
    velocity?: Vector;
    debug?: boolean;
}

export class PhysicsComponent extends Component {

    mass: number;
    velocity: Vector;
    a: Vector;
    f: Vector;
    debug: boolean;

    private debugPoints: Vector[] = [];
    private t: number = 0;
    private heaviestBody: PhysicsComponent;

    constructor(name: string, props: PhysicalProperties) {
        super(name, "PhysicsComponent");

        this.mass = props.mass;
        this.velocity = (props.velocity) ? props.velocity : new Vector(0, 0);
        this.debug = (props.debug) ? props.debug : false;        
    }

    update() {
        var dt = getDeltaTime();
        this.f = new Vector(0, 0);
        
        if (this.debug) {
            this.t += dt;

            if (this.t > 0.5) {                                
                this.debugPoints.push(this.parent.worldPosition);
                this.t = 0;
            }
        }

        var components: PhysicsComponent[] = root.findComponent('.' + this.type);
        
        for (const component of components) {
            if (component.id != this.id) {
                var Fg = Constants.G * (
                    (this.mass * component.mass) / 
                    Math.pow(Math.abs(this.parent.worldPosition.distanceTo(component.parent.worldPosition)), 2)
                );

                if (!this.heaviestBody) {
                    this.heaviestBody = component;
                }

                if (component.mass > this.heaviestBody.mass) {
                    this.heaviestBody = component;
                }

                var angle = this.parent.worldPosition.lookAt(component.parent.worldPosition).angle;

                this.f.add(new Vector(2*Fg, 0).rotateBy(angle))

                //ddconsole.log(this.parent.id, Fg);          
            }
        }
        //this.parent.position.add(this.velocity.copy().scale(dt));

        this.a = this.f.divide(this.mass);

        this.velocity.add(this.a.copy().scale(dt));

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
    
            if (this.debugPoints.length > 30) {
                this.debugPoints.shift();
            }

            if (this.heaviestBody) {
                var r = this.parent.worldPosition.distanceTo(this.heaviestBody.parent.worldPosition);
                renderer.drawText(this.parent.worldPosition, new Vector(0,29 + 4*14), `r: ${roundTo(r, 3)}`);
            }
        }
        
        
    }
}