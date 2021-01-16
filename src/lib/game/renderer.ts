import { Calc } from "../calc";
import { CameraComponent } from "../components/cameracomponent";
import { Game } from "../game";
import { GameObject } from "./gameobject";

interface RendererOptions {
    imageSmoothing?: boolean;
    smoothingQuality?: "low" | "medium" | "high";
    drawStats?: boolean;
    vsync?: boolean;
}

/**
 * @category Draw
 */
export interface line {
    start: Calc.Vector;
    end: Calc.Vector;
    color?: string;
    width?: number;
}

/**
 * @category Draw
 */
export interface rectangle {
    start: Calc.Vector;
    end?: Calc.Vector;
    width?: number;
    height?: number;
    fill?: fill;
    stroke?: stroke;
}

/**
 * @category Draw
 */
export interface circle {
    pos: Calc.Vector;
    radius: number;
    fill?: fill;
    stroke?: stroke;
}

/**
 * @category Draw
 */
export interface ellipse {
    pos: Calc.Vector;
    radius: Calc.Vector;
    fill?: fill;
    stroke?: stroke;
}

/**
 * @category Draw
 */
export interface point {
    pos: Calc.Vector;
}

/**
 * @category Draw
 */
export interface polygon {
    pos: Calc.Vector;
    points: Calc.Vector[];
    angle?: number;
    fill?: fill;
    stroke?: stroke;
}

/**
 * @category Draw
 */
export interface fill {
    color?: string;
}

/**
 * @category Draw
 */
export interface stroke {
    color?: string;
    width?: number;
}

/**
 * @category Draw
 */
interface text {
    color?: string;
    font?: string;
}

var startTime = 0

var max = 0
var maxCurrent = 0
var avrage: number
var every = 2
var tempi = 0
var buffer = 0

interface GraphData {
    max: number;
    maxOfCurrentVal: number;
    average?: number;
    points: number[];
    buffer: number;
}

class Graph {
    updateLoop: GraphData = {
        max: 0,
        maxOfCurrentVal: 0,
        points: [],
        buffer: 0
    }

    renderLoop: GraphData = {
        max: 0,
        maxOfCurrentVal: 0,
        points: [],
        buffer: 0
    }

    every: number;
    i: number = 0;
    amountOfPoints: number = 50;

    height: number = 120
    width: number = 290

    mode: "probe" | "average" | "max"

    constructor(every: number = 0) {
        this.every = every
        this.mode = "max"
    }

    get max(): number {
        return Math.max(this.updateLoop.max, this.renderLoop.max)
    }
    get maxOfCurrentVals(): number {
        return Math.max(this.updateLoop.maxOfCurrentVal, this.renderLoop.maxOfCurrentVal)
    }

    updateAverages(stats: Game.Statistics) {
        // update averages
        if (!this.updateLoop.average) this.updateLoop.average = stats.deltaTime
        if (!this.renderLoop.average) this.renderLoop.average = Game.renderer.dt
        this.updateLoop.average = (this.updateLoop.average + stats.deltaTime) / 2
        this.renderLoop.average = (this.renderLoop.average + Game.renderer.dt) / 2
    }

    updateBuffers(stats: Game.Statistics) {
        if (this.updateLoop.buffer == 0) this.updateLoop.buffer = stats.deltaTime

        if (this.renderLoop.buffer == 0) this.renderLoop.buffer = Game.renderer.dt

        if (this.mode == "average") {
            this.updateLoop.buffer = (this.updateLoop.buffer + stats.deltaTime) / 2
            this.renderLoop.buffer = (this.renderLoop.buffer + Game.renderer.dt) / 2
        }
        if (this.mode == "probe") {
            this.updateLoop.buffer = stats.deltaTime
            this.renderLoop.buffer = Game.renderer.dt
        }
        if (this.mode == "max") {
            this.updateLoop.buffer = Math.max(this.updateLoop.buffer, stats.deltaTime)
            this.renderLoop.buffer = Math.max(this.renderLoop.buffer, Game.renderer.dt)
        }
    }

    dumpBuffers() {
        this.updateLoop.points.push(this.updateLoop.buffer)
        this.renderLoop.points.push(this.renderLoop.buffer)

        this.updateLoop.buffer = 0
        this.renderLoop.buffer = 0
    }

