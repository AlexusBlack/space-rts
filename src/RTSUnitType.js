import * as THREE from 'three';
import GLTFLoader from './Libraries/GLTFLoader';
const pathToModels = require.context('./models/glb/', true);

/** 
 * @namespace 
 * @property {string} modelName Name of model used for type
 * @property {THREE.Object3D} model Model associate with type
 */
export default class RTSUnitType {
    /**
     * Creates new unit type
     * @param {String} modelName File name
     */
    constructor(modelName) {
        this.modelName = modelName;
        this.speed = 5;
    }

    /** 
     * This method must be called to initialize unit type before usage
     */
    async initialize() {
        this.model = await this._loadModel(this.modelName);
    }

    _loadModel(modelName) {
        return new Promise((resolve, reject) => {
            GLTFLoader.load(pathToModels(`./${modelName}.glb`, true), function(obj) {
                resolve(obj.scene);
            });
        });
    }
}