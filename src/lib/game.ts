import { GameObject } from "./gameobject";
import { Vector } from "./vector";
import { Renderer } from "./renderer";

export var root = new GameObject('root', new Vector(0, 0));
export var renderer = new Renderer(document.querySelector('#game'), {drawTransforms: true});

export var pause: boolean = false;
export var stop: boolean = false;

var deltaTime: number;
var fps: number;

export function parentOf(obj: GameObject): GameObject {

    function loop(o: GameObject): GameObject {        
        if (o.children.length > 0) {

            for (const child of o.children) {                
                if (child.id == obj.id) {
                    return o;
                } else {
                    var r = loop(child);
                    if (r) {
                        return r;
                    }
                }
            }
        }
        return undefined
    }

    return loop(root);
}

export function start() {
    window.requestAnimationFrame(update);
}

export function getDeltaTime(): number {
    return deltaTime;
}

var startTime: number = performance.now();

function update() {
    var endTime: number = performance.now();
    deltaTime = (endTime - startTime) / 1000;
    fps = 1 / deltaTime;
    startTime = performance.now();    

    renderer.clear();

    if (!pause) {
        root.foreachGameObject((object: GameObject) => {
            object.update();
        });

        renderer.update();

        root.foreachGameObject((object: GameObject) => {
            object.drawUpdate();
        });
    }

    if (!stop) {
        window.requestAnimationFrame(update);
    }
    return;
}