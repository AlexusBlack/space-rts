// DONE: inherit from OrbitControls
// TODO: Setup camera to classic RTS position (on top with small angle, zoomable, goes flat when zooms close to object)
// TODO: Move camera on map with arrow keys and wasd
// TODO: Option to set camera boundaries (edge of map)
// TODO: Option to switch to object orbiting mode + reset
// TODO: Ability to switch between objects in orbiting mode with TAB key
// TODO: Camera view area via raycaster to show on mini-map
module.exports = function(THREE) {
    const OrbitControls = require('three-orbit-controls')(THREE);
    function RTSControls(object, domElement) {
        OrbitControls.call(this, object, domElement);
    }
    
    RTSControls.prototype = Object.create(OrbitControls.prototype);
    RTSControls.prototype.constructor = RTSControls;

    return RTSControls;
};


