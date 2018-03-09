import * as THREE from 'three';
import RTSControls from './RTSControls';
import * as Skybox from './Skybox';


export default class RTSScene {
    constructor(map) {
        if(map == null) throw new MapException('Map is required to init scene');

        this._map = map;

        // Creating THREE scene and camera
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

        // Creating THREE renderer
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        // Adding our scene to DOM
        document.body.appendChild(this._renderer.domElement);

        // Creating user controls
        const boundaries = new THREE.Box2(
            new THREE.Vector2(0, 0),
            new THREE.Vector2(map.size, map.size)
        );
        this._controls = new RTSControls(this._camera, this._renderer.domElement, this._scene, boundaries);

        this._loadMap();

        // Handling window resize event
        window.addEventListener('resize', this.onWindowResize, false);
    }

    _onWindowResizeHandler(event) {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _loadMap() {
        // Adding level mesh to calculate click raycasts
        this._level = this._createLevel(this._map.size);
        this._scene.add(this._level);

        // Helper grid for navigation and edge of map
        this._scene.add(this._createHelperGrid(this._map.size));

        // Loading lights from map
        this._createLights(this._scene, this._map);

        // Skybox for nice background
        const skybox = this._createSkybox(this._map);
        this._scene.add(skybox);
    }

    _createLevel(size) {
        // Adding level mesh to calculate click raycasts
        const levelGeometry = new THREE.PlaneGeometry(size, size, 4);
        const levelMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
        levelMaterial.visible = false;
        const level = new THREE.Mesh(levelGeometry, levelMaterial );
        level.position.x += size / 2;
        level.position.z += size / 2;
        level.rotation.x = Math.PI / 2;

        return level;
    }

    _createHelperGrid(size) {
        const density = size / 10;
        const helperGrid = new THREE.GridHelper(size, size/10, new THREE.Color(0x333333), new THREE.Color(0x333333));
        helperGrid.position.x += size / 2;
        helperGrid.position.z += size / 2;

        return helperGrid;
    }

    _createLights(scene, map) {
        // TODO: load lights from scene
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 2).normalize();
        dirLight.lookAt(new THREE.Vector3(0, 0, 0));

        scene.add(dirLight);
    }

    _createSkybox(map) {
        const skyboxSize = map.size > 1000 ? map.size * 2 : 3000;
        const skybox = Skybox.create(map.skybox, skyboxSize);
        skybox.position.x += skyboxSize / 4;
        skybox.position.z += skyboxSize / 4;

        return skybox;
    }

    update() {
        this._renderer.render(this._scene, this._camera);
        this._controls.update();
    }
}