import { Component } from "../game/component";
import { Vector } from "../math/vector";
import { Game } from "../game";
import { gravityForce } from "../physics";
import { roundTo } from "../math";
import { Circle, Polygon } from "../shapes";
import { DebugComponent } from "./debugcomponent";

interface PhysicalProperties {
    mass: number;
    velocity?: Vector;
    collisionShape?: Circle | Polygon;
}

interface Constrains {
    x: boolean;
    y: boolean;
}

/**
 * @category Component
 */
export class PhysicsComponent extends Component {

    mass: number; // mass in kg
    velocity: Vector = new Vector(0, 0); // velocity in m/s
    angularVelocity: number = 1; // angular velocity in radians/s
    a: Vector = new Vector(0, 0); // acceleration in m/s^2
    f: Vector = new Vector(0, 0); // force in newton

    enableGravity: boolean = true;
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

    constructor(name: string, props: PhysicalProperties, constrains?: Constrains, enableGravity = true) {
        super(name, "PhysicsComponent");

        this.mass = props.mass;
        this.velocity = (props.velocity) ? props.velocity : new Vector(0, 0);
        this.collisionShape = (props.collisionShape) ? props.collisionShape : new Circle(10);

        this.enableGravity = enableGravity

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
        var dt = Game.getDeltaTime();

        // save some debug data
        if (this.parent.debug) {
            this.t += dt;

            if (this.t > 0.01) {
                this.debugPoints.push(this.parent.worldPosition);
                this.t = 0;
            }
        }

        // get all physics components
        var components: PhysicsComponent[] = Game.root.findComponent('.' + this.type);

        for (const component of components) {
            if (component.id != this.id) {
                if (this.enableGravity) {
                    // calculate gravity force between components
                    var Fg = gravityForce(this.mass, component.mass, Math.abs(this.parent.worldPosition.distanceTo(component.parent.worldPosition)));

                    // just for debugging purposes
                    if (!this.heaviestBody || component.mass > this.heaviestBody.mass) {
                        this.heaviestBody = component;
                    }

                    // angle of the gravity force
                    var angle = this.parent.worldPosition.lookAt(component.parent.worldPosition).angle;

                    var FgV = new Vector(Fg, 0);
                    FgV.angle = angle;

                    // apply force
                    if (Fg != NaN && Fg != Infinity) {
                        this.f.add(FgV)
                    }
                }
            }
        }
    }

    loopEnd() {
        var dt = Game.getDeltaTime();

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
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent");

        if (debug) {
            debug.vector('v', this.velocity, '#ff0000')
            debug.vector('a', this.a, '#00ff00')

            debug.value('v', this.velocity.magnitude);
            debug.value('a', this.a.magnitude);
            debug.value('Fres', this.f.magnitude);
            debug.value('mass', this.mass);

            if (this.debugPoints.length > 1) {
                Game.renderer.drawPointList(this.debugPoints);
            }

            if (this.debugPoints.length > 250) {
                this.debugPoints.shift();
            }

            if (this.heaviestBody) {
                var r = this.parent.worldPosition.distanceTo(this.heaviestBody.parent.worldPosition);
                debug.value('r', r);
            }

            if (this.collisionShape) {
                this.collisionShape.draw(this.parent.worldPosition, this.parent.rotation);
            }
        }
    }


}