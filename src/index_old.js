import * as THREE from 'three';
import GLTF2Loader from 'three-gltf2-loader';
import TWEEN from '@tweenjs/tween.js';
import createjs from 'createjs-easeljs';
import EasyStar from 'easystarjs';
import RTSControls from './rts-controls';
import * as Skybox from './skybox';

GLTF2Loader(THREE);

var mousePosition = new THREE.Vector2();

// Screen resolution
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseClick(event) {
  mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);

  const intersects = raycaster.intersectObject(level);

  if(intersects.length > 0) {
    const vec = intersects[0].point;
    console.log(vec);

    // calculating pathfindingGrid position
    const rowStart = Math.round(ships[0].position.z / pathfindingDensity);
    const colStart = Math.round(ships[0].position.x / pathfindingDensity);

    // calculating pathfindingGrid position
    const row = Math.round(vec.z / pathfindingDensity);
    const col = Math.round(vec.x / pathfindingDensity);
    console.log(col, row);

    easystar.findPath(colStart, rowStart, col, row, function(path) {
      if (path === null) {
        console.log('Path was not found.');
      } else {
        console.log('Path was found.', path);

        sendShipByPath(ships[0], path);
      }
    });
    easystar.calculate();
  }
}

// Map size
const mapSize = 250;
const minimapSize = 200;
const minimapRelation = minimapSize / mapSize;

// mini-map
const minimapStage = new createjs.Stage('mapCanvas');
function minimapUpdate(ships) {
  for(var ship of ships) {
    ship.minimap.x = ship.position.x * minimapRelation;
    ship.minimap.y = ship.position.z * minimapRelation;
  }
  minimapStage.update();
}

// pathfinding
const easystar = new EasyStar.js();
const pathfindingDensity = 2;
function generatePathfindingGrid(size, density, initialState) {
  const grid = [];
  for(var i = 0; i < size / density; i++) {
    const line = [];
    for(var j = 0; j < size / density; j++) {
      line.push(initialState);
    }
    grid.push(line);
  }
  return grid;
}
const pathfindingGrid = generatePathfindingGrid(mapSize, pathfindingDensity, 0);
easystar.setGrid(pathfindingGrid);
easystar.setAcceptableTiles([0]);
easystar.enableDiagonals();


document.addEventListener( 'click', onDocumentMouseClick, false );

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
const raycaster = new THREE.Raycaster();
const levelGeometry = new THREE.PlaneGeometry(mapSize, mapSize, 4);
const levelMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.DoubleSide});
levelMaterial.visible = false;
const level = new THREE.Mesh( levelGeometry, levelMaterial );
level.position.x += mapSize / 2;
level.position.z += mapSize / 2;
level.rotation.x = Math.PI / 2;
scene.add(level);

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

function addShipToMinimap(ship) {
  const minimapCircle = new createjs.Shape();
  minimapCircle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 2);
  minimapCircle.x = ship.position.x * minimapRelation;
  minimapCircle.y = ship.position.z * minimapRelation;
  minimapStage.addChild(minimapCircle);
  ship.minimap = minimapCircle;
}

// Loads ships on map
// TODO: replace with unit system
var objectLoader = new THREE.ObjectLoader();
var ships = [];
// GLTF loader, we will go with it
var gltfLoader = new THREE.GLTFLoader();
function addShipGLTF(type) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(`models/gltf/${type}.gltf`, function(obj) {
      var ship = obj.scene;
      ship.speed = 10;
      ships.push(ship);
      scene.add(ship);
      //animateShip(ship);
      addShipToMinimap(ship);
      resolve(ship);
    });
  });
}

function animateShip(ship) {
  const speed = ship.speed;
  const distance = 100;
  const duration = distance / speed * 1000;
  new TWEEN.Tween(ship.position)
    .to({z: 100}, duration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .repeat(Infinity)
    .start();
}

function sendShipTo(ship, source, destination) {
  const distance = source.distanceTo(destination);
  const duration = distance / ship.speed * 1000;
  return new TWEEN.Tween(ship.position)
  .to({x: destination.x, z: destination.z}, duration)
  .easing(TWEEN.Easing.Linear.None);
}

function sendShipByPath(ship, path) {
  let firstAnimation = null;
  let lastAnimation = null;
  let source = ship.position;
  for(let pathItem of path) {
    const destination = new THREE.Vector3(pathItem.x * pathfindingDensity, 0, pathItem.y * pathfindingDensity);
    var animation = sendShipTo(ship, source, destination);
    source = destination;
    if(firstAnimation == null) {
      firstAnimation = animation;
    } else {
      lastAnimation.chain(animation);
    }
    lastAnimation = animation;
  }
  firstAnimation.start();
}

// Some demo scene setup
addShipGLTF('scout');//.then((ship) => ship.position.x = 10);
//addShipGLTF('miner').then((ship) => ship.position.x = 20);
//addShipGLTF('builder').then((ship) => ship.position.x = 30);

function animate(timestamp) {

  // Starting animation loop again and again
  requestAnimationFrame(animate);
  TWEEN.update(timestamp);

  // control + render update
  controls.update();
  minimapUpdate(ships);
	renderer.render(scene, camera);
}
animate();