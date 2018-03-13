export default class RTSPathVisualizer {
    constructor(scene) {
        this._scene = scene;
    }

    visualize(gridPath, mapPath) {
        console.log(gridPath, mapPath);
        this._visualizeMapPath(mapPath);
    }

    _visualizeMapPath(mapPath) {
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
        this._scene.add(pathLines);

        // Draw debug cubes except the last one. Also, add the player position.
        const debugPath = [mapPath[0]].concat(mapPath);

        for (let i = 0; i < debugPath.length - 1; i++) {
            const boxGeometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
            const boxMaterial = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
            const node = new THREE.Mesh(boxGeometry, boxMaterial);
            node.position.copy(debugPath[i]);
            pathLines.add(node);
        }
    }
}