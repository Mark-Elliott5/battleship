import Player from './factories/Player';
import myEmitter from './emitter';

const gameFlow = (() => {
  let player1 = Player();
  let player2 = Player();

  // const generateRandomCoord = () => {
  //   // generate random coords for comp to attack
  //   // return [x,y];
  //   const coords = [];
  //   for (let y = 0; y < player1.board.length; y += 1) {
  //     const yArray = player1.board[y];
  //     for (let x = 0; x < yArray.length; x += 1) {
  //       const space = yArray[x];
  //       if (space !== 1 && space !== 2) {
  //         const coord = [x, y];
  //         coords.push(coord);
  //       }
  //     }
  //   }
  //   const result = coords[Math.floor(Math.random() * coords.length)];
  //   return result;
  // };

  const checkPlaceableXHandler = (data) => {
    const result = player1.checkPlaceableX(...data);
    console.log(result);
    myEmitter.emit(`${result}`);
  };

  const checkPlaceableYHandler = (data) => {
    const result = player1.checkPlaceableY(...data);
    console.log(result);
    myEmitter.emit(`${result}`);
  };

  const computerAttack = () => {
    const space = player1.generateRandomAttackCoord();
    const divId = space[1] * 10 + space[0];
    const result = player1.attack(...space);
    // myEmitter.emit(
    //   `${result}`,
    //   divId,
    //   `${result === 'gameOver' ? 'You lost!' : undefined}`
    // );
    return [result, divId];
  };

  const playerAttackHandler = (square) => {
    const result = player2.attack(
      parseInt(square.dataset.xCoord, 10),
      parseInt(square.dataset.yCoord, 10)
    );
    myEmitter.emit(`player-${result}`, square);
    if (result === 'gameOver') {
      endGame();
      return;
    }
    const computerMove = computerAttack();
    console.log(computerMove);
    myEmitter.emit(`computer-${computerMove[0]}`, computerMove[1]);
    if (computerMove[0] === 'gameOver') {
      endGame();
    }
  };

  const startGame = () => {
    myEmitter.off('checkPlaceableX', checkPlaceableXHandler);
    myEmitter.off('checkPlaceableY', checkPlaceableYHandler);
    myEmitter.off('submitBoard', startGame);
    myEmitter.emit('startGame', player1.board);
    myEmitter.on('playerAttack', playerAttackHandler);
  };

  const setBoard = () => {
    myEmitter.emit('setBoard');
    myEmitter.on('checkPlaceableX', checkPlaceableXHandler);
    myEmitter.on('checkPlaceableY', checkPlaceableYHandler);
    myEmitter.on(
      'submitBoard',
      // player2.generateRandomBoard();
      // emit start game signal
      // startGame();
      startGame
    );
  };

  const resetGame = () => {
    // myEmitter.off('resetGame', resetGame);
    player1 = Player();
    player2 = Player();
    setBoard();
  };

  const endGame = () => {
    myEmitter.off('playerAttack', playerAttackHandler);
    // myEmitter.emit('endGame');
    myEmitter.on('resetGame', resetGame);
  };

  document.addEventListener('DOMContentLoaded', setBoard);
})();

export default gameFlow;
