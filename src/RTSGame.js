/* Third party */
import * as THREE from 'three';

/* Types */
import SceneException from './Exceptions/SceneException';
import MapException from './Exceptions/MapException';
import GameState from './Enums/GameState';

/* Classes */
import RTSUI from './RTSUI';
import RTSScene from './RTSScene';

export default class RTSGame {
    constructor(map) {
        if(map == null) throw new MapException('Map is required for game');

        this.state = GameState.Stoped;

        this._players = [];
        this._map = map;

        this._scene = new RTSScene(map);
    }

    start() {
        this.state = GameState.Running;
        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    stop() {
        this.state = GameState.Stoped;
    }

    pause() {
        this.start = GameState.Paused;
    }

    update(timestamp) {
        if(this.state != GameState.Stoped && this.state != GameState.Paused) {
            requestAnimationFrame((timestamp) => this.update(timestamp));
        }

        this._scene.update();
    }

}