import Player from './factories/Player';
import myEmitter from './emitter';

const gameFlow = (() => {
  let player1 = Player();
  let player2 = Player();

  const checkPlaceableXHandler = (data) => {
    const result = player1.checkPlaceableX(...data);
    // console.log(result);
    myEmitter.emit(`${result.event}`, result);
  };

  const checkPlaceableYHandler = (data) => {
    const result = player1.checkPlaceableY(...data);
    // console.log(result.event);
    myEmitter.emit(`${result.event}`, result);
  };

  const computerAttack = () => {
    const space = player1.generateRandomAttackCoord();
    const divId = space[1] * 10 + space[0];
    const result = player1.attack(...space);
    return [result, divId];
  };

  const playerAttackHandler = (square) => {
    const result = player2.attack(
      parseInt(square.dataset.xCoord, 10),
      parseInt(square.dataset.yCoord, 10)
    );
    if (result === 'unavailable') {
      return;
    }
    myEmitter.emit(`player-${result}`, square);
    if (result === 'gameOver') {
      endGame();
      return;
    }
    const computerMove = computerAttack();
    // console.log(result);
    // console.log(computerMove);
    myEmitter.emit(`computer-${computerMove[0]}`, computerMove[1]);
    if (computerMove[0] === 'gameOver') {
      endGame();
    }
  };

  const startGame = () => {
    myEmitter.off('checkPlaceableX', checkPlaceableXHandler);
    myEmitter.off('checkPlaceableY', checkPlaceableYHandler);
    myEmitter.off('submitBoard', startGame);
    player2.generateRandomBoard();
    myEmitter.emit('startGame', player1.board);
    myEmitter.on('playerAttack', playerAttackHandler);
  };

  const setBoard = () => {
    myEmitter.emit('setBoard');
    myEmitter.on('checkPlaceableX', checkPlaceableXHandler);
    myEmitter.on('checkPlaceableY', checkPlaceableYHandler);
    myEmitter.on('submitBoard', startGame);
  };

  const resetGame = () => {
    myEmitter.off('resetGame', resetGame);
    player1 = Player();
    player2 = Player();
    setBoard();
  };

  const endGame = () => {
    myEmitter.off('playerAttack', playerAttackHandler);
    myEmitter.on('resetGame', resetGame);
  };

  document.addEventListener('DOMContentLoaded', setBoard);
})();

export default gameFlow;
