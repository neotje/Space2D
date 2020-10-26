import { Component } from "../game/component";
import { Vector } from "../math/vector";
import { getDeltaTime, root, renderer } from "../game";
import { gravityForce } from "../physics";
import { roundTo } from "../math";
import { Circle, Polygon } from "../shapes";

interface PhysicalProperties {
    mass: number;
    velocity?: Vector;
    collisionShape?: Circle | Polygon;
}

interface Constrains {
    x: boolean;
    y: boolean;
}

export class PhysicsComponent extends Component {

    mass: number; // mass in kg
    velocity: Vector; // velocity in m/s
    angularVelocity: number = 1; // angular velocity in radians/s
    a: Vector; // acceleration in m/s^2
    f: Vector = new Vector(0, 0); // force in newton
    
    // freeze movement in x or y axis
    constrains: Constrains = {
        x: false,
        y: false
    }

    // collision shape
    collisionShape: Circle | Polygon = new Circle(10);

    private debugPoints: Vector[] = [];
    private t: number = 0;
    private heaviestBody: PhysicsComponent;

    constructor(name: string, props: PhysicalProperties, constrains?: Constrains) {
        super(name, "PhysicsComponent");

        this.mass = props.mass;
        this.velocity = (props.velocity) ? props.velocity : new Vector(0, 0);
        this.collisionShape = (props.collisionShape) ? props.collisionShape : new Circle(10);

        this.constrains = (constrains) ? constrains : this.constrains;
    }

    applyImpulseForce(f: Vector, pos: Vector): void {
        
    }

    collisionHandler() {
        
    }

    loopStart() {
        this.f = new Vector(0, 0);
    }

    update() {
        var dt = getDeltaTime();
        
        // save some debug data
        if (this.parent.debug) {
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
                // calculate gravity force
                var Fg = gravityForce(this.mass, component.mass, Math.abs(this.parent.worldPosition.distanceTo(component.parent.worldPosition)));

                // just for debugging purposes
                if (!this.heaviestBody) {
                    this.heaviestBody = component;
                }
                if (component.mass > this.heaviestBody.mass) {
                    this.heaviestBody = component;
                }

                // angle of the gravity force
                var angle = this.parent.worldPosition.lookAt(component.parent.worldPosition).angle;

                var FgV = new Vector(Fg, 0);
                FgV.angle = angle;
                
                // apply force
                this.f.add(FgV)

                //ddconsole.log(this.parent.id, Fg);

                // collision detection
                if (this.collisionShape && component.collisionShape) {
                    
                }
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
        this.parent.rotation += this.angularVelocity * dt;        
    }

    draw() {
        //console.log(this.debugPoints);

        if (this.parent.debug) {
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

            renderer.drawText(this.parent.worldPosition, new Vector(0,45), `v: ${roundTo(this.velocity.magnitude, 3)}`);
            renderer.drawText(this.parent.worldPosition, new Vector(0,45 + 1*14), `m: ${roundTo(this.mass, 3)}`);
            renderer.drawText(this.parent.worldPosition, new Vector(0,45 + 2*14), `a: ${roundTo(this.a.magnitude, 3)}`);
            //renderer.drawText(this.parent.worldPosition, new Vector(0,43), `a: ${this.a.magnitude}`);
            renderer.drawText(this.parent.worldPosition, new Vector(0,45 + 4*14), `Fres: ${roundTo(this.f.magnitude, 3)}`);

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

            if (this.collisionShape) {
                this.collisionShape.draw(this.parent.worldPosition, this.parent.rotation);
            }
        }
    }


}