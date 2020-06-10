export { GameObject } from "./game/gameobject";
export { Renderer } from "./game/renderer";

import { GameObject } from "./game";
import { Vector } from "./math";
import { Renderer } from "./game";

export var root = new GameObject({name: "root", position: new Vector(0, 0), color: "#ff0000"});
export var renderer = new Renderer(document.querySelector('#game'), {
    imageSmoothing: true, 
    drawStats: true,
    smoothingQuality: "high",
    vsync: true
});

export var pause: boolean = false;
export var stop: boolean = false;

var startTime: number;
var endTime: number;
var deltaTime: number;
var fps: number;
var speed: number = 1;

interface Statistics {
    fps: number;
    deltaTime: number;
    speed: number;
}

export function setSpeed(s: number) {
    speed = s;
}

export function getSpeed(): number {
    return speed;
}

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
    startTime = performance.now();

    update();
    renderer.update();
}

export function getDeltaTime(): number {
    return deltaTime * speed;
}

export function getStatistics(): Statistics {
    return {
        fps: fps,
        deltaTime: deltaTime,
        speed: speed
    }
}

function update() {
    endTime = performance.now();
    deltaTime = (endTime - startTime) / 1000;
    fps = 1 / deltaTime;
    startTime = performance.now();    

    if (!pause) {
        root.foreachGameObject((object: GameObject) => {
            object.loopStart();
        });

        root.foreachGameObject((object: GameObject) => {
            object.update();
        });
    }

    if (!stop) {
        setTimeout(update, 1);
    }
    return;
}