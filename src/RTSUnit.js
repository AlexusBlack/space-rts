import RTSUnitType from './RTSUnitType';
import RTSUnitCommandType from './Enums/RTSUnitCommandType';
import UnitException from './Exceptions/UnitException';

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
        this._pathfinder = null;
    }

    setPathfinder(pathfinder) {
        this._pathfinder = pathfinder;
    }

    cancelCommand() {
        this._currentCommand = null;
    }

    async update() {
        if(this._currentCommand == null && this.commands.length > 0) {
            this._currentCommand = this.commands.pop();
            console.log('New Command: ', this._currentCommand);
            await this._setupCommand(this._currentCommand);
        }
        if(this._currentCommand != null) {
            
        }
    }

    async _setupCommand(command) {
        if(command.type == RTSUnitCommandType.Move) {
            await this._setupMoveCommand(command);
        }
    }

    async _setupMoveCommand(command) {
        if(this._pathfinder == null) new UnitException('Pathfinder required fro Move command');
        const path = await this._pathfinder.calculatePath(this.position, command.destination);
        this.command._path = path;
        console.log(path);
    }
}