    updateGraphPoints(stats: Game.Statistics) {
        if (this.i == 0 || this.every == 0) {
            this.dumpBuffers()
        }
        this.i++
        if (this.i >= this.every) {
            this.i = 0
        }

        while (this.updateLoop.points.length > this.amountOfPoints) {
            this.updateLoop.points.shift()
        }
        while (this.renderLoop.points.length > this.amountOfPoints) {
            this.renderLoop.points.shift()
        }

        this.updateLoop.max = (Math.max(this.updateLoop.max, ...this.updateLoop.points))
        this.renderLoop.max = (Math.max(this.renderLoop.max, ...this.renderLoop.points))

        this.updateLoop.maxOfCurrentVal = (Math.max(...this.updateLoop.points) + this.updateLoop.maxOfCurrentVal) / 2
        this.renderLoop.maxOfCurrentVal = (Math.max(...this.renderLoop.points) + this.renderLoop.maxOfCurrentVal) / 2
    }

    draw() {
        var stats = Game.getStatistics()
        var ctx = Game.renderer.ctx

        this.updateAverages(stats)

        this.updateBuffers(stats)

        this.updateGraphPoints(stats)

        var bottomLeft: Calc.Vector = new Calc.Vector(Game.renderer.canvas.width - this.width - 50, this.height + 50)
        var topLeft: Calc.Vector = new Calc.Vector(Game.renderer.canvas.width - this.width - 50, 50)

        var lineWidth = Math.ceil(this.width / this.amountOfPoints)
        ctx.lineWidth = lineWidth

        for (let i = 0; i < this.renderLoop.points.length; i++) {
            const p = this.renderLoop.points[i];
            var bottom: Calc.Vector = bottomLeft.copy().addX(i * lineWidth).addX(lineWidth / 2)
            var top: Calc.Vector = bottom.copy().addY(-(p / this.maxOfCurrentVals * this.height))

            ctx.strokeStyle = `rgb(0, 255, ${(this.renderLoop.max - p) / this.renderLoop.max * this.height})`

            ctx.beginPath()
            ctx.moveTo(bottom.x, bottom.y)
            ctx.lineTo(top.x, top.y)
            ctx.closePath()
            ctx.stroke()
        }

        for (let i = 0; i < this.updateLoop.points.length; i++) {
            const p = this.updateLoop.points[i];
            var bottom: Calc.Vector = bottomLeft.copy().addX(i * lineWidth).addX(lineWidth / 2)
            var top: Calc.Vector = bottom.copy().addY(-(p / this.maxOfCurrentVals * this.height))

            ctx.strokeStyle = `rgb(255, ${(this.updateLoop.max - p) / this.updateLoop.max * this.height}, 0)`

            ctx.beginPath()
            ctx.moveTo(bottom.x, bottom.y)
            ctx.lineTo(top.x, top.y)
            ctx.closePath()
            ctx.stroke()
        }

        // draw average lines
        var avrLineUpdate: Calc.Vector = bottomLeft.copy().addY(-(this.updateLoop.average / this.renderLoop.maxOfCurrentVal * this.height))
        var avrLineRender: Calc.Vector = bottomLeft.copy().addY(-(this.renderLoop.average / this.renderLoop.maxOfCurrentVal * this.height))

        ctx.strokeStyle = `rgb(0, 0, 255)`
        ctx.lineWidth = 1

        ctx.beginPath()

        ctx.moveTo(avrLineUpdate.x, avrLineUpdate.y)
        ctx.lineTo(avrLineUpdate.x + this.width, avrLineUpdate.y)

        ctx.moveTo(avrLineRender.x, avrLineRender.y)
        ctx.lineTo(avrLineRender.x + this.width, avrLineRender.y)

        ctx.closePath()
        ctx.stroke()

        // draw legenda
        ctx.font = "10px sans-serif"
        ctx.fillStyle = "#fff"

        avrLineRender.y = Math.max(avrLineRender.y, topLeft.y + 15)
        avrLineRender.y = Math.min(avrLineRender.y, bottomLeft.y - 15)

        avrLineUpdate.y = Math.max(avrLineUpdate.y, topLeft.y + 15)
        avrLineUpdate.y = Math.min(avrLineUpdate.y, bottomLeft.y - 15)

        ctx.fillText("0", bottomLeft.x - 20, bottomLeft.y)

        ctx.fillText(`${Calc.roundTo(this.updateLoop.average * 1000, 4)} ms`, avrLineUpdate.x - 60, avrLineUpdate.y)
        ctx.fillText(`${Calc.roundTo(this.renderLoop.average * 1000, 4)} ms`, avrLineRender.x - 60, avrLineRender.y)

        ctx.fillText(`${Calc.roundTo(this.maxOfCurrentVals * 1000, 4)} ms`, topLeft.x - 60, topLeft.y)
    }
}

