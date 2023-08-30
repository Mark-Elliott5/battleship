import Player from './factories/Player';
import myEmitter from './emitter';

const gameFlow = (() => {
  const player1 = Player();
  const player2 = Player();

  const startGame = () => {
    myEmitter.emit('startGame');
  };

  const setBoard = () => {
    myEmitter.emit('setBoard');
    myEmitter.on('checkPlaceableX', (data) => {
      player1.checkPlaceableX(data.xCoord, data.yCoord);
    });
    myEmitter.on('checkPlaceableY', (data) => {
      player1.checkPlaceableY(data.xCoord, data.yCoord);
    });
    while (player1.ships.length) {
      console.log(`Ships remaining: ${player1.ships.length}`);
    }
    myEmitter.off('checkPlaceableX');
    myEmitter.off('checkPlaceableY');
    // player2.generateRandomBoard();
    startGame();
  };

  document.addEventListener('DOMContentLoaded', setBoard);
  return {};
})();

export default gameFlow;
