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

    async update(secondFraction) {
        if(this._currentCommand == null && this.commands.length > 0) {
            this._currentCommand = this.commands.shift();
            console.log('New Command: ', this._currentCommand);
            await this._setupCommand(this._currentCommand);
        }
        if(this._currentCommand != null) {
            if(this._currentCommand.complete) {
                this._currentCommand = null;
                console.log('Command complete');
            } else {
                this._executeCommand(this._currentCommand, secondFraction);
            }
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
        command._path = path;
        console.log(path);
    }

    _executeCommand(command, secondFraction) {
        if(command.type == RTSUnitCommandType.Move) {
            this._executeMoveCommand(command, secondFraction);
        }
    }

    _executeMoveCommand(command, secondFraction) {
        if(command._path.length > 0) {
            const targetPosition = command._path[0];
            const vel = targetPosition.clone().sub(this.position);

            if (vel.lengthSq() > 0.05 * 0.05) {
                vel.normalize();
                // Mve player to target
                this.position.add(vel.multiplyScalar(secondFraction * this.type.speed));
            }
            else {
                // Remove node from the path we calculated
                command._path.shift();
            }
        } else {
            command.complete = true;
        }
    }
}