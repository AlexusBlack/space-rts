import * as THREE from 'three';
import GLTF2Loader from 'three-gltf2-loader';
import OrbitControls from './OrbitControls';
import * as Skybox from './skybox';

GLTF2Loader(THREE);

const resolution = {
  x: 800,
  y: 600
};
const mapSize = 1500;

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, resolution.x / resolution.y, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( resolution.x, resolution.y );
document.body.appendChild( renderer.domElement );

// var fbxLoader = new THREE.FBXLoader()

//////////////
// CONTROLS //
//////////////

// move mouse and: left   click to rotate, 
//                 middle click to zoom, 
//                 right  click to pan
var controls = new OrbitControls( camera, renderer.domElement );
// controls.maxDistance = 25;
//console.log(controls.target);

var axes = new THREE.AxesHelper(100);
scene.add(axes);
const skybox = Skybox.create('images/skyboxes/ame-nebula/purplenebula', mapSize);
scene.add( skybox );

const helperGridSize = mapSize;
const helperGrid = new THREE.GridHelper(helperGridSize, helperGridSize/10, new THREE.Color(0x333333), new THREE.Color(0x333333));
//helperGrid.position.set(0,0,0 );
//helperGrid.rotation.x = Math.PI/2;
scene.add(helperGrid);

var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.position.set( 5, 5, 2).normalize();
dirLight.lookAt(new THREE.Vector3(0, 0, 0));
scene.add( dirLight );

function createCube() {
  var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  //var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xcc0000 } );
  var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xcc0000, side: THREE.DoubleSide } );
  return new THREE.Mesh( cubeGeometry, cubeMaterial );
}

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

var objectLoader = new THREE.ObjectLoader();
var ships = [];
function addShip(type) {
  return new Promise((resolve, reject) => {
    objectLoader.load(`models/json/${type}.json`, function ( obj ) {
      ships.push(obj);
      scene.add(obj);
      resolve(obj);
    });
  });
}
var gltfLoader = new THREE.GLTFLoader();
function addShipGLTF(type) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(`models/gltf/${type}.gltf`, function ( obj ) {
      var ship = obj.scene;
      ships.push(ship);
      scene.add(ship);
      resolve(ship);
    });
  });
}

addShipGLTF('scout').then((ship) => controls.target = ship.position);
addShipGLTF('miner').then((ship) => ship.position.x = -5);
addShipGLTF('builder').then((ship) => ship.position.x = 5);

camera.position.z = 5;
camera.position.x = 5;
camera.position.y = 50;
camera.rotation.x = -90 * Math.PI / 180;

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

	requestAnimationFrame( animate );

  for(var ship of ships) {
    ship.position.z = position;
  }

  // controls.update();
	renderer.render( scene, camera );
}
animate();