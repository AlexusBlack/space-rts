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

        this.commands = [];
        this._currentCommand = null;
    }

    cancelCommand() {
        this._currentCommand = null;
    }

    update() {
        if(this._currentCommand == null && this.commands.length > 0) {
            this._currentCommand = this.commands.pop();
            console.log('New Command: ', this._currentCommand);
        }
        if(this._currentCommand != null) {
            
        }
    }
}