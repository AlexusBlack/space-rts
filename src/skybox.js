import * as THREE from 'three';

export function create(path, size) {
    size = size || 500;
    const materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}_right.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}_left.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}_up.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}_down.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}_front.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}_back.png`) }));
    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;

    const skyboxGeom = new THREE.CubeGeometry( size, size, size, 1, 1, 1 );
    const skybox = new THREE.Mesh( skyboxGeom, materialArray );

    return skybox;
};