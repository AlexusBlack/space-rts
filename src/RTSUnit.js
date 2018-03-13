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

        this._pointOfOrigin = new THREE.Object3D();
        this._model = type.model.clone();
        this._pointOfOrigin.add(this._model);
        this._object = this._pointOfOrigin;
        this.position = this._object.position;
        this.rotation = this._object.rotation;

        this.commands = [];
        this._currentCommand = null;
        this._pathfinder = null;

    }

    setPathfinder(pathfinder) {
        this._pathfinder = pathfinder;
    }

    moveOrigin(delta) {
        this._pointOfOrigin.position.add(delta);
        this._model.position.sub(delta);
    }

    resetOrigin() {
        this._model.getWorldPosition(this._pointOfOrigin.position);
        this._model.position.set(0,0,0);
    }

    cancelCommand() {
        this._currentCommand = null;
    }

    async update(secondFraction) {

        //this.rotation.y += this.type.angularSpeed * secondFraction;

        if(this._currentCommand != null && this._currentCommand.setupFinished) {
            if(this._currentCommand.complete) {
                this._currentCommand = null;
                console.log('Command complete');
            } else {
                this._executeCommand(this._currentCommand, secondFraction);
            }
        } else if(this._currentCommand == null && this.commands.length > 0) {
            this._currentCommand = this.commands.shift();
            console.log('New Command: ', this._currentCommand);
            await this._setupCommand(this._currentCommand);
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
        command.setupFinished = true;
    }

    _executeCommand(command, secondFraction) {
        if(command.type == RTSUnitCommandType.Move) {
            this._executeMoveCommand(command, secondFraction);
        }
    }

    _executeMoveCommand(command, secondFraction) {
        if(command._path.length > 0) {
            const targetPosition = command._path[0];
            this._object.lookAt(targetPosition);
            // console.log(targetPosition);
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