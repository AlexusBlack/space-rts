import * as THREE from 'three';
import EasyStar from 'easystarjs';
import RTSPathfinderTile from './RTSGridPathfinderTile';

export default class RTSPathfinder {
    constructor(map, density, movableTileTypes) {
        this._map = map;
        this.density = density;
        this._visualize = false;
        this._pathVisualizer = null;

        const grid = this._generatePathfindingGrid(this._map.size, density, movableTileTypes[0]);
        
        this._pathfinder = new EasyStar.js();
        this._pathfinder.setGrid(grid);
        this._pathfinder.setAcceptableTiles(movableTileTypes);
        this._pathfinder.enableDiagonals();
    }

    enableVisualization(pathVisualizer) {
        this._visualize = true;
        this._pathVisualizer = pathVisualizer;
    }
    disableVisualization() {
        this._visualize = false;
    }

    _generatePathfindingGrid(size, density, initialState) {
        const grid = [];
        const gridSize = size / density;
        for(var i = 0; i < gridSize; i++) {
            const line = [];
            for(var j = 0; j < gridSize; j++) {
                line.push(initialState);
            }
            grid.push(line);
        }
        return grid;
    }

    async calculatePath(mapSource, mapDestination) {
        const gridSource = this._mapToGrid(mapSource);
        const gridDestination = this._mapToGrid(mapDestination);
        const gridPath = await this._calculateGridPath(gridSource, gridDestination);
        const mapPath = this._gridPathToMapPath(gridPath);
        mapPath.push(mapDestination);

        if(this._visualize) {
            this._pathVisualizer.visualize(gridPath, mapPath);
        }

        return mapPath;
    }

    _calculateGridPath(gridSource, gridDestination) {
        return new Promise((resolve, reject) => {
            this._pathfinder.findPath(
                gridSource.x, gridSource.y, 
                gridDestination.x, gridDestination.y, 
                (path) => resolve(path)
            );
            this._pathfinder.calculate();
        });
    }

    _mapToGrid(vector) {
        return new RTSPathfinderTile(
            Math.round(vector.x / this.density),
            Math.round(vector.z / this.density)
        );
    }

    _gridToMap(tile) {
        return new THREE.Vector3(
            tile.x * this.density,
            0,
            tile.y * this.density
        );
    }

    _gridPathToMapPath(gridPath) {
        let mapPath = [];
        for(var gridPathItem of gridPath) {
            var mapPathItem = this._gridToMap(gridPathItem);
            mapPath.push(mapPathItem);
        }
        return mapPath;
    }
}