import { root, parentOf, start, renderer } from './lib/game';
import { GameObject } from './lib/gameobject';
import { Vector } from './lib/vector';
import { CameraComponent } from './lib/components/cameracomponent';
import { PhysicsComponent } from './lib/components/physicscomponent';
import { escapeVelocityVector } from './lib/physics/formulas';
import { BasicMovementComponent } from './lib/components/basicmovementcomponent';


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
    new GameObject({ name: 'sun', position: new Vector(0, 0), rotation: 0 }).addComponent(
        new PhysicsComponent('physics', {
            mass: 1.989e15,
            debug: true
        })
    ),
    new GameObject({ name: 'planet 1', position: new Vector(100, 0), rotation: 0 }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 0.33e12,
            velocity: escapeVelocityVector(1.989e15, new Vector(0, 0), new Vector(100, 0)).add(new Vector(0, 0)),
            debug: true
        })
    ),
    new GameObject({ name: 'planet 2', position: new Vector(-200, 0), rotation: 0 }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 5.972e12,
            velocity: escapeVelocityVector(1.989e15, new Vector(0, 0), new Vector(200, 0)).add(new Vector(0, 0)),
            debug: true
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


var testV = new Vector(1, 0);

console.log(testV.angle, testV);
testV.rotate(0)
console.log(testV.angle, testV);



console.log();