/**
 * @category Graphics
 */
export class Renderer {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    options: RendererOptions
    cameras: CameraComponent[]

    frame: number = 0
    fps: number = 0
    dt: number = 0

    graphPoints: number[] = []
    graph: Graph = new Graph(0)

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
        this.ctx.fillText(`frame: ${this.frame}`, 10, 24)
        this.ctx.fillText(`draw dt: ${this.dt}`, 10, 38);
        this.ctx.fillText(`game dt: ${stats.deltaTime}`, 10, 52);
        this.ctx.fillText(`speed: ${stats.speed}`, 10, 66);

        this.graph.draw()

        /* // performance graph
        if (!avrage) avrage = stats.deltaTime
        avrage = (avrage + stats.deltaTime) / 2


        // buffer keeps counting
        if (buffer == 0) buffer = stats.deltaTime
        buffer = (stats.deltaTime + buffer )/ 2

        // dump buffer when every frames has passed
        if (tempi == 0 || this.graphPoints.length == 0 || this.frame < 50) {
            this.graphPoints.push(buffer)
            buffer = 0
        }
        tempi++
        if (tempi >= every) {
            tempi = 0
        }

        if (this.graphPoints.length > 100) this.graphPoints.shift()        

        // graph width and height
        var height: number = 120
        var width: number = 290

        var start: number = this.canvas.width - width - 50

        max = Math.max(...this.graphPoints, max)
        if (!maxCurrent) maxCurrent = Math.max(...this.graphPoints)
        maxCurrent = (Math.max(...this.graphPoints) + maxCurrent) / 1.9

        var lineWidth = Math.ceil(width / 100)

        // draw graph collumns
        for (let i = 0; i < this.graphPoints.length; i++) {
            const v = this.graphPoints[i]
            var x: number = start + i * lineWidth
            var y: number = height + 50
            var g: number = (max - v)/max * 255            
            
            this.ctx.strokeStyle = `rgb(255, ${(g)}, 0)`
            this.ctx.lineWidth = lineWidth

            this.ctx.beginPath()
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(x, y - (v/maxCurrent * height))
            this.ctx.closePath()
            this.ctx.stroke()
        }

        // draw avrage line
        var g: number = (max - avrage)/max * 255
        var avrLineY = y - (avrage/maxCurrent * height)       

        this.ctx.strokeStyle = `rgb(255, 0, ${Math.round(g)})`
        this.ctx.lineWidth = 1

        this.ctx.beginPath()
        this.ctx.moveTo(start, avrLineY)
        this.ctx.lineTo(start + width, avrLineY)
        this.ctx.closePath()
        this.ctx.stroke()

        // draw legenda
        this.ctx.font = "10px sans-serif"
        this.ctx.fillStyle = "#fff"

        this.ctx.fillText("0", start - 20, y)
        this.ctx.fillText(`${Calc.roundTo(avrage * 1000, 4)} ms`, start - 60, avrLineY)
        this.ctx.fillText(`${Calc.roundTo(maxCurrent * 1000, 4)} ms`, start - 60, 50) */
    }

    /**
     * draw text on pos with an offset
     * @param pos position
     * @param offset offset
     * @param text content
     */
    drawText(pos: Calc.Vector, offset: Calc.Vector, text: string, style?: text): void {
        for (const camera of this.cameras) {
            var pos = camera.worldPosToCanvas(pos).add(offset)
            this.ctx.font = (style.font) ? style.font : "10px sans-serif"
            this.ctx.fillStyle = (style.color) ? style.color : "#fff"
            this.ctx.fillText(text, pos.x, pos.y)
        }
    }

    /**
     * draw a dot on position with a thickness
     * @param pos position
     * @param color color
     * @param thickness thickness in px
     */
    drawPoint(pos: Calc.Vector, color: string, thickness: number): void {
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
            var end = (!opt.end) ? camera.worldPosToCanvas(opt.start.copy().add(new Calc.Vector(opt.width, opt.height))) : camera.worldPosToCanvas(opt.end);
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
    drawPointList(points: Calc.Vector[]) {
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