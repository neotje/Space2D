import { Component } from "../game/component"
import { Game } from "../game"
import { Polygon } from "../shapes/polygon"
import { Shape } from "../shape";
import { DebugComponent } from "./debugcomponent";
import { PhysicsComponent } from "./physicscomponent";
import { Calc } from "../calc";
import { GameObject } from "../game/gameobject";

interface RigidBodyProps {
    shape?: Polygon
}

export class RigidBodyComponent extends Component {
    shape: Polygon;

    constructor(name: string, props: RigidBodyProps) {
        super(name, "RigidBodyComponent")

        this.shape = (props.shape) ? props.shape : new Polygon([
            new Calc.Vector(10, 10),
            new Calc.Vector(10, -10),
            new Calc.Vector(-10, -10),
            new Calc.Vector(-10, 10)
        ])
    }

    get boundingBox(): Shape.BoundingBox {
        var box: Shape.BoundingBox = this.shape.boundingBox

        // translate bouding box to worldposition of this object
        box.max.add(this.parent.worldPosition)
        box.min.add(this.parent.worldPosition)

        return box
    }

    update(): void {
        // debug stuff
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent")
        if (debug) {
        }

        this.shape.angle = this.parent.rotation


        // get all physics components
        var components: RigidBodyComponent[] = Game.root.findComponent('.' + this.type)

        // boundingbox check
        var boundingBox: Shape.BoundingBox = this.boundingBox

        for (const component of components) {
            // check if boundingboxes overlap
            if (this.id != component.id && Shape.boundingBoxOverlap(boundingBox, component.boundingBox)) {
                // get relative of component
                var cRelativePos: Calc.Vector = this.parent.worldPosition.difference(component.parent.worldPosition)
                // get SAT results
                var SAT = this.shape.seperatingAxis(component.shape, cRelativePos)

                console.debug(this.id, SAT.penetration);
                

                if(SAT.penetration) {
                    console.debug(Game.getStatistics().updateCount, SAT)

                    for (const c of this.parent.components) {
                        c.onCollision({
                            penetration: SAT.penetration,
                            normal: SAT.normal,
                            object: component.parent
                        })
                    }
                }
            }
        }
    }

    draw(): void {
        // debug stuff
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent")
        if (debug) {
            Game.renderer.drawRect({
                start: this.boundingBox.min,
                end: this.boundingBox.max,
                stroke: {
                    color: "rgb(255, 0, 0)"
                }
            })

            this.shape.draw(this.parent.worldPosition, this.parent.rotation)
        }
    }
}