import * as THREE from 'three';
import OrbitControls from './OrbitControls';
import * as Skybox from './skybox';


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

var dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 0, 0, 5 ).normalize();
scene.add( dirLight );
scene.add( dirLight.target );

function createCube() {
  var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  //var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xcc0000 } );
  var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xcc0000, side: THREE.DoubleSide } );
  return new THREE.Mesh( cubeGeometry, cubeMaterial );
}

var cube = createCube();
var cube2 = createCube();
var cube3 = createCube();
cube3.position.x = -2;
cube2.position.x = 2;
cube.add(cube2);
cube.add(cube3);
scene.add( cube );

//create a blue LineBasicMaterial
var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(new THREE.Vector3( -2, 0, 0) );
lineGeometry.vertices.push(new THREE.Vector3( 0, 2, 0) );
lineGeometry.vertices.push(new THREE.Vector3( 2, 0, 0) );
lineGeometry.vertices.push(new THREE.Vector3( 0, -2, 0) );
lineGeometry.vertices.push(new THREE.Vector3( -2, 0, 0) );
var line = new THREE.Line( lineGeometry, lineMaterial );
scene.add( line );

camera.position.z = 5;
camera.position.x = 5;
camera.position.y = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

function animate() {
	requestAnimationFrame( animate );
  cube.rotation.x += 0.02;
  cube.rotation.y += 0.02;
  controls.update();
	renderer.render( scene, camera );
}
animate();