import { CameraComponent } from "../components/cameracomponent";
import { Game } from "../game";
import { Vector } from "../math/vector";
import { GameObject } from "./gameobject";

interface RendererOptions {
    imageSmoothing?: boolean;
    smoothingQuality?: "low" | "medium" | "high";
    drawStats?: boolean;
    vsync?: boolean;
}

interface line {
    start: Vector;
    end: Vector;
    color?: string;
    width?: number;
}

interface rectangle {
    start: Vector;
    end?: Vector;
    width?: number;
    height?: number;
    fill?: fill;
    stroke?: stroke;
}

interface circle {
    pos: Vector;
    radius: number;
    fill?: fill;
    stroke?: stroke;
}

interface ellipse {
    pos: Vector;
    radius: Vector;
    fill?: fill;
    stroke?: stroke;
}

interface point {
    pos: Vector;
}

interface polygon {
    pos: Vector;
    points: Vector[];
    angle?: number;
    fill?: fill;
    stroke?: stroke;
}

interface fill {
    color?: string;
}

interface stroke {
    color?: string;
    width?: number;
}

/**
for (const camera of this.cameras) {
            
}
*/

var startTime = 0;

/**
 * @category Game
 */
export class Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: RendererOptions;
    cameras: CameraComponent[];

    frame: number = 0;
    fps: number = 0;
    dt: number = 0;

    constructor(canvas: HTMLCanvasElement, options?: RendererOptions) {
        this.options = options;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.ctx.imageSmoothingEnabled = (options.imageSmoothing) ? false : options.imageSmoothing;
        this.ctx.imageSmoothingQuality = (options.smoothingQuality) ? "medium" : options.smoothingQuality;

        this.canvas.width = document.querySelector('body').clientWidth;
        this.canvas.height = document.querySelector('body').clientHeight;
    }

    start() {
        startTime = performance.now();
        this.update();
    }

    update() {
        var endTime = performance.now();
        this.dt = (endTime - startTime) / 1000;
        this.fps = 1 / this.dt;
        startTime = performance.now();

        this.cameras = Game.root.findComponent('.CameraComponent');

        for (const camera of this.cameras) {
            this.ctx.fillStyle = camera.backgroundColor;
            this.ctx.fillRect(camera.viewport.position.x, camera.viewport.position.y, camera.viewport.width, camera.viewport.height);
            if (camera.showBorders) {
                this.ctx.strokeStyle = '#ff0000';
                this.ctx.strokeRect(camera.viewport.position.x, camera.viewport.position.y, camera.viewport.width, camera.viewport.height)
            }
        }

        if (this.options.drawStats) {
            this.drawStatistics();
        }

        Game.root.foreachGameObject((object: GameObject) => {
            object.drawUpdate();
        });

        this.frame++;
        if (this.options.vsync) {
            window.requestAnimationFrame(() => {
                this.update();
            });
        } else {
            setTimeout(() => {
                this.update();
            }, 0);
        }

    }

    /**
     * generate random color
     */
    randomColor(): string {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    drawStatistics(): void {
        var stats = Game.getStatistics();
        this.ctx.fillStyle = "#fff"
        this.ctx.fillText(`fps: ${Math.round(this.fps)} `, 10, 10);
        this.ctx.fillText(`draw dt: ${this.dt}`, 10, 24);
        this.ctx.fillText(`game dt: ${stats.deltaTime}`, 10, 38);
        this.ctx.fillText(`speed: ${stats.speed}`, 10, 52);
    }

    /**
     * draw text on pos with an offset
     * @param pos position
     * @param offset offset
     * @param text content
     */
    drawText(pos: Vector, offset: Vector, text: string): void {
        for (const camera of this.cameras) {
            var pos = camera.worldPosToCanvas(pos).add(offset);
            this.ctx.fillText(text, pos.x, pos.y);
        }
    }

    /**
     * draw a dot on position with a thickness
     * @param pos position
     * @param color color
     * @param thickness thickness in px
     */
    drawPoint(pos: Vector, color: string, thickness: number): void {
        for (const camera of this.cameras) {
            var cpos = camera.worldPosToCanvas(pos);
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.ellipse(cpos.x, cpos.y, thickness, thickness, 0, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    /**
     * draw line
     * @param opt line
     */
    drawLine(opt: line): void {
        this.ctx.strokeStyle = (!opt.color) ? "#fff" : opt.color;
        this.ctx.lineWidth = (!opt.width) ? 1 : opt.width;

        for (const camera of this.cameras) {
            var start = camera.worldPosToCanvas(opt.start);
            var end = camera.worldPosToCanvas(opt.end);

            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    /**
     * draw rectangle
     * @param opt rectangle
     */
    drawRect(opt: rectangle) {
        for (const camera of this.cameras) {
            var start = camera.worldPosToCanvas(opt.start);
            var end = (!opt.end) ? camera.worldPosToCanvas(opt.start.copy().add(new Vector(opt.width, opt.height))) : camera.worldPosToCanvas(opt.end);
            var difference = start.difference(end);

            this.ctx.beginPath();
            this.ctx.rect(start.x, start.y, difference.x, difference.y);
            this.ctx.closePath();

            if (opt.fill) {
                this.ctx.fillStyle = (!opt.fill.color) ? "#fff" : opt.fill.color;
                this.ctx.fill();
            }

            if (opt.stroke) {
                this.ctx.lineWidth = (!opt.stroke.width) ? 1 : opt.stroke.width;
                this.ctx.strokeStyle = (!opt.stroke.color) ? "#ff0000" : opt.stroke.color;
                this.ctx.stroke();
            }
        }
    }

    /**
     * draw circle
     * @param circle circle 
     */
    drawCircle(circle: circle): void {
        for (const camera of this.cameras) {
            var start = camera.worldPosToCanvas(circle.pos);
            var radius = camera.zoom * circle.radius;

            this.ctx.beginPath();
            this.ctx.ellipse(start.x, start.y, radius, radius, 0, 0, 2 * Math.PI);
            this.ctx.closePath();

            if (circle.fill) {
                this.ctx.fillStyle = (!circle.fill.color) ? "#fff" : circle.fill.color;
                this.ctx.fill();
            }

            if (circle.stroke) {
                this.ctx.lineWidth = (!circle.stroke.width) ? 1 : circle.stroke.width;
                this.ctx.strokeStyle = (!circle.stroke.color) ? "#ff0000" : circle.stroke.color;
                this.ctx.stroke();
            }
        }
    }

    /**
     * draw ellipse
     * @param ellipse 
     */
    drawEllipse(ellipse: ellipse): void {
        for (const camera of this.cameras) {
            var center = camera.worldPosToCanvas(ellipse.pos);
            var radius = ellipse.radius;

            this.ctx.beginPath();
            this.ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
            this.ctx.closePath();

            if (ellipse.fill) {
                this.ctx.fillStyle = (!ellipse.fill.color) ? "#fff" : ellipse.fill.color;
                this.ctx.fill();
            }

            if (ellipse.stroke) {
                this.ctx.lineWidth = (!ellipse.stroke.width) ? 1 : ellipse.stroke.width;
                this.ctx.strokeStyle = (!ellipse.stroke.color) ? "#ff0000" : ellipse.stroke.color;
                this.ctx.stroke();
            }
        }
    }

    /**
     * draw polygon
     * @param polygon 
     */
    drawPolygon(polygon: polygon) {
        var angle = (polygon.angle) ? polygon.angle : 0;
        for (const p of polygon.points) {
            p.rotateBy(angle);
        }

        for (const camera of this.cameras) {
            var first = camera.worldPosToCanvas(polygon.pos.copy().add(polygon.points[0]));

            this.ctx.beginPath();
            this.ctx.moveTo(first.x, first.y)
            for (const p of polygon.points) {
                var cp = camera.worldPosToCanvas(polygon.pos.copy().add(p));
                this.ctx.lineTo(cp.x, cp.y);
            }
            this.ctx.lineTo(first.x, first.y)
            this.ctx.closePath();

            if (polygon.fill) {
                this.ctx.fillStyle = (!polygon.fill.color) ? "#fff" : polygon.fill.color;
                this.ctx.fill();
            }

            if (polygon.stroke) {
                this.ctx.lineWidth = (!polygon.stroke.width) ? 1 : polygon.stroke.width;
                this.ctx.strokeStyle = (!polygon.stroke.color) ? "#ff0000" : polygon.stroke.color;
                this.ctx.stroke();
            }
        }
    }

    /**
     * draw line. mostly used for path debugging.
     * @param points 
     */
    drawPointList(points: Vector[]) {
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const next = points[i + 1];

            if (next) {
                this.drawLine({
                    start: p,
                    end: next
                })
            }
        }
    }

    /**
     * clear canvas
     */
    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}