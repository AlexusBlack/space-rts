import RTSGame from './RTSGame';

const map = {
    size: 250,
    skybox: 'ame-nebula'
};

const game = new RTSGame(map);
game.start();