import { Calc } from "../calc";
import { Game } from "../game";
import { Component } from "../game/component";
import { Physics } from "../physics";
import { DebugComponent } from "./debugcomponent";
import { PhysicsComponent } from "./physicscomponent";

/**
 * @category Component
 */
export class ElectricFieldComponent extends Component {

    physics: PhysicsComponent

    q: number // charge in coulomb (C)

    constructor(name: string, q: number) {
        super(name, "ElectricFieldComponent")

        this.q = q
    }

    update() {
        var debug: DebugComponent = this.parent.getComponentByType("DebugComponent");

        if (!this.physics) {
            this.physics = this.parent.getComponentByType("PhysicsComponent")
        }

        // get all electricalfield components
        var components: ElectricFieldComponent[] = Game.root.findComponent('.' + this.type)

        for (const component of components) {
            if (component.id != this.id) {
                var Fel = Physics.electricalForce(this.q, component.q, Math.abs(this.parent.worldPosition.distanceTo(component.parent.worldPosition)))
                var angle = component.parent.worldPosition.difference(this.parent.worldPosition).angle
                var FelV = new Calc.Vector(Fel, 0)
                FelV.angle = angle

                if (Fel != NaN && Fel != Infinity && component.physics) {
                    if ( (this.q > 0 && component.q > 0) || (this.q < 0 && component.q < 0) ) {
                        component.physics.f.subtract(FelV)
                    } else {
                        component.physics.f.add(FelV)
                    }
                }

                if (debug) {
                    debug.vector(component.id + " Fel", this.physics.f, "#ff00ff")
                    debug.value("Fel", Fel)
                    debug.value("q", this.q)
                }
            }
        }
    }
}