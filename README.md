# Space2D

Typescript 2D game engine

## Game tree
```
GameObject{
    components[
        CameraComponent,
        PhysicsComponent,
        ...
    ],
    children: [
        GameObject {
            components: [
                SpriteComponent
            ],
            children: []
        }.
        GameObject {
            ...
        },
        ...
    ]
}
```

more detailed game tree.
```
GameObject {
    id: 0
    name: 'root'
    position: Vector
    scale: Vector
    rotation: number
    parent: GameObject

    components: [
        Component {
            name: 'some component'
            id: 0
            type: 'ComponentType
            parent: GameObject

            draw()
            update()
        },
        ....
    ]

    children: [
        GameObject,
        GameObject,
        ...
    ]
}
```