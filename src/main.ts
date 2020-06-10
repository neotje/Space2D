import { root, parentOf, start, renderer } from './lib/game';
import { GameObject } from './lib/game';
import { Vector } from './lib/math';
import { CameraComponent } from './lib/components/cameracomponent';
import { PhysicsComponent } from './lib/components/physicscomponent';
import { escapeVelocityVector } from './lib/physics';
import { BasicMovementComponent } from './lib/components/basicmovementcomponent';
import { LinearFunction as Line } from "./lib/math";
import { Polygon } from "./lib/shapes";


root.addChild(
    new GameObject({ name: "player", position: new Vector(1, 0) }).addComponent(
        new CameraComponent(
            document.querySelector("#game"),
            'camera1',
            {
                width: renderer.canvas.width,
                height: renderer.canvas.height,
                position: new Vector(0, 0)
            }
        ),
        new BasicMovementComponent('controller', 80)
    ),
    new GameObject({ name: 'sun', position: new Vector(0, 0), rotation: 0, debug: true }).addComponent(
        new PhysicsComponent('physics', {
            mass: 1.989e15
        }, {
            x: true,
            y: true
        })
    ),
    new GameObject({ name: 'planet 1', position: new Vector(100, 0), rotation: 0, debug: true }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 0.33e12,
            velocity: escapeVelocityVector(1.989e15, new Vector(0, 0), new Vector(100, 0)).add(new Vector(0, 0))
        })
    ),
    new GameObject({ name: 'planet 2', position: new Vector(-200, 0), rotation: 0, debug: true }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 5.972e12,
            velocity: escapeVelocityVector(1.989e15, new Vector(0, 0), new Vector(200, 0)).add(new Vector(0, 0))
        })
    ),
    new GameObject({ name: 'exoplanet 3', position: new Vector(0, -250), rotation: 0, debug: true }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 5.972e12,
            velocity: new Vector(10, 50)
        })
    )
)

console.log(root);

start();


var cam: CameraComponent = root.findComponent('.CameraComponent')[0];
cam.zoomTo(1, () => {
    cam.zoomTo(1);
});
cam.showBorders = false;

//var f = new Line(3, 2);
//var g = new Line(-3, -4);
//var h = new Line(1, 3);
var j = new Line(1).setBfromPoint(new Vector(-2, 1));
var poly = new Polygon([
    new Vector(2, 1),
    new Vector(1, 1),
    new Vector(-1,2),
    new Vector(-1, -1),
    new Vector(1, -2)
]);

console.log(j, poly.isPointInside(new Vector(0, 1)));
