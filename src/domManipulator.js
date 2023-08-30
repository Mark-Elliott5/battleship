import myEmitter from './emitter';

const domManipulator = (() => {
  const displaySetupBoard = () => {
    // do stuff
  };

  const startGame = () => {
    // do stuff
  };
  myEmitter.on('setBoard', () => displaySetupBoard);
  myEmitter.on('startGame', () => startGame);
})();

export default domManipulator;
