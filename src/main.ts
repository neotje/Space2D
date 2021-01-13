import { Game } from './lib/game';
import { GameObject } from './lib/game';
import { Calc } from './lib/calc';
import { CameraComponent } from './lib/components/cameracomponent';
import { PhysicsComponent } from './lib/components/physicscomponent';
import { BasicMovementComponent } from './lib/components/basicmovementcomponent';
import { Polygon } from "./lib/shapes/polygon";
import { DebugComponent } from './lib/components/debugcomponent';
import { ElectricFieldComponent } from './lib/components/electricfieldcomponent';
import { Physics } from './lib/physics';
import { Shape } from './lib/shape';
import { Vector } from '../docs/assets/js/main';
import { RigidBodyComponent } from './lib/components/rigidbodycomponent';


Game.root.addChild(
    new GameObject({ name: "player", position: new Calc.Vector(1, 0) }).addComponent(
        new CameraComponent(
            document.querySelector("#game"),
            'camera1',
            {
                width: Game.renderer.canvas.width,
                height: Game.renderer.canvas.height,
                position: new Calc.Vector(0, 0)
            }
        ),
        new BasicMovementComponent('controller', 80)
    ),
    // id: 2
    new GameObject({ name: 'box 1', position: new Calc.Vector(0, 0), rotation: 0 }).addComponent(
        new RigidBodyComponent('body', {}),
        new PhysicsComponent('physics', {
            mass: 1,
            velocity: new Calc.Vector(0, 0)
        }, undefined, false),
        new DebugComponent('debug')
    ),
    // id: 3
    new GameObject({ name: 'box 1', position: new Calc.Vector(-70, 0), rotation: Math.PI/4 }).addComponent(
        new RigidBodyComponent('body', {}),
        new PhysicsComponent('physics', {
            mass: 2,
            velocity: new Calc.Vector(10, 0)
        }, undefined, false),
        new DebugComponent('debug')
    ),
    /*new GameObject({ name: 'sun', position: new Calc.Vector(0, 0), rotation: 0 }).addComponent(
        new PhysicsComponent('physics', {
            mass: 1.989e15
        }),
        new DebugComponent('debug')
    ),
    new GameObject({ name: 'planet 1', position: new Calc.Vector(-200, 0), rotation: 0 }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 4,
            velocity: Physics.firstCosmicVelocityVector(1.989e15, new Calc.Vector(0, 0), new Calc.Vector(200, 0)),
            collisionShape: Shape.genRegularPolygon(20, 10)
        }),
        new DebugComponent('debug')
    ),
    new GameObject({ name: 'exoplanet 3', position: new Calc.Vector(0, -100), rotation: 0 }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 1,
            velocity: new Calc.Vector(15, 0),
            collisionShape: new Polygon([
                new Calc.Vector(20, 10),
                new Calc.Vector(10, -10),
                new Calc.Vector(-10, -10),
                new Calc.Vector(-10, 10)
            ])
        }),
        new DebugComponent('debug')
    )*/
)

console.log(Game.root);
console.log(Game.root.findComponent('.RigidBodyComponent'));


var v = Shape.genRegularPolygon(20, 10)

console.log(v.momentOfInertia(1));


Game.start();


var cam: CameraComponent = Game.root.findComponent('.CameraComponent')[0];
cam.zoomTo(3);
cam.showBorders = false;


var poly1 = new Polygon([
    new Calc.Vector(10, 10),
    new Calc.Vector(10, -10),
    new Calc.Vector(-10, -10),
    new Calc.Vector(-10, 10)
])

var poly2 = new Polygon([
    new Calc.Vector(10, 10),
    new Calc.Vector(10, -10),
    new Calc.Vector(-10, -10),
    new Calc.Vector(-10, 10)
])

poly2.angle = Math.PI / 4

console.log(poly1.seperatingAxis(poly2, new Calc.Vector(15, 0)))
console.log(new Calc.Vector(1,1).unit.scale(0.1).magnitude);



