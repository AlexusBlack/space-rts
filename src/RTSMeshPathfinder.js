import * as THREE from 'three';
const Pathfinder = require('imports-loader?THREE=three!three-pathfinding');

export default class RTSPathfinder {
    constructor(map) {
        this._map = map;
        this._zone = 'map';
        
        this._pathfinder = new Pathfinder();
        this._pathfinder.setZoneData(this._zone, Pathfinder.createZone(map.level.geometry));
    }

    async calculatePath(mapSource, mapDestination) {
        const groupID = this._pathfinder.getGroup(this._zone, mapSource);
        const path = this._pathfinder.findPath(mapSource, mapDestination, this._zone, groupID);
        if(path == null) return [mapDestination];
        console.log('New path: ', path);
        return path;
    }

    
}