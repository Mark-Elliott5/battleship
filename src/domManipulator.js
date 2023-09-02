import myEmitter from './emitter';

const domManipulator = (() => {
  let orientation = 'x';
  const orientationButton = document.getElementById('orientation-button');
  orientationButton.addEventListener('click', () => {
    if (orientation === 'x') {
      orientation = 'y';
    } else {
      orientation = 'x';
    }
  });

  const playerAttackHandler = (data) => {
    myEmitter.emit('playerAttack', data.target);
  };

  const constructBoards = () => {
    const playerSquares = document.getElementById('player-board');
    const computerSquares = document.getElementById('computer-board');
    while (playerSquares.firstChild) {
      playerSquares.firstChild.remove();
    }
    while (computerSquares.firstChild) {
      computerSquares.firstChild.removeEventListener(
        'click',
        playerAttackHandler
      );
      computerSquares.firstChild.remove();
    }
    for (let i = 0; i < 100; i += 1) {
      const square = document.createElement('div');
      square.classList = 'board-square';
      square.dataset.xCoord = i % 10;
      square.dataset.yCoord = Math.floor(i / 10);
      playerSquares.append(square);
      const computerSquare = square.cloneNode(true);
      computerSquare.id = i;
      computerSquare.addEventListener('click', playerAttackHandler);
      computerSquares.append(computerSquare);
    }
  };

  const createSetupGrid = () => {
    const setupGrid = document.getElementById('setup-grid');
    // while (setupGrid.firstChild) {
    //   setupGrid.firstChild.removeEventListener('click');
    //   setupGrid.firstChild.remove();
    // }
    const checkPlaceable = (square) => {
      if (orientation === 'x') {
        myEmitter.emit('checkPlaceableX', square.dataset);
      } else {
        myEmitter.emit('checkPlaceableY', square.dataset);
      }
    };
    for (let i = 0; i < 100; i += 1) {
      const square = document.createElement('div');
      square.classList = 'setup-square';
      square.dataset.xCoord = i % 10;
      square.dataset.yCoord = Math.floor(i / 10);
      square.addEventListener('click', () => checkPlaceable(square));
      setupGrid.appendChild(square);
    }
  };

  const toggleSetupBoard = () => {
    const setupGridWrapper = document.getElementById('setup-grid-wrapper');
    setupGridWrapper.classList.toggle('hidden');
  };

  const endGame = (winner) => {
    myEmitter.off('gameOver');
    const endGameWrapper = document.getElementById('end-game-wrapper');
    const endGameText = document.getElementById('end-game-text');
    endGameText.textContent = winner;
    endGameWrapper.classList.toggle('hidden');
    const resetButton = document.getElementById('reset-game');
    resetButton.addEventListener('click', () => {
      myEmitter.emit('resetGame');
    });
  };

  const startGame = () => {
    // do stuff
    // toggleSetupBoard();
    // unpack data object (data.player1 and data.player2)
    toggleSetupBoard();
    constructBoards();
    myEmitter.on('gameOver', (data, result) => {
      endGame(result);
    });
  };

  const submitButton = document.getElementById('submit-board');
  submitButton.addEventListener('click', () => {
    myEmitter.emit('submitBoard');
  });

  myEmitter.on('setBoard', () => {
    createSetupGrid();
    toggleSetupBoard();
  });
  myEmitter.on('startGame', (data) => startGame(data));
  myEmitter.on('spaceTaken', () => {
    // spaceTaken() message
  });
  myEmitter.on('shipPlaced', () => {
    // ShipPlaced() message
  });
  myEmitter.on('allShipsPlaced', () => {
    // allShipsPlaced() message
  });

  myEmitter.on('miss', (square) => {
    // square background color = grey;
  });
  myEmitter.on('hit', (square) => {
    // square background color = red;
  });
  myEmitter.on('unavailable', (square) => {
    // display unavail message
  });
  myEmitter.on('sank', (square) => {
    // display sank message
  });
})();

export default domManipulator;