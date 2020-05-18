import { CameraComponent } from "./components/cameracomponent";
import { root } from "./game";
import { Vector } from "./vector";
import { GameObject } from "./gameobject";

interface RendererOptions {
    drawTransforms?: boolean;
    showViewPortBorder?: boolean;
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

export class Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: RendererOptions;
    cameras: CameraComponent[];

    constructor(canvas: HTMLCanvasElement, options?: RendererOptions) {
        this.options = options;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    update() {
        this.cameras = root.findComponent('.CameraComponent')

        if (this.options.drawTransforms) {
            root.foreachGameObject((object: GameObject) => {
                if (!object.color) {
                    object.color = this.randomColor();
                }
                this.drawPoint(object.worldPosition, object.color, 5);
            })
        }

        for (const camera of this.cameras) {
            if (camera.showBorders) {
                this.ctx.strokeStyle = '#ff0000';
                this.ctx.strokeRect(camera.viewport.position.x, camera.viewport.position.y, camera.viewport.width, camera.viewport.height)
            }
        }
    }

    randomColor(): string {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

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

    drawLine(opt: line): void {
        this.ctx.strokeStyle = (!opt.color) ? "#000" : opt.color;
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

    drawRect(opt: rectangle) {
        for( const camera of this.cameras) {
            var start = camera.worldPosToCanvas(opt.start);
            var end = (!opt.end) ? camera.worldPosToCanvas(opt.start.copy().add(new Vector(opt.width, opt.height))) : camera.worldPosToCanvas(opt.end);
            var difference = start.difference(end);

            this.ctx.beginPath();
            this.ctx.rect(start.x, start.y, difference.x, difference.y);
            this.ctx.closePath();
        }

        if (opt.fill) {
            this.ctx.fillStyle = (!opt.fill.color) ? "#000" : opt.fill.color;
            this.ctx.fill();
        }

        if (opt.stroke) {
            this.ctx.lineWidth = (!opt.stroke.width) ? 1 : opt.stroke.width;
            this.ctx.strokeStyle = (!opt.stroke.color) ? "#ff0000" : opt.stroke.color;
            this.ctx.stroke();
        }
    }

    drawCircle(circle: circle): void {
        for( const camera of this.cameras) {
            var start = camera.worldPosToCanvas(circle.pos);
            var radius = camera.zoom * circle.radius;

            this.ctx.beginPath();
            this.ctx.ellipse(start.x, start.y, radius, radius, 0, 0, 2 * Math.PI);
            this.ctx.closePath();
        }

        if (circle.fill) {
            this.ctx.fillStyle = (!circle.fill.color) ? "#000" : circle.fill.color;
            this.ctx.fill();
        }

        if (circle.stroke) {
            this.ctx.lineWidth = (!circle.stroke.width) ? 1 : circle.stroke.width;
            this.ctx.strokeStyle = (!circle.stroke.color) ? "#ff0000" : circle.stroke.color;
            this.ctx.stroke();
        }
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}