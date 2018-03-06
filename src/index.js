import * as THREE from 'three';
import GLTF2Loader from 'three-gltf2-loader';
import TWEEN from '@tweenjs/tween.js';
import createjs from 'createjs-easeljs';
import RTSControls from './rts-controls';
import * as Skybox from './skybox';

GLTF2Loader(THREE);

// mini-map
const minimapStage = new createjs.Stage('mapCanvas');
const circle = new createjs.Shape();
circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 2);
circle.x = 100;
circle.y = 100;
minimapStage.addChild(circle);
minimapStage.update();

// Screen resolution
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
// Map size
const mapSize = 250;
const minimapSize = 200;

// Init of scene camera and rendrer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
// TODO: add antialiasing as an option in settings with OFF by default
// const renderer = new THREE.WebGLRenderer({ antialias: true });
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);

// Initializing Orbit controls
// TODO: Replace with custom RTS Controls
const boundaries = new THREE.Box2(
  new THREE.Vector2(0, 0),
  new THREE.Vector2(mapSize, mapSize)
);
const controls = new RTSControls(camera, renderer.domElement, scene, boundaries);
//controls.enablePan = false;
//controls.maxDistance = 25;

// skybox around map
const skyboxSize = mapSize > 1000 ? mapSize * 2 : 3000;
const skybox = Skybox.create('images/skyboxes/ame-nebula/purplenebula', skyboxSize);
skybox.position.x += skyboxSize / 4;
skybox.position.z += skyboxSize / 4;
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
helperGrid.position.x += helperGridSize / 2;
helperGrid.position.z += helperGridSize / 2;
scene.add(helperGrid);

// Directional lighting so that modes and their colors\materials are visible
// TODO: reserach types of light and select best one for RTS
var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.position.set( 5, 5, 2).normalize();
dirLight.lookAt(new THREE.Vector3(0, 0, 0));
scene.add( dirLight );

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
      animateShip(ship);
      resolve(ship);
    });
  });
}

function animateShip(ship) {
  const speed = 10;
  const distance = 100;
  const duration = distance / speed * 1000;
  new TWEEN.Tween(ship.position)
    .to({z: 100}, duration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .start();
}

// Some demo scene setup
addShipGLTF('scout');
addShipGLTF('miner').then((ship) => ship.position.x = -5);
addShipGLTF('builder').then((ship) => ship.position.x = 5);

function animate(timestamp) {

  // Starting animation loop again and again
  requestAnimationFrame(animate);
  TWEEN.update(timestamp);

  // control + render update
  controls.update();
	renderer.render(scene, camera);
}
animate();