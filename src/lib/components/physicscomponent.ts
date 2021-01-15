import { Component } from "../game/component"
import { Game } from "../game"
import { Physics } from "../physics"
import { Calc } from "../calc"
import { Polygon } from "../shapes/polygon"
import { DebugComponent } from "./debugcomponent"
import { Shape } from "../shape"
import { GameObject } from "../game/gameobject"

interface PhysicalProperties {
    mass: number
    velocity?: Calc.Vector
    collisionShape?: Polygon
}

interface Constrains {
    x: boolean
    y: boolean
}

interface CollisionInfo {
    object: GameObject;
    penetration: number;
    normal: Calc.Vector;
}

/**
 * @category Component
 */
export class PhysicsComponent extends Component {

    mass: number // mass in kg
    velocity: Calc.Vector = new Calc.Vector(0, 0) // velocity in m/s
    angularVelocity: number = 0 // angular velocity in radians/s
    
    f: Calc.Vector = new Calc.Vector(0, 0) // force in newton
    torque: number = 0
    restitution: number = 1

    enableGravity: boolean = true
    // freeze movement in x or y axis
    constrains: Constrains = {
        x: false,
        y: false
    }

    // collision shape
    collisionShape: Polygon

    private debugPoints: Calc.Vector[] = []
    private t: number = 0
    private heaviestBody: PhysicsComponent
    private impulseToApply: Calc.Vector = new Calc.Vector(0, 0)

    constructor(name: string, props: PhysicalProperties, constrains?: Constrains, enableGravity?: boolean) {
        super(name, "PhysicsComponent")

        this.mass = props.mass
        this.velocity = (props.velocity) ? props.velocity : new Calc.Vector(0, 0)
        this.collisionShape = (props.collisionShape) ? props.collisionShape : new Polygon([
            new Calc.Vector(10, 10),
            new Calc.Vector(10, -10),
            new Calc.Vector(-10, -10),
            new Calc.Vector(-10, 10)
        ])

        this.enableGravity = (enableGravity === false) ? enableGravity : this.enableGravity

        this.constrains = (constrains) ? constrains : this.constrains
    }


    get boundingBox(): Shape.BoundingBox {
        var box: Shape.BoundingBox = this.collisionShape.boundingBox
        box.max.add(this.parent.worldPosition)
        box.min.add(this.parent.worldPosition)

        return box
    }

    get impulse(): Calc.Vector {
        return this.velocity.copy().scale(this.mass)
    }

    /**
     * add torque
     * @param t 
     */
    addTorque(t: number) {
        this.torque += t
    }

    /**
     * add force at specific position.
     * @param f Force Vector.
     * @param p Position to apply force on.
     */
    addForceAtPos(f: Calc.Vector, p: Calc.Vector) {
        this.f.add(f)
        this.torque -= p.crossproduct(f)
    }

    /**
     * apply impulse
     * @param p Impulse Vector kg/(m/s)
     */
    addImpulse(p: Calc.Vector) {
        this.impulseToApply.add(p)
    }

    onCollision(info: CollisionInfo) {
        var pComponent: PhysicsComponent = info.object.getComponentByType(this.type)        

        if (pComponent && info.penetration) {
            // account for collision depth
            //this.parent.worldPosition = this.parent.worldPosition.subtract(info.normal.scale(info.penetration / 1.5))

            // calculate new speeds
            this.velocity = this.impulse.add(pComponent.impulse).divide(this.mass + pComponent.mass)
        }
    }

    loopStart() {
        this.f = new Calc.Vector(0, 0)
        this.torque = 0
    }

    update() {
        var dt = Game.getDeltaTime()
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent")

        // save some debug data
        if (debug && debug.enable) {
            this.t += dt

            if (this.t > 0.01) {
                this.debugPoints.push(this.parent.worldPosition)
                this.t = 0
            }
        }

        // get all physics components
        var components: PhysicsComponent[] = Game.root.findComponent('.' + this.type)

        for (const component of components) {
            if (component.id != this.id) {
                if (this.enableGravity && component.enableGravity) {
                    // calculate gravity force between components
                    var Fg = Physics.gravityForce(this.mass, component.mass, Math.abs(this.parent.worldPosition.distanceTo(component.parent.worldPosition)))

                    // just for debugging purposes
                    if (!this.heaviestBody || component.mass > this.heaviestBody.mass) {
                        this.heaviestBody = component
                    }

                    // angle of the gravity force
                    var angle = this.parent.worldPosition.difference(component.parent.worldPosition).angle

                    var FgV = new Calc.Vector(Fg, 0)
                    FgV.angle = angle

                    // apply force
                    if (Fg != NaN && Fg != Infinity) {
                        this.f.add(FgV)
                    }   
                }
            }
        }

        //this.collisionHandler()
    }

    loopEnd() {
        var dt = Game.getDeltaTime()
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent")

        var a: Calc.Vector = this.f.copy().divide(this.mass)

        this.velocity.add(this.impulseToApply.copy().divide(this.mass))
        this.impulseToApply = new Calc.Vector(0, 0)

        this.velocity.add(a.copy().scale(dt))

        if (this.constrains.x) {
            this.velocity.x = 0
        }
        if (this.constrains.y) {
            this.velocity.y = 0
        }

        this.parent.worldPosition = this.parent.worldPosition.add(this.velocity.copy().scale(dt))
        
        this.angularVelocity += this.torque * (1 / this.collisionShape.momentOfInertia(this.mass)) * dt
        
        this.parent.rotation += this.angularVelocity * dt
        this.collisionShape.angle = this.parent.rotation

        if (debug && debug.enable) {
            debug.vector('v', this.velocity, '#ff0000')
            debug.vector('f', this.f, '#00ff00')
            debug.vector('p', this.impulse, '#ffff00')

            debug.value('mass', this.mass)
            debug.value('AngularVel', this.angularVelocity)
            debug.value('Fres', this.f.magnitude)
            debug.value('v', this.velocity.magnitude)
        }
    }

    draw() {
        //console.log(this.debugPoints)
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent")

        if (debug && debug.enable) {
            if (this.debugPoints.length > 1) {
                //Game.renderer.drawPointList(this.debugPoints)
            }

            if (this.debugPoints.length > 250) {
                this.debugPoints.shift()
            }

            if (this.heaviestBody) {
                var r = this.parent.worldPosition.distanceTo(this.heaviestBody.parent.worldPosition)
                debug.value('r', r)
            }

            if (this.collisionShape) {
                this.collisionShape.draw(this.parent.worldPosition, this.parent.rotation)
            }
        }
    }


}