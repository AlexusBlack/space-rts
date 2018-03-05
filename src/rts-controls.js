// DONE: inherit from OrbitControls
// DONE: Setup camera to classic RTS position (on top with small angle, zoomable, goes flat when zooms close to object)
// TODO: Move camera on map with arrow keys and wasd
// TODO: Method to move camera to specific 2d coordinates (x, z)
// TODO: Option to set camera boundaries (edge of map)
// TODO: Add simple orbiting with middle mouse button, but after it is release camera returns to standard position
// TODO: Option to switch to object orbiting mode + reset
// TODO: Ability to switch between objects in orbiting mode with TAB key
// TODO: Camera view area via raycaster to show on mini-map
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);
export default function RTSControls(camera, domElement, scene) {
    const self = this;
    OrbitControls.call(this, camera, domElement);

    // Custom properties
    this._scene = scene;

    // default setup
    this.enablePan = false;
    this.enableRotate = false;
    this.enableZoom = false;
    this.maxDistance = 100;
    this.zoomSpeed = 0.5;

    // adding empty object as parent and target
    const targetObject = new THREE.Object3D();
    targetObject.add(camera);
    scene.add(targetObject);

    // default position
    camera.position.y = 75;
    camera.position.z = 25;
    camera.rotation.x = -90 * Math.PI / 180;

    domElement.addEventListener('wheel', onMouseWheel, false);

    function onMouseWheel(event) {
        if(this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        handleMouseWheel(event);
    }

    function handleMouseWheel(event) {
        const maxHeight = Math.sqrt(Math.pow(self.maxDistance, 2) - Math.pow(camera.position.z, 2));
        let newHeight = camera.position.y + event.deltaY * self.zoomSpeed;
        if(newHeight > maxHeight) newHeight = maxHeight;
        if(newHeight < 0) newHeight = 0;

        camera.position.y = newHeight;
        //console.log(camera.position.y, maxHeight);
    }

    const parentDispose = this.dispose;
    this.dispose = function() {
        parentDispose();
        domElement.removeEventListener('wheel', onMouseWheel, false);
    }
}

RTSControls.prototype = Object.create(OrbitControls.prototype);
RTSControls.prototype.constructor = RTSControls;

