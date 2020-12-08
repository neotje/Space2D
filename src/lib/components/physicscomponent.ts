import { Component } from "../game/component"
import { Game } from "../game"
import { Physics } from "../physics"
import { Calc } from "../calc"
import { Polygon } from "../shapes/polygon"
import { DebugComponent } from "./debugcomponent"
import { Shape } from "../shape"

interface PhysicalProperties {
    mass: number
    velocity?: Calc.Vector
    collisionShape?: Polygon
}

interface Constrains {
    x: boolean
    y: boolean
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


    addTorque(t: number) {
        this.torque += t
    }

    addForceAtPos(f: Calc.Vector, p: Calc.Vector) {
        this.f.add(f)
        this.torque -= p.crossproduct(f)
    }


    collisionHandler() {
        // get all physics components
        var components: PhysicsComponent[] = Game.root.findComponent('.' + this.type)

        if (!this.collisionShape) {
            return
        }

        var box: Shape.BoundingBox = this.boundingBox

        for (const component of components) {
            if (component.id != this.id && component.collisionShape && Shape.boundingBoxOverlap(box, component.boundingBox)) {
                for (const p of this.collisionShape.rotatedPoints) {
                    var relative: Calc.Vector = this.parent.worldPosition.add(p).difference(component.parent.worldPosition)
                    
                    if (component.collisionShape.isPointInside(relative)) {
                        

                        var v = this.velocity.copy().subtract(component.velocity).scale(this.mass / component.mass)

                        var f = v.scale(component.mass).divide(Game.getDeltaTime())

                        //console.log(this.parent.id + " adding force", f);
                        component.addForceAtPos(f, relative)
                        
                        break
                    }
                }
            }
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
        if (debug) {
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

        this.collisionHandler()

    }

    loopEnd() {
        var dt = Game.getDeltaTime()
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent")

        var a: Calc.Vector = this.f.copy().divide(this.mass)

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

        if (debug) {
            debug.vector('v', this.velocity, '#ff0000')
            debug.vector('f', this.f, '#00ff00')

            debug.value('AngularVel', this.angularVelocity)
            debug.value('Fres', this.f.magnitude)
            debug.value('v', this.velocity.magnitude)
        }
    }

    draw() {
        //console.log(this.debugPoints)
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent")

        if (debug) {
            if (this.debugPoints.length > 1) {
                Game.renderer.drawPointList(this.debugPoints)
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