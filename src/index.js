import * as THREE from 'three';
window.THREE = THREE;
import RTSGame from './RTSGame';
import RTSMap from './RTSMap';
import RTSUnitType from './RTSUnitType';
import RTSUnit from './RTSUnit';
import RTSUnitCommand from './RTSUnitCommand';
import RTSUnitCommandType from './Enums/RTSUnitCommandType';

(async () => {
    const map = new RTSMap();
    const scountUnitType = new RTSUnitType('scout');
    await scountUnitType.initialize();

    const scout_1 = new RTSUnit(scountUnitType);
    scout_1.position.x = 30;
    scout_1.position.z = 30;
    map.units.push(scout_1);

    const scout_2 = new RTSUnit(scountUnitType);
    scout_2.position.x = 20;
    scout_2.position.z = 10;
    map.units.push(scout_2);

    // window.scout1 = scout_1;
    
    //scout_1.moveOrigin(new THREE.Vector3(10,0,0));
    // window.scout2 = scout_2;
    // console.log(scout_2);

    // const command = new RTSUnitCommand(RTSUnitCommandType.Move);
    // command.destination = new THREE.Vector3(150, 0, 15);
    // scout_1.commands.push(command);

    // const command2 = new RTSUnitCommand(RTSUnitCommandType.Move);
    // command2.destination = new THREE.Vector3(10, 0, 150);
    // scout_1.commands.push(command2);

    const game = new RTSGame(map);
    game.start();
})();

