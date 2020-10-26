import { Game } from "../game";
import { Component } from "../game/component";
import { Vector } from "../math/vector";
import { electricalForce } from "../physics/electricalfield";
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
                var Fel = electricalForce(this.q, component.q, Math.abs(this.parent.worldPosition.distanceTo(component.parent.worldPosition)))
                var angle = this.parent.worldPosition.lookAt(component.parent.worldPosition).angle
                var FelV = new Vector(Fel, 0)
                FelV.angle = angle

                if (debug) {
                    debug.vector("Fel", FelV, "#ff00ff")
                    debug.value("Fel", Fel)
                }

                this.physics.f.add(FelV)
            }
        }
    }
}