import { Component } from "../game/component";
import { Game } from "../game";

/**
 * @category Component
 */
export class BasicMovementComponent extends Component {
    speed: number;

    up: boolean = false;
    down: boolean = false;
    left: boolean = false;
    right: boolean = false;

    constructor(name: string, speed: number) {
        super(name, 'BasicMovementComponent');

        this.speed = speed;

        window.addEventListener('keydown', (e) => {
            var key = e.key;            

            if (key == 'w') {
                this.up = true;
            }
            if (key == 's') {
                this.down = true;
            }
            if (key == 'a') {
                this.left = true;
            }
            if (key == 'd') {
                this.right = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            var key = e.key;
            
            if (key == 'w') {
                this.up = false;
            }
            if (key == 's') {
                this.down = false;
            }
            if (key == 'a') {
                this.left = false;
            }
            if (key == 'd') {
                this.right = false;
            }
        });

        window.addEventListener('keypress', (e) => {
            var key = e.key;

            console.log(key);
            

            if (key == '=') {
                Game.setSpeed(Game.getSpeed() + 1);
            }
            if (key == '-') {
                Game.setSpeed(Game.getSpeed() - 1);
            }
        })

        window.addEventListener('wheel', (e) => {            
            for (const c of Game.renderer.cameras) {
                console.log(c.zoom, c.zoom / e.deltaY);
                
                c.zoom -= c.zoom / e.deltaY
            }
        })
    }

    onInit() {
        
    }

    update() {
        var dt = Game.getStatistics().deltaTime 

        if (this.up) {
            this.parent.position.y -= this.speed * dt
        }
        if (this.down) {
            this.parent.position.y += this.speed * dt
        }
        if (this.left) {
            this.parent.position.x -= this.speed * dt
        }
        if (this.right) {
            this.parent.position.x += this.speed * dt
        }
    }
}