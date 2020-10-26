import { Vector } from '../math/vector';
import { Component } from './component';
import anime from '../anime.es';

var lastID = 0;

interface GameObjectOptions {
    name: string,

    position: Vector;
    rotation?: number;
    scale?: Vector;

    color?: string;

    debug?: boolean;
}

export class GameObject {
    readonly id: number; // unique id
    name: string; // object name is not unique

    position: Vector; // relative position
    rotation: number; // rotation
    scale: Vector; // scale not implented well enough yet

    color: string; // transform color

    debug: boolean; // display debug info of this gameobject and components

    parent: GameObject; // parent gameobject
    children: GameObject[] = []; // children gameobject
    components: Component[] = []; // components

    constructor(opt: GameObjectOptions) {
        this.id = lastID;
        lastID++;

        this.name = opt.name;
        this.position = opt.position;
        this.rotation = (opt.rotation) ? opt.rotation : 0;
        this.scale = (opt.scale) ? opt.scale : new Vector(1, 1);
        this.color = (opt.color) ? opt.color : "#fff";
        this.debug = (opt.debug) ? opt.debug : false;
    }

    // get worldposition
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

    // set worldpostion
    set worldPosition(v: Vector) {                        
        this.position.add(this.worldPosition.difference(v));
    }

    // turn vector relative to this position to worldposition.
    relativePosToWorld(v: Vector): Vector {
        return this.worldPosition.add(v.scaleX(this.scale.x).scaleY(this.scale.y).rotate(this.rotation));
    }


    // get child gameobject by id (not recursive)
    getChildById(id: number): GameObject {
        for (const child of this.children) {
            if (id == child.id) {
                return child;
            }
        }
        return undefined;
    }
    // get child gameobject by name (not recursive)
    getChildrenByName(name: string): GameObject[] {
        var a = [];

        for (const child of this.children) {
            if (name == child.name) {
                a.push(child);
            }
        }

        return a;
    }
    // find child gameobject by identifier #{id} or {name} (is recursive).
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

    // add child gameobject
    addChild(...o: GameObject[]) {
        for (const obj of o) {
            obj.parent = this;
        }
        this.children = this.children.concat(o);
        return this;
    }


    // get component by id (not recursive)
    getComponentById(id: number) {
        for (const component of this.components) {
            if (id == component.id) {
                return component;
            }
        }
    }
    // get component by name (not recursive)
    getComponentsByName(name: string): Component[] {
        var a = [];

        for (const component of this.components) {
            if (name == component.name) {
                a.push(component);
            }
        }

        return a
    }
    // get component by type (not recursive)
    getComponentByType(type: string): Component {
        for (const component of this.components) {
            if (type == component.type) {
                return component;
            }
        }
    }
    // find component by identifier #{id}, .{type} or {name} (is recursive)
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

    // add one or more components to this gameobject.
    addComponent(...c: Component[]): this {
        for (const com of c) {
            com.parent = this;
            com.onInit();
            this.components.push(com);
        }
        return this;
    }

    // execute function for all children of this gameobject (is recursive)
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


    // animate gameobject rotation.
    rotateTo(a: number, duration: number, callback: Function = function(){}) {
        anime({
            targets: this,
            rotation: a,
            easing: 'linear',
            duration: duration,
            complete: callback
        });
    }

    // trigger loopstart callbacks on components. called before update.
    loopStart() {
        for (const component of this.components) {
            component.loopStart();
        }
    }

    // trigger update callbacks on components. called every update
    update() {
        for (const component of this.components) {
            component.update();
        }
    }

    // trigger draw callbacks on components. called every frame
    drawUpdate() {
        for (const component of this.components) {
            component.draw();
        }
    }
}