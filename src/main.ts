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
    new GameObject({ name: 'box 1', position: new Calc.Vector(0, 0), rotation: 0 }).addComponent(
        new PhysicsComponent('physics', {
            mass: 2
        }, undefined, false),
        new DebugComponent('debug')
    ),
    new GameObject({ name: 'box 1', position: new Calc.Vector(-70, 10), rotation: 0 }).addComponent(
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


var v = Shape.genRegularPolygon(20, 10)

console.log(v.momentOfInertia(1));


Game.start();


var cam: CameraComponent = Game.root.findComponent('.CameraComponent')[0];
cam.zoomTo(3);
cam.showBorders = false;

//var f = new Line(3, 2);
//var g = new Line(-3, -4);
//var h = new Line(1, 3);

console.log(Calc.twoLineSectionIntersect(
    new Calc.Vector(0, 0),
    new Calc.Vector(-1, -1),
    new Calc.Vector(1, -1),
    new Calc.Vector(-1, 1)
));

var p1 = new Polygon([
    new Calc.Vector(10, 10),
    new Calc.Vector(10, -10),
    new Calc.Vector(-10, -10),
    new Calc.Vector(-10, 10)
])

p1.angle = 1

var p2 = new Polygon([
    new Calc.Vector(10, 10),
    new Calc.Vector(10, -10),
    new Calc.Vector(-10, -10),
    new Calc.Vector(-10, 10)
])

p2.angle = 2

console.log(p1.getInterectsWithPolygon(p2, new Calc.Vector(30, 30)));

