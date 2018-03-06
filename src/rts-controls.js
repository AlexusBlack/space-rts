// DONE: inherit from OrbitControls
// DONE: Setup camera to classic RTS position (on top with small angle, zoomable, goes flat when zooms close to object)
// DONE: Move camera on map with arrow keys and wasd
// DONE: Method to move camera to specific 2d coordinates (x, z)
// DONE: Option to set camera boundaries (edge of map)
// TODO: Allow navigation with map dragging
// TODO: Camera view area via raycaster to show on mini-map
// TODO: Priority Low: Add simple orbiting with middle mouse button, but after it is release camera returns to standard position
// TODO: Priority Medium: Option to switch to object orbiting mode + reset
// TODO: Priority Medium: Ability to switch between objects in orbiting mode with TAB key
import * as THREE from 'three';
import keycode from 'keycode';

const OrbitControls = require('three-orbit-controls')(THREE);

/**
 * Controls for real time strategy
 * @param {THREE.Camera} camera To manipulate
 * @param {HTMLElement} domElement Element of renderer
 * @param {THREE.Scene} scene Scene to work with
 * @param {THREE.Box2} boundaries Limitations to camera movement, like map size, unlimited by default
 */
export default function RTSControls(camera, domElement, scene, boundaries) {
    const self = this;
    OrbitControls.call(this, camera, domElement);

    // Custom properties
    this.keyboardNavigation = true;
    this.navigationSpeed = 1;
    this._scene = scene;
    this._movement = {
        up: false,
        right: false,
        down: false,
        left: false
    };
    this.boundaries = boundaries || new THREE.Box2(
        new THREE.Vector2(-Infinity, -Infinity),
        new THREE.Vector2(Infinity, Infinity)
    );

    // default setup
    this.enablePan = false;
    this.enableRotate = false;
    this.enableZoom = false;
    this.maxDistance = 100;
    this.zoomSpeed = 0.5;

    // adding empty object as parent and target
    const targetObject = new THREE.Object3D();
    this.position = targetObject.position;
    targetObject.add(camera);
    scene.add(targetObject);

    // default position
    camera.position.y = 75;
    camera.position.z = 25;
    camera.rotation.x = -90 * Math.PI / 180;

    domElement.addEventListener('wheel', onMouseWheel, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    function onMouseWheel(event) {
        if(self.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        handleMouseWheel(event);
    }

    function onKeyDown(event) {
        if(self.enabled === false || self.keyboardNavigation == false) return;

        const keyCode = event.keyCode;
        handleKeyStateChange(keyCode, true);
    }

    function onKeyUp(event) {
        if(self.enabled === false || self.keyboardNavigation == false) return;

        const keyCode = event.keyCode;
        handleKeyStateChange(keyCode, false);
    }

    function handleMouseWheel(event) {
        const maxHeight = Math.sqrt(Math.pow(self.maxDistance, 2) - Math.pow(camera.position.z, 2));
        let newHeight = camera.position.y + event.deltaY * self.zoomSpeed;
        if(newHeight > maxHeight) newHeight = maxHeight;
        if(newHeight < 0) newHeight = 0;

        camera.position.y = newHeight;
        //console.log(camera.position.y, maxHeight);
    }

    function handleKeyStateChange(key, state) {
        switch (key) {
            case keycode.codes.up:
            case keycode.codes.w:
                self._movement.up = state;
                break;
            
            case keycode.codes.right:
            case keycode.codes.d:
                self._movement.right = state;
                break;
            
            case keycode.codes.down:
            case keycode.codes.s:
                self._movement.down = state;
                break;
            
            case keycode.codes.left:
            case keycode.codes.a:
                self._movement.left = state;
                break;
        }
    }

    const parentUpdate = this.update;
    /** 
     * This method need to be called in rendering loop
    */
    this.update = function() {
        parentUpdate();

        let deltaX = 0;
        let deltaZ = 0;

        if(self._movement.up) {
            deltaZ -= self.navigationSpeed;
        } 
        if(self._movement.down) {
            deltaZ += self.navigationSpeed;
        }
        if(self._movement.right) {
            deltaX += self.navigationSpeed;
        }
        if(self._movement.left) {
            deltaX -= self.navigationSpeed;
        }

        // Checking that we are not exceeding boundaries
        if(deltaX != 0) {
            const resultingX = targetObject.position.x + deltaX;
            if(resultingX < self.boundaries.min.x) {
                deltaX = Math.abs(self.boundaries.min.x - targetObject.position.x) * -1;
            } else if(resultingX > self.boundaries.max.x) {
                deltaX = Math.abs(self.boundaries.max.x - targetObject.position.x);
            }
        }

        if(deltaZ != 0) {
            const resultingZ = targetObject.position.z + deltaZ;
            if(resultingZ < self.boundaries.min.y) {
                deltaZ = Math.abs(self.boundaries.min.y - targetObject.position.z) * -1;
            } else if(resultingZ > self.boundaries.max.y) {
                deltaZ = Math.abs(self.boundaries.max.y - targetObject.position.z);
            }
        }

        targetObject.translateX(deltaX);
        targetObject.translateZ(deltaZ);
    };

    const parentDispose = this.dispose;
    /** 
     * Call this method to destroy control and free memory
    */
    this.dispose = function() {
        parentDispose();
        domElement.removeEventListener('wheel', onMouseWheel, false);
        document.removeEventListener('keydown', onKeyDown, false);
        document.removeEventListener('keyup', onKeyUp, false);
    };
}

RTSControls.prototype = Object.create(OrbitControls.prototype);
RTSControls.prototype.constructor = RTSControls;

