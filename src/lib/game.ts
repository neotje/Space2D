import { GameObject } from "./gameobject";
import { Vector } from "./vector";
import { Renderer } from "./renderer";

export var root = new GameObject({name: "root", position: new Vector(0, 0), color: "#ff0000"});
export var renderer = new Renderer(document.querySelector('#game'), {
    imageSmoothing: true, 
    drawTransforms: true,
    drawStats: true,
    smoothingQuality: "high"
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
    window.requestAnimationFrame(update);

    //setInterval(update, 0)
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