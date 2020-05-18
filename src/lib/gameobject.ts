import { Vector } from './vector';
import { Component } from './component';
import { MeshComponent } from './components/meshcomponent';
import { root, parentOf } from './game';

var lastID = 0;

type ComponentTypes = Component | MeshComponent;

export class GameObject {
    id: number;
    name: string;
    position: Vector;
    components: Component[] = [];

    children: GameObject[] = [];

    constructor(name: string, position: Vector) {
        this.id = lastID;
        lastID++;

        this.name = name;
        this.position = position;
    }

    get worldPosition(): Vector {
        var isRoot: Boolean = false;
        var vectors: Vector[] = [];
        var object: GameObject = this;
        var result: Vector = new Vector(0, 0);

        while(!isRoot) {
            vectors.push(object.position);
            object = parentOf(object);

            if (object.name == 'root') {
                isRoot = true;
            }
        }

        for (let i = vectors.length - 1; i >= 0; i--) {
            result.add(vectors[i]);
        }

        return result;
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
    addChild(c: GameObject) {
        this.children.push(c);
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

    findComponent(identifier: string) {
        var identifierType: string;

        if (identifier[0] == "#") {
            identifierType = "id";
        } else if (identifier[0] == ".") {
            identifierType = "type";
        } else {
            identifierType = "name";
        }

        var a = [];

        this.foreachGameObject((object: GameObject) => {
            
        });
    }

    addComponent(c: Component): this {
        c.parent = this;
        this.components.push(c);
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