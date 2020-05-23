import { CameraComponent } from "./components/cameracomponent";
import { root, getStatistics } from "./game";
import { Vector } from "./vector";
import { GameObject } from "./gameobject";

interface RendererOptions {
    drawTransforms?: boolean;
    imageSmoothing?: boolean;
    smoothingQuality?: "low" | "medium" | "high";
    drawStats?: boolean;
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
    points: Vector[];
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

        this.ctx.imageSmoothingEnabled = (options.imageSmoothing) ? false : options.imageSmoothing;
        this.ctx.imageSmoothingQuality = (options.smoothingQuality) ? "medium" : options.smoothingQuality;

        this.canvas.width = document.querySelector('body').clientWidth;
        this.canvas.height = document.querySelector('body').clientHeight;
    }

    update() {
        this.cameras = root.findComponent('.CameraComponent')

        if (this.options.drawTransforms) {
            this.drawPoint(root.worldPosition, root.color, 5);
            root.foreachGameObject((object: GameObject) => {
                if (!object.color) {
                    object.color = this.randomColor();
                }
                this.drawPoint(object.worldPosition, object.color, 5);

                this.drawText(object.worldPosition, new Vector(0, 15), `#${object.id} ${object.name}`);
            })
        }

        if (this.options.drawStats) {
            this.drawStatistics();
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

    drawStatistics(): void {
        var stats = getStatistics();
        this.ctx.fillText(`fps: ${Math.round(stats.fps)} `, 10, 10);
        this.ctx.fillText(`dt: ${stats.deltaTime}`, 10, 24);
        this.ctx.fillText(`speed: ${stats.speed}`, 10, 38);
    }

    drawText(pos: Vector, offset: Vector, text: string): void {
        for (const camera of this.cameras) {
            var pos = camera.worldPosToCanvas(pos).add(offset);
            this.ctx.fillText(text, pos.x, pos.y);
        }
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
    }

    drawCircle(circle: circle): void {
        for( const camera of this.cameras) {
            var start = camera.worldPosToCanvas(circle.pos);
            var radius = camera.zoom * circle.radius;

            this.ctx.beginPath();
            this.ctx.ellipse(start.x, start.y, radius, radius, 0, 0, 2 * Math.PI);
            this.ctx.closePath();

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
    }

    drawEllipse(ellipse: ellipse): void {
        for (const camera of this.cameras) {
            var center = camera.worldPosToCanvas(ellipse.pos);
            var radius = ellipse.radius;

            this.ctx.beginPath();
            this.ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2*Math.PI);
            this.ctx.closePath();

            if (ellipse.fill) {
                this.ctx.fillStyle = (!ellipse.fill.color) ? "#000" : ellipse.fill.color;
                this.ctx.fill();
            }
    
            if (ellipse.stroke) {
                this.ctx.lineWidth = (!ellipse.stroke.width) ? 1 : ellipse.stroke.width;
                this.ctx.strokeStyle = (!ellipse.stroke.color) ? "#ff0000" : ellipse.stroke.color;
                this.ctx.stroke();
            }
        }
    }

    drawPolygon(polygon: polygon) {
        for (const camera of this.cameras) {
            var first = camera.worldPosToCanvas(polygon.points[0]);

            this.ctx.beginPath();
            this.ctx.moveTo(first.x, first.y)
            for (const p of polygon.points) {
                var cp = camera.worldPosToCanvas(p);
                this.ctx.lineTo(cp.x, cp.y);
            }
            this.ctx.lineTo(first.x, first.y)
            this.ctx.closePath();

            if (polygon.fill) {
                this.ctx.fillStyle = (!polygon.fill.color) ? "#000" : polygon.fill.color;
                this.ctx.fill();
            }
    
            if (polygon.stroke) {
                this.ctx.lineWidth = (!polygon.stroke.width) ? 1 : polygon.stroke.width;
                this.ctx.strokeStyle = (!polygon.stroke.color) ? "#ff0000" : polygon.stroke.color;
                this.ctx.stroke();
            }
        }
    }

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

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}