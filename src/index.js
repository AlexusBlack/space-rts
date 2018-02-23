import * as THREE from 'three';
import OrbitControls from './OrbitControls';
// import FBXLoader from './FBXLoader';
// import TDSLoader from './TDSLoader';
import * as Skybox from './skybox';

//console.log(FBXLoader);

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

//////////////
// CONTROLS //
//////////////

// move mouse and: left   click to rotate, 
//                 middle click to zoom, 
//                 right  click to pan
var controls = new OrbitControls( camera, renderer.domElement );

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
scene.add( dirLight.target );

// var ambLight = new THREE.AmbientLight( 0xffffff, 10 );
// ambLight.position.set( 0, 0, 1000).normalize();
// scene.add( ambLight );

function createCube() {
  var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  //var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xcc0000 } );
  var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xcc0000, side: THREE.DoubleSide } );
  return new THREE.Mesh( cubeGeometry, cubeMaterial );
}

// var cube = createCube();
// var cube2 = createCube();
// var cube3 = createCube();
// cube3.position.x = -2;
// cube2.position.x = 2;
// cube.add(cube2);
// cube.add(cube3);
// scene.add( cube );

// //create a blue LineBasicMaterial
// var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// var lineGeometry = new THREE.Geometry();
// lineGeometry.vertices.push(new THREE.Vector3( -2, 0, 0) );
// lineGeometry.vertices.push(new THREE.Vector3( 0, 2, 0) );
// lineGeometry.vertices.push(new THREE.Vector3( 2, 0, 0) );
// lineGeometry.vertices.push(new THREE.Vector3( 0, -2, 0) );
// lineGeometry.vertices.push(new THREE.Vector3( -2, 0, 0) );
// var line = new THREE.Line( lineGeometry, lineMaterial );
// scene.add( line );
// var loader = new THREE.TDSLoader( );
// loader.load( 'models/ships/akira.3ds', function ( object ) {

//   // object.traverse( function ( child ) {

//   //   if ( child instanceof THREE.Mesh ) {
//   //     console.log(child.material);
//   //     //child.material.normalMap = new THREE.MeshBasicMaterial({});
//   //   }

//   // } );
//   object.rotation.x = -Math.PI/2;
//   object.scale.set(0.05, 0.05, 0.05);
//   scene.add( object );

// });

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

addShip('spaceship-2');
addShip('spaceship-2-green').then((ship) => ship.position.x = -5);




camera.position.z = 5;
camera.position.x = 5;
camera.position.y = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

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
  // cube.rotation.x += 0.02;
  // cube.rotation.y += 0.02;
  for(var ship of ships) {
    ship.position.z = position;
  }
  controls.update();
	renderer.render( scene, camera );
}
animate();