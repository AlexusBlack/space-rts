import * as THREE from 'three';

export function create(path, size) {
    size = size || 500;
    const materialArray = [];
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}right.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}left.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}up.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}down.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}front.png`) }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(`${path}back.png`) }));
    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;

    const skyboxGeom = new THREE.CubeGeometry( size, size, size, 1, 1, 1 );
    const skybox = new THREE.Mesh( skyboxGeom, materialArray );

    return skybox;
};