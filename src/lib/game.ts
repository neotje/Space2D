export { Renderer } from "./game/renderer";
export { GameObject } from "./game/gameobject";

import { Calc } from "./calc";
import { Renderer } from "./game";
import { GameObject } from "./game";

/**
 * @category Game
 */
export namespace Game {
    export var root = new GameObject({ name: "root", position: new Calc.Vector(0, 0), color: "#ff0000" });
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
    var updateCount: number = 0;

    export interface Statistics {
        fps: number;
        deltaTime: number;
        speed: number;
        updateCount: number;
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

    /**
     * get deltatime of game update loop.
     */
    export function getDeltaTime(): number {
        return deltaTime * speed;
    }

    export function getStatistics(): Statistics {
        return {
            fps,
            deltaTime,
            speed,
            updateCount
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

            root.foreachGameObject((object: GameObject) => {
                object.loopEnd();
            });
        }

        updateCount++

        if (!stop) {
            setTimeout(update, 0 /* 1000/60 */);
        }
        return;
    }
}