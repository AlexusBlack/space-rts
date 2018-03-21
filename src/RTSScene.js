import * as THREE from 'three';
import EventEmitter from 'events';
import RTSControls from './RTSControls';
import TWEEN from '@tweenjs/tween.js';


export default class RTSScene extends EventEmitter {
    constructor(map) {
        super();
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
        this._controls.position.copy(map.cameraPostion);
        this._createClickIndicator();
        
        // Handling use clicks
        this._raycaster = new THREE.Raycaster();
        document.addEventListener('click', (event) => this._documentMouseClickHandler(event), false);

        // Adding level mesh to calculate click raycasts
        this.level = this._createLevel(this._map.size);
        this._scene.add(this.level);

        // Helper grid for navigation and edge of map
        this._scene.add(this._createHelperGrid(this._map.size));

        this._map.initialize(this._scene, this.level);

        // Handling window resize event
        window.addEventListener('resize', this.onWindowResize, false);
    }

    _onWindowResizeHandler(event) {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _documentMouseClickHandler(event) {
        const mousePosition = {};
        mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;
        this._raycaster.setFromCamera(mousePosition, this._camera);

        // Unit intersects
        const unitObjects = this._map.units.map(unit => unit.intersectBody);
        const unitIntersects = this._raycaster.intersectObjects(unitObjects);
        //console.log(unitIntersects);

        if(unitIntersects.length > 0) {
            // unitIntersects[0].object.material.visible = true;
            const unit = unitIntersects[0].object.unit;
            this.selectUnit(unit);
            //console.log('Selected unit: ', unitIntersects[0].object.unit);
            this.emit('unit-selected', unit)
        } else {
            // Terrain intersects
            const terrainIntersects = this._raycaster.intersectObject(this.level);
            if(terrainIntersects.length > 0) {
                const position = terrainIntersects[0].point;
                this._showClick(position);
                this.emit('map-click', position);
                // console.log(vec);
            }
        }
    }

    selectUnit(unitToSelect) {
        for(let unit of this._map.units) {
            if(unit === unitToSelect) {
                unit.intersectBody.material.visible = true;
            } else {
                unit.intersectBody.material.visible = false;
            }
        }
    }

    _createLevel(size) {
        // Adding level mesh to calculate click raycasts
        const levelGeometry = new THREE.PlaneGeometry(size, size, 16);
        levelGeometry.rotateX(Math.PI / 2);
        levelGeometry.translate(size / 2, 0, size / 2);
        const levelMaterial = new THREE.MeshBasicMaterial({color: 0x00bfff, side: THREE.DoubleSide});
        levelMaterial.visible = false;
        levelMaterial.transparent = true;
        levelMaterial.opacity = 0.1;
        const level = new THREE.Mesh(levelGeometry, levelMaterial );
        // level.position.x += size / 2;
        // level.position.z += size / 2;
        // level.rotation.x = Math.PI / 2;

        return level;
    }

    _createClickIndicator() {
        const geometry = new THREE.RingGeometry( 1, 2, 8 );
        geometry.rotateX(Math.PI / 2);
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
        this._clickIndicator = new THREE.Mesh(geometry, material);
        this._clickIndicator.visible = false

        this._scene.add(this._clickIndicator);
    }

    _createHelperGrid(size) {
        const density = size / 10;
        const helperGrid = new THREE.GridHelper(size, size/10, new THREE.Color(0x333333), new THREE.Color(0x333333));
        helperGrid.position.x += size / 2;
        helperGrid.position.z += size / 2;

        return helperGrid;
    }

    _showClick(position) {
        this._clickIndicator.position.copy(position);
        this._clickIndicator.scale.set(1, 1, 1);
        this._clickIndicator.visible = true;
        if(this._clickIndicator.animation != null) {
            this._clickIndicator.animation.stop();
        }
        this._clickIndicator.animation = new TWEEN.Tween(this._clickIndicator.scale)
            .to({x: 0.1, y: 1, z: 0.1}, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()
            .onComplete(() => this._clickIndicator.visible = false);
    }

    update(secondFraction) {
        this._renderer.render(this._scene, this._camera);
        this._controls.update();
        this._map.update(secondFraction);
    }
}