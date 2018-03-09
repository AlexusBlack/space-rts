import RTSGame from './RTSGame';
import RTSMap from './RTSMap';
import RTSUnitType from './RTSUnitType';
import RTSUnit from './RTSUnit';

(async () => {
    const map = new RTSMap();
    const scountUnitType = new RTSUnitType('scout');
    await scountUnitType.initialize();
    const scout_1 = new RTSUnit(scountUnitType);
    scout_1.position.x = 10;
    scout_1.position.z = 10;
    map.units.push(scout_1);

    const game = new RTSGame(map);
    game.start();
})();

