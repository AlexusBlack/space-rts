import * as THREE from 'three';
import GLTF2Loader from 'three-gltf2-loader';
GLTF2Loader(THREE);

const gltfLoader = new THREE.GLTFLoader();
export default gltfLoader;