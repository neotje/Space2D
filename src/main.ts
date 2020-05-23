import { root, parentOf, start, renderer } from './lib/game';
import { GameObject } from './lib/gameobject';
import { Vector } from './lib/vector';
import { CameraComponent } from './lib/components/cameracomponent';
import { PhysicsComponent } from './lib/components/physicscomponent';


root.addChild(
    new GameObject({ name: "player", position: new Vector(0, 0) }).addComponent(
        new CameraComponent(
            document.querySelector("#game"),
            'camera1',
            {
                width: renderer.canvas.width,
                height: renderer.canvas.height,
                position: new Vector(0, 0)
            }
        )
    ),
    new GameObject({ name: 'sun', position: new Vector(8, 8), rotation: 0 }).addComponent(
        new PhysicsComponent('physics', {
            mass: 100000000000,
            debug: true
        })
    ),
    new GameObject({ name: 'planet 1', position: new Vector(5, 5), rotation: 0 }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 100,
            velocity: new Vector(0.25, -0.25),
            debug: true
        })
    ),
    new GameObject({ name: 'planet 2', position: new Vector(4, 4), rotation: 0 }).addComponent(
        new PhysicsComponent('obj2', {
            mass: 100,
            velocity: new Vector(-0.5, 0.5),
            debug: true
        })
    )
)

console.log(root);

start();


var cam: CameraComponent = root.findComponent('.CameraComponent')[0];
cam.zoomTo(10, () => {
    cam.zoomTo(17);
});
cam.showBorders = false;


var testV = new Vector(1, 0);

console.log(testV.angle, testV);
testV.rotate(0)
console.log(testV.angle, testV);



console.log();


