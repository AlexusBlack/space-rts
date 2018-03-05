import * as THREE from 'three';
import GLTF2Loader from 'three-gltf2-loader';
const OrbitControls = require('three-orbit-controls')(THREE)
import * as Skybox from './skybox';

GLTF2Loader(THREE);

// Screen resolution
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
// Map size
const mapSize = 1500;

// Init of scene camera and rendrer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);

// Initializing Orbit controls
// TODO: Replace with custom RTS Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.maxDistance = 25;

// skybox around map
const skybox = Skybox.create('images/skyboxes/ame-nebula/purplenebula', mapSize);
scene.add(skybox);

// Axis helper at 0
// TODO: remove from later version
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Helper grid for navigation and edge of map
// TODO: balance color
// TODO: make togable
const helperGridSize = mapSize;
const helperGrid = new THREE.GridHelper(helperGridSize, helperGridSize/10, new THREE.Color(0x333333), new THREE.Color(0x333333));
scene.add(helperGrid);

// Directional lighting so that modes and their colors\materials are visible
// TODO: reserach types of light and select best one for RTS
var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.position.set( 5, 5, 2).normalize();
dirLight.lookAt(new THREE.Vector3(0, 0, 0));
scene.add( dirLight );

// TODO: move to RTS Controls
document.addEventListener('keydown', function(event) {
  const movementSpeed = 0.5;
  event = event || window.event;
  const keyCode = event.keyCode;
  switch(keyCode) {
    case 37: // Left arrow key
    case 65: // Left arrow key
      camera.position.x -= movementSpeed;
    break;

    case 38: // Up arrow key
    case 87: // Up arrow key
      camera.position.z -= movementSpeed;
    break;

    case 39: // Right arrow key
    case 68: // Right arrow key
      camera.position.x += movementSpeed;
    break;

    case 40: // Down arrow key
    case 83: // Down arrow key
      camera.position.z += movementSpeed;
    break;
  }
  console.log(camera.position.x, camera.position.y, camera.position.z);
}, false);

// Loads ships on map
// TODO: replace with unit system
var objectLoader = new THREE.ObjectLoader();
var ships = [];
// JSON loader
function addShip(type) {
  return new Promise((resolve, reject) => {
    objectLoader.load(`models/json/${type}.json`, function ( obj ) {
      ships.push(obj);
      scene.add(obj);
      resolve(obj);
    });
  });
}
// GLTF loader, we will go with it
var gltfLoader = new THREE.GLTFLoader();
function addShipGLTF(type) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(`models/gltf/${type}.gltf`, function(obj) {
      var ship = obj.scene;
      ships.push(ship);
      scene.add(ship);
      resolve(ship);
    });
  });
}

// Some demo scene setup
addShipGLTF('scout').then((ship) => {
  //controls.target = ship.position; 
  ship.add(camera);
});
addShipGLTF('miner').then((ship) => ship.position.x = -5);
addShipGLTF('builder').then((ship) => ship.position.x = 5);

//camera.position.z = 5;
//camera.position.x = 5;
camera.position.y = 50;
camera.rotation.x = -90 * Math.PI / 180;

// Simple animation system
// TODO: replace with unit animation system module
let startTime = null;
const speed = 10;
const distance = 100;
const duration = distance / speed * 1000;
function animate(timestamp) {
  if(startTime == null) startTime = timestamp;
  let time = timestamp - startTime;
  let progress = time / duration;
  let position = distance * progress;
  if(progress > 1) startTime = timestamp;

  for(var ship of ships) {
    ship.position.z = position;
  }

  // Starting animation loop again and again
  requestAnimationFrame( animate );

  // control + render update
  controls.update();
	renderer.render( scene, camera );
}
animate();