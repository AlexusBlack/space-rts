import RTSUnitType from './RTSUnitType';

export default class RTSUnit {
    /**
     * Creates new unit
     * @param {RTSUnitType} type Type of the unit
     */
    constructor(type) {
        this.type = type;
        this._object = type.model.clone();
        this.position = this._object.position;
    }
}