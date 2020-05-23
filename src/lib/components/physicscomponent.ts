import { Component } from "../component";
import { Vector } from "../vector";
import { getDeltaTime, root, renderer } from "../game";

interface PhysicalProperties {
    mass: number;
    velocity?: Vector;
    debug?: boolean;
}

export class PhysicsComponent extends Component {

    mass: number;
    velocity: Vector;
    debug: boolean;

    private G: number = 6.67384e-11;
    private debugPoints: Vector[] = [];
    private t: number = 0;

    constructor(name: string, props: PhysicalProperties) {
        super(name, "PhysicsComponent");

        this.mass = props.mass;
        this.velocity = (props.velocity) ? props.velocity : new Vector(0, 0);
        this.debug = (props.debug) ? props.debug : false;        
    }

    update() {
        var dt = getDeltaTime();   
        
        if (this.debug) {
            this.t += dt;

            if (this.t > 1) {                                
                this.debugPoints.push(this.parent.worldPosition);
                this.t = 0;
            }
        }

        var components: PhysicsComponent[] = root.findComponent('.' + this.type);
        
        for (const component of components) {
            if (component.id != this.id) {
                var Fg = this.G * (
                    (this.mass * component.mass) / 
                    Math.pow(Math.abs(this.parent.worldPosition.distanceTo(component.parent.worldPosition)), 2)
                );

                var angle = this.parent.worldPosition.lookAt(component.parent.worldPosition).angle;

                var ag = new Vector(Fg / this.mass, 0);
                ag.angle = angle;
                ag.scale(dt);

                this.velocity.add(ag);                
            }
        }


        //this.parent.position.add(this.velocity.copy().scale(dt));

        this.parent.worldPosition = this.parent.worldPosition.add(this.velocity.copy().scale(dt));
    }

    draw() {
        //console.log(this.debugPoints);
        
        if (this.debugPoints.length > 1) {
            renderer.drawPointList(this.debugPoints);
        }

        if (this.debugPoints.length > 50) {
            this.debugPoints.shift();
        }
    }
}