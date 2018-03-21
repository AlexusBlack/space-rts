export default class RTSPathVisualizer {
    constructor(scene, size, density, grid, walkableTileTypes) {
        this._scene = scene;
        this._size = size;
        this._density = density;
        this._grid = grid;
        this._walkableTileTypes = walkableTileTypes;

        this._gridTiles = [];
        this._mapLines = [];
        this._mapDots = [];

        this._visualizeGrid();

        window._pathVisualizer = this;
    }

    visualize(gridPath, mapPath) {
        this._visualizeMapPath(mapPath);
        this._visualizeGridPath(gridPath);
    }

    _cleanItems(collection) {
        collection.map(item => this._scene.remove(item));
    }

    _visualizeGrid() {
        const navigationGrid = new THREE.GridHelper(this._size, this._size/this._density, new THREE.Color(0x18dd11), new THREE.Color(0x18dd11));
        navigationGrid.position.x += this._size / 2;
        navigationGrid.position.z += this._size / 2;
        this._scene.add(navigationGrid);

        // marking all non-walkable tiles
        for(let y = 0; y < this._grid.length; y++) {
            for(let x = 0; x < this._grid[y].length; x++) {
                if(!this._walkableTileTypes.includes(this._grid[y][x])) {
                    //console.log(`${x},${y}: not walkable`);
                    const tileGeometry = new THREE.PlaneGeometry(this._density, this._density, 4);
                    const tileMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
                    tileMaterial.transparent = true;
                    tileMaterial.opacity = 0.3;
                    const tile = new THREE.Mesh(tileGeometry, tileMaterial);
                    tile.rotation.x = Math.PI / 2;
                    tile.position.x = x * this._density + this._density / 2;
                    tile.position.z = y * this._density + this._density / 2;
                    
                    this._scene.add(tile);
                }
            }
        }
    }

    _visualizeGridPath(gridPath) {
        this._cleanItems(this._gridTiles);

        for(let i = 0; i < gridPath.length; i++) {
            const tileGeometry = new THREE.PlaneGeometry(this._density, this._density, 4);
            const tileMaterial = new THREE.MeshBasicMaterial({color: 0x18dd11, side: THREE.DoubleSide});
            tileMaterial.transparent = true;
            tileMaterial.opacity = 0.3;
            const tile = new THREE.Mesh(tileGeometry, tileMaterial);
            tile.rotation.x = Math.PI / 2;
            tile.position.x = gridPath[i].x * this._density + this._density / 2;
            tile.position.z = gridPath[i].y * this._density + this._density / 2;
            
            this._gridTiles.push(tile);
            this._scene.add(tile);
        }
    }

    _visualizeMapPath(mapPath) {
        this._cleanItems(this._mapLines);
        this._cleanItems(this._mapDots);

        var material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 2
        });
        const geometry = new THREE.Geometry();
        geometry.vertices.push(mapPath[0]);
        // Draw debug lines
        for (let i = 0; i < mapPath.length; i++) {
            geometry.vertices.push(mapPath[i].clone().add(new THREE.Vector3(0, 0.2, 0)));
        }
        const pathLines = new THREE.Line(geometry, material);
        this._mapLines.push(pathLines);
        this._scene.add(pathLines);

        // Draw debug cubes except the last one. Also, add the player position.
        const debugPath = [mapPath[0]].concat(mapPath);

        for (let i = 0; i < debugPath.length; i++) {
            const boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
            const boxMaterial = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
            const node = new THREE.Mesh(boxGeometry, boxMaterial);
            node.position.copy(debugPath[i]);
            this._mapDots.push(node);
            pathLines.add(node);
        }
    }

    visualizeUnit(unit) {
        const curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            3, 3,           // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.rotateX(Math.PI / 2);
        geometry.translate(0, 0, 0);
        const material = new THREE.LineBasicMaterial({ color : 0xff0000, linewidth: 3 });
        const ellipse = new THREE.Line(geometry, material);

        const currentVelocityGeometry = new THREE.Geometry();
        currentVelocityGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        currentVelocityGeometry.vertices.push(new THREE.Vector3(0, 0, 8));
        const currentVelocityLine = new THREE.Line(currentVelocityGeometry, material);
        ellipse.add(currentVelocityLine);
        ellipse.position.y = -0.2;

        unit._object.add(ellipse);
    }
}