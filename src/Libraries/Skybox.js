import * as THREE from 'three';
const pathToSkyboxes = require.context('../images/skyboxes/', true);

export function create(name, size) {
    size = size || 500;
    const materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(pathToSkyboxes(`./${name}/right.png`)) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(pathToSkyboxes(`./${name}/left.png`)) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(pathToSkyboxes(`./${name}/up.png`)) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(pathToSkyboxes(`./${name}/down.png`)) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(pathToSkyboxes(`./${name}/front.png`)) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(pathToSkyboxes(`./${name}/back.png`)) }));
    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;

    const skyboxGeom = new THREE.CubeGeometry( size, size, size, 1, 1, 1 );
    const skybox = new THREE.Mesh( skyboxGeom, materialArray );

    return skybox;
};