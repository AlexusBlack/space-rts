/* Third party */
import * as THREE from 'three';

/* Types */
import SceneException from './Exceptions/SceneException';
import MapException from './Exceptions/MapException';
import GameState from './Enums/GameState';
import RTSUnitCommandType from './Enums/RTSUnitCommandType';

/* Classes */
import RTSUI from './RTSUI';
import RTSScene from './RTSScene';
import RTSUnitCommand from './RTSUnitCommand';

export default class RTSGame {
    constructor(map) {
        if(map == null) throw new MapException('Map is required for game');

        this.state = GameState.Stoped;

        this._players = [];
        this._map = map;

        this._scene = new RTSScene(map);
        this._scene.on('map-click', position => {
            console.log(position);
            const unit = map.units[0];
            unit.cancelCommand();
            const command = new RTSUnitCommand(RTSUnitCommandType.Move);
            command.destination = position;
            unit.commands.push(command);
        });

        this._lastFrameTime = null;
    }

    start() {
        this.state = GameState.Running;
        this._lastFrameTime = window.performance.now();
        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    stop() {
        this.state = GameState.Stoped;
    }

    pause() {
        this.start = GameState.Paused;
    }

    update(timestamp) {
        const thisFrameTime = window.performance.now();
        if(this.state != GameState.Stoped && this.state != GameState.Paused) {
            requestAnimationFrame((timestamp) => this.update(timestamp));
        }

        const secondFraction = (thisFrameTime - this._lastFrameTime) / 1000;
        this._lastFrameTime = thisFrameTime;
        //console.log(secondFraction);
        this._scene.update(secondFraction);
    }

}