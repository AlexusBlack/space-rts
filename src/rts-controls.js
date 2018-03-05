// DONE: inherit from OrbitControls
// TODO: Setup camera to classic RTS position (on top with small angle, zoomable, goes flat when zooms close to object)
// TODO: Move camera on map with arrow keys and wasd
// TODO: Method to move camera to specific 2d coordinates (x, z)
// TODO: Option to set camera boundaries (edge of map)
// TODO: Option to switch to object orbiting mode + reset
// TODO: Ability to switch between objects in orbiting mode with TAB key
// TODO: Camera view area via raycaster to show on mini-map
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);
export default function RTSControls(camera, domElement, scene) {
    OrbitControls.call(this, camera, domElement);

    // Custom properties
    this._scene = scene;

    // default setup
    this.enablePan = false;
    this.maxDistance = 25;

    // adding empty object as parent and target
    //const targetObject = new THREE. 

    // default position
    camera.position.y = 50;
    camera.rotation.x = -90 * Math.PI / 180;
}

RTSControls.prototype = Object.create(OrbitControls.prototype);
RTSControls.prototype.constructor = RTSControls;



