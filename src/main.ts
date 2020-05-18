import { root, parentOf, start } from './lib/game';
import { GameObject } from './lib/gameobject';
import { Vector } from './lib/vector';
import { CameraComponent } from './lib/components/cameracomponent';
import { MeshComponent } from './lib/components/meshcomponent';

root.addChild(
    new GameObject('player', new Vector(0, 0)).addComponent(
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
    new GameObject('test', new Vector(5, 5)).addComponent(
        new MeshComponent()
    )
)

console.log(root);

start();

var cam: CameraComponent = root.findComponent('.CameraComponent')[0];
cam.zoomTo(50, () => {
    cam.zoomTo(25)
})
cam.showBorders = true;

console.log();


