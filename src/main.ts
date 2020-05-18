import { root, parentOf, start } from './lib/game';
import { GameObject } from './lib/gameobject';
import { Vector } from './lib/vector';
import { CameraComponent } from './lib/components/cameracomponent';

var obj = new GameObject('test3', new Vector(3, 3));

root
    .addChild(new GameObject('player', new Vector(2, 2))
        .addComponent(new CameraComponent(
            document.querySelector<HTMLCanvasElement>("#game"),
            'camera1',
            { width: 800, height: 400, position: new Vector(0, 0) }
        ))
    )
    .addChild(new GameObject('test1', new Vector(1, 1))
        .addChild(new GameObject('test3', new Vector(3, 3)))
        .addChild(new GameObject('test3', new Vector(3, 3))
            .addChild(obj)
        )
    )
    .addChild(new GameObject('test2', new Vector(2, 2))
        .addChild(new GameObject('test3', new Vector(3, 3)))
    );

console.log(root);

start();


