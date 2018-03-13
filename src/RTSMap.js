import * as THREE from 'three';
import * as Skybox from './Libraries/Skybox';
import RTSPathfinder from './RTSGridPathfinder';
import RTSPathVisualizer from './RTSPathVisualizer';
// import RTSPathfinder from './RTSMeshPathfinder';

export default class RTSMap {
    constructor(size) {
        this.units = [];
        this.size = size || 250;
        this.skybox = 'ame-nebula';
        this.cameraPostion = new THREE.Vector3(30, 0, 30);
    }

    initialize(scene, level) {
        this.level = level;
        const pathVisualizer = new RTSPathVisualizer(scene);
        this._pathfinder = new RTSPathfinder(this, 5, [0]);
        this._pathfinder.enableVisualization(pathVisualizer);

        // Loading lights from map
        this._createLights(scene);

        // Skybox for nice background
        this._createSkybox(scene);

        // Load map units
        this._loadMapUnits(scene);
    }

    _createLights(scene) {
        // TODO: load lights from map
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 2).normalize();
        dirLight.lookAt(new THREE.Vector3(0, 0, 0));

        scene.add(dirLight);
    }

    _createSkybox(scene) {
        const skyboxSize = this.size > 1000 ? this.size * 2 : 3000;
        const skybox = Skybox.create(this.skybox, skyboxSize);
        skybox.position.x += skyboxSize / 4;
        skybox.position.z += skyboxSize / 4;

        scene.add(skybox);
    }

    _loadMapUnits(scene) {
        for(var unit of this.units) {
            unit.setPathfinder(this._pathfinder);
            scene.add(unit._object);
        }
    }

    update(secondFraction) {
        for(var unit of this.units) {
            unit.update(secondFraction);
        }
    }
}