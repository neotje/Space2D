import { Component } from './component';
import anime from '../anime.es';
import { Calc } from '../calc';

var lastID = 0;

interface GameObjectOptions {
    name: string,

    position: Calc.Vector;
    rotation?: number;
    scale?: Calc.Vector;

    color?: string;
}

/**
 * GameObjects define the structure of the game's object tree.
 * 
 * A GameObject could have 1 or more GameObject as children.
 * 
 * And the {@link Component} on a GameObject define the behaviour of the GameObject.
 * 
 * Basic usage example {@link GameObject.constructor}:
 * 
 * ```ts
 * new GameObject({
 *    name: "name",
 *    position: new Calc.Vector(0, 0)
 *    // see GameObjectOptions
 * }).addComponent(
 *    new CamerComponent(...),
 *    ...
 * )
 * ```
 * @category Game
 */
export class GameObject {
    /** unique object id. Incremented each time a new GameObject is constructed. */
    readonly id: number
    /** object name. not unique. can be used to group objects see {@link GameObject.find}. */
    name: string

    /** Postion. relative to parent. */
    position: Calc.Vector
    /** Rotation in radians. */
    rotation: number
    /** Scale. **Warning: Not fully supported by every component. */
    scale: Calc.Vector

    /** Color for debugging. */
    color: string

    /** Parent GameObject. Get initilazed when added to game tree or other GameObject with {@link GameObject.addChild}. */
    parent: GameObject;
    /** Children GameObjects. To add a child GameObject use {@link GameObject.addChild}.*/
    children: GameObject[] = []
    /** GameObject's components. To add a component use {@link GameObject.addComponent} */
    components: Component[] = []; // components

    /**
     * Basic usage example:
     * 
     * ```ts
     * new GameObject({
     *    name: "name",
     *    position: new Calc.Vector(0, 0)
     *    // see GameObjectOptions
     * })
     * ```
     * 
     * @param opt Options containing basic gameobject data
     */
    constructor(opt: GameObjectOptions) {
        this.id = lastID;
        lastID++;

        this.name = opt.name;
        this.position = opt.position;
        this.rotation = (opt.rotation) ? opt.rotation : 0;
        this.scale = (opt.scale) ? opt.scale : new Calc.Vector(1, 1);
        this.color = (opt.color) ? opt.color : "#fff";
    }

    // get worldposition
    get worldPosition(): Calc.Vector {
        var vectors: Calc.Vector[] = [];
        var object: GameObject = this;
        var result: Calc.Vector = new Calc.Vector(0, 0);

        while (object.parent) {
            vectors.push(object.position);
            object = object.parent;
        }

        for (let i = vectors.length - 1; i >= 0; i--) {
            result.add(vectors[i]);
        }

        return result;
    }

    /**
     * set worldpostion
     */
    set worldPosition(v: Calc.Vector) {
        this.position.add(this.worldPosition.difference(v));
    }

    /**
     * turn vector relative to this position to worldposition.
     * @param v 
     */
    relativePosToWorld(v: Calc.Vector): Calc.Vector {
        return this.worldPosition.add(v.scaleX(this.scale.x).scaleY(this.scale.y).rotate(this.rotation));
    }


    /**
     * get child gameobject by id (not recursive)
     * @param id 
     */
    getChildById(id: number): GameObject {
        for (const child of this.children) {
            if (id == child.id) {
                return child;
            }
        }
        return undefined;
    }
    /**
     * get child gameobject by name (not recursive)
     * @param name 
     */
    getChildrenByName(name: string): GameObject[] {
        var a = [];

        for (const child of this.children) {
            if (name == child.name) {
                a.push(child);
            }
        }

        return a;
    }
    /**
     * Find child gameobject by identifier #{id} or {name} (is recursive).
     * 
     * ```ts
     * new GameObject(...).find('#1') // -> GameObject
     * // or
     * new GameObject(...).find('bullet') // -> GameObject[] 
     * ```
     * 
     * @param identifier #{id} or {name}
     */
    find(identifier: string): GameObject | GameObject[] {
        var identifierType: string = "name";

        if (identifier[0] == "#") {
            identifierType = "id";
            identifier = identifier.replace('#', '')
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
        }
        return a;
    }

    /**
     * add child gameobject
     * @param o 
     */
    addChild(...o: GameObject[]) {
        for (const obj of o) {
            // set parent for each GameObject
            obj.parent = this;
        }
        this.children = this.children.concat(o);
        return this;
    }


    /**
     * get component by id (not recursive)
     * @param id 
     */
    getComponentById(id: number) {
        for (const component of this.components) {
            if (id == component.id) {
                return component;
            }
        }
    }
    /**
     * get component by name (not recursive)
     * @param name 
     */
    getComponentsByName(name: string): Component[] {
        var a = [];

        for (const component of this.components) {
            if (name == component.name) {
                a.push(component);
            }
        }

        return a
    }
    /**
     * get component by type (not recursive)
     * @param type 
     */
    getComponentByType(type: string): any {
        for (const component of this.components) {
            if (type == component.type) {
                return component;
            }
        }
    }
    /**
     * find component by identifier #{id}, .{type} or {name} (is recursive)
     * @param identifier 
     */
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

    /**
     * add one or more components to this gameobject.
     * @param c 
     */
    addComponent(...c: Component[]): this {
        for (const com of c) {
            com.parent = this;
            com.onInit();
            this.components.push(com);
        }
        return this;
    }

    /**
     * execute function for all children of this gameobject (is recursive)
     * @param f 
     */
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


    // 
    /**
     * animate gameobject rotation.
     * @param a 
     * @param duration 
     * @param callback 
     */
    rotateTo(a: number, duration: number, callback: Function = function () { }) {
        anime({
            targets: this,
            rotation: a,
            easing: 'linear',
            duration: duration,
            complete: callback
        });
    }

    /**
     * trigger loopstart callbacks on components. called before update.
     */
    loopStart() {
        for (const component of this.components) {
            if (component.enable) {
                component.loopStart();
            }
        }
    }

    /**
     * trigger update callbacks on components. called every update
     */
    update() {
        for (const component of this.components) {
            if (component.enable) {
                component.update();
            }
        }
    }

    /**
     * trigger loopstart callbacks on components. called before update.
     */
    loopEnd() {
        for (const component of this.components) {
            if (component.enable) {
                component.loopEnd();
            }
        }
    }

    /**
     * trigger draw callbacks on components. called every frame
     */
    drawUpdate() {
        for (const component of this.components) {
            if (component.enable) {
                component.draw();
            }
        }
    }
}