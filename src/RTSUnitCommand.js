import RTSUnitCommandType from './Enums/RTSUnitCommandType';

export default class RTSUnitCommand {
    /**
     * Creates new command for unit
     * @param {RTSUnitCommandType} type Type of the command
     */
    constructor(type) {
        this.type = type;
        this.destination = null;
        this.target = null;
        this.complete = false;
    }
}