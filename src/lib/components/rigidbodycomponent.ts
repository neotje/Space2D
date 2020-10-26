import { Component } from "../game/component";
import { Vector } from "../math/vector";

interface Constrains {
    x: boolean;
    y: boolean;
}

interface PhysicalProperties {
    mass: number;
    velocity?: Vector;
}

export class RigidBodyComponent extends Component {
    f: Vector = new Vector(0, 0);
    a: Vector = new Vector(0, 0);
    v: Vector = new Vector(0, 0);
    
    constrains: Constrains = {
        x: false,
        y: false
    }
    
    mass: number;

    constructor(name: string, props: PhysicalProperties, constrains?: Constrains) {
        super(name, "PhysicsComponent");

        this.mass = props.mass;
        this.velocity = (props.velocity) ? props.velocity : new Vector(0, 0);
        this.constrains = (constrains) ? constrains : this.constrains; 
    }
}