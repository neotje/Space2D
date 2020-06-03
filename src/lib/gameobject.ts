import { Vector } from './vector';
import { Component } from './component';
import { MeshComponent } from './components/meshcomponent';
import { root, parentOf } from './game';
import anime from './anime.es';

var lastID = 0;

interface GameObjectOptions {
    name: string,

    position: Vector;
    rotation?: number;
    scale?: Vector;

    color?: string;
}

export class GameObject {
    readonly id: number;
    name: string;

    position: Vector;
    rotation: number;
    scale: Vector;

    color: string;

    parent: GameObject;
    children: GameObject[] = [];
    components: Component[] = [];

    constructor(opt: GameObjectOptions) {
        this.id = lastID;
        lastID++;

        this.name = opt.name;
        this.position = opt.position;
        this.rotation = (opt.rotation) ? opt.rotation : 0;
        this.scale = (opt.scale) ? opt.scale : new Vector(1, 1);
        this.color = (opt.color) ? opt.color : "#fff";
    }

    get worldPosition(): Vector {
        var vectors: Vector[] = [];
        var object: GameObject = this;
        var result: Vector = new Vector(0, 0);

        while (object.parent) {
            vectors.push(object.position);
            object = object.parent;
        }

        for (let i = vectors.length - 1; i >= 0; i--) {
            result.add(vectors[i]);
        }

        return result;
    }

    set worldPosition(v: Vector) {                        
        this.position.add(this.worldPosition.difference(v));
    }

    relativePosToWorld(v: Vector): Vector {
        return this.worldPosition.add(v.scaleX(this.scale.x).scaleY(this.scale.y).rotate(this.rotation));
    }


    getChildById(id: number): GameObject {
        for (const child of this.children) {
            if (id == child.id) {
                return child;
            }
        }
        return undefined;
    }
    getChildrenByName(name: string): GameObject[] {
        var a = [];

        for (const child of this.children) {
            if (name == child.name) {
                a.push(child);
            }
        }

        return a;
    }
    find(identifier: string): any | any[] {
        var identifierType: string;

        if (identifier[0] == "#") {
            identifierType = "id";
            identifier = identifier.replace('#', '')
        } else {
            identifierType = "name";
        }

        let a: GameObject[] = [];
        let b: GameObject;

        this.foreachGameObject((obj: GameObject) => {
            switch (identifierType) {
                case "id":
                    if (obj.id == parseInt(identifier)) {
                        b = obj;
                    }
                    break;

                case "name":
                    if (obj.name == identifier) {
                        a.push(obj);
                    }
                    break;
            }
        });

        if (identifierType == "id") {
            return b;
        } else {
            return a;
        }
    }

    addChild(...o: GameObject[]) {
        for (const obj of o) {
            obj.parent = this;
        }
        this.children = this.children.concat(o);
        return this;
    }


    getComponentById(id: number) {
        for (const component of this.components) {
            if (id == component.id) {
                return component;
            }
        }
    }
    getComponentsByName(name: string): Component[] {
        var a = [];

        for (const component of this.components) {
            if (name == component.name) {
                a.push(component);
            }
        }

        return a
    }
    getComponentByType(type: string): Component {
        for (const component of this.components) {
            if (type == component.type) {
                return component;
            }
        }
    }
    findComponent(identifier: string): any | any[] {
        var identifierType: string;

        if (identifier[0] == "#") {
            identifierType = "id";
            identifier = identifier.replace('#', '')
        } else if (identifier[0] == ".") {
            identifierType = "type";
            identifier = identifier.replace('.', '');
        } else {
            identifierType = "name";
        }

        let a: Component[] = [];
        let b: Component;

        this.foreachGameObject((object: GameObject) => {
            for (var component of object.components) {
                switch (identifierType) {
                    case "id":
                        if (component.id == parseInt(identifier)) {
                            b = component;
                        }
                        break;

                    case "type":
                        if (component.type == identifier) {
                            a.push(component);
                        }
                        break;

                    case "name":
                        if (component.name == identifier) {
                            a.push(component);
                        }
                        break;
                }
            }
        });

        if (identifierType == "type" || identifierType == "name") {
            return a;
        } else {
            return b;
        }
        return undefined;
    }

    addComponent(...c: Component[]): this {
        for (const com of c) {
            com.parent = this;
            com.onInit();
            this.components.push(com);
        }
        return this;
    }


    foreachGameObject(f: Function) {
        function loop(o: GameObject) {
            if (o.children.length > 0) {
                for (const child of o.children) {
                    if (child.children.length > 0) {
                        loop(child);
                    }
                    f(child);
                }
            }
            return;
        }

        return loop(this);
    }


    rotateTo(a: number, duration: number, callback: Function = function(){}) {
        anime({
            targets: this,
            rotation: a,
            easing: 'linear',
            duration: duration,
            complete: callback
        });
    }

    loopStart() {
        for (const component of this.components) {
            component.loopStart();
        }
    }

    update() {
        for (const component of this.components) {
            component.update();
        }
    }

    drawUpdate() {
        for (const component of this.components) {
            component.draw();
        }
    }
}