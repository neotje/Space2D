import { root, parentOf, start } from './lib/game';
import { GameObject } from './lib/gameobject';
import { Vector } from './lib/vector';
import { CameraComponent } from './lib/components/cameracomponent';
import { MeshComponent } from './lib/components/meshcomponent';

root.addChild(
    new GameObject({name: "player", position: new Vector(-5,-5)}).addComponent(
        new CameraComponent(
            document.querySelector("#game"),
            'camera1',
            {
                width: 800,
                height: 400,
                position: new Vector(0, 0)
            }
        )
    ),
    new GameObject({name: 'test', position: new Vector(5, 5), rotation: 0}).addComponent(
        new MeshComponent()
    )
)

console.log(root);

start();

var obj: GameObject[] = root.find('test');
console.log(obj);


var cam: CameraComponent = root.findComponent('.CameraComponent')[0];
cam.zoomTo(10, () => {
    cam.zoomTo(25);
    obj[0].rotateTo(Math.PI, 2000, ()=>{
        console.log(obj[0]);
        
    });
});
cam.showBorders = false;


var testV = new Vector(1, 0);

console.log(testV.angle, testV);
testV.rotate(0)
console.log(testV.angle, testV);



console.log();


