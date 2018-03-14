import * as THREE from 'three';
import EasyStar from 'easystarjs';
import RTSPathfinderTile from './RTSGridPathfinderTile';

export default class RTSPathfinder {
    constructor(map, density, walkableTileTypes) {
        this._map = map;
        this._density = density;
        this._walkableTileTypes = walkableTileTypes;
        this._visualize = false;
        this._pathVisualizer = null;

        this._grid = this._generatePathfindingGrid(this._map.size, density, walkableTileTypes[0]);
        
        this._pathfinder = new EasyStar.js();
        this._pathfinder.setGrid(this._grid);
        this._pathfinder.setAcceptableTiles(walkableTileTypes);
        this._pathfinder.enableDiagonals();

        window.rtsGridPathfinder = this;
    }

    enableVisualization(pathVisualizer) {
        this._visualize = true;
        this._pathVisualizer = pathVisualizer;
    }

    disableVisualization() {
        this._visualize = false;
    }

    _isWalkable(gridSource, gridDestination) {
        const line = this._interpolate(gridSource.x, gridSource.y, gridDestination.x, gridDestination.y);
        
        let walkable = false;
        for (let j = 1; j < line.length; ++j) {
            let testCoord = line[j];

            if (!this._isWalkableAt(testCoord[0], testCoord[1])) {
                walkable = true;
                break;
            }
        }

        return walkable;
    }

    _isWalkableAt(x, y) {
        const tileType = this._grid[x, y];
        return this._walkableTileTypes.includes(tileType);
    }

    /**
     * Given the start and end coordinates, return all the coordinates lying
     * on the line formed by these coordinates, based on Bresenham's algorithm.
     * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
     * @param {number} x0 Start x coordinate
     * @param {number} y0 Start y coordinate
     * @param {number} x1 End x coordinate
     * @param {number} y1 End y coordinate
     * @return {Array<Array<number>>} The coordinates on the line
     */
    _interpolate(x0, y0, x1, y1) {
        var abs = Math.abs,
            line = [],
            sx, sy, dx, dy, err, e2;

        dx = abs(x1 - x0);
        dy = abs(y1 - y0);

        sx = (x0 < x1) ? 1 : -1;
        sy = (y0 < y1) ? 1 : -1;

        err = dx - dy;

        while (true) {
            line.push([x0, y0]);

            if (x0 === x1 && y0 === y1) {
                break;
            }
            
            e2 = 2 * err;
            if (e2 > -dy) {
                err = err - dy;
                x0 = x0 + sx;
            }
            if (e2 < dx) {
                err = err + dx;
                y0 = y0 + sy;
            }
        }

        return line;
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
            Math.round(vector.x / this._density),
            Math.round(vector.z / this._density)
        );
    }

    _gridToMap(tile) {
        return new THREE.Vector3(
            tile.x * this._density - this._density / 2,
            0,
            tile.y * this._density - this._density / 2
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