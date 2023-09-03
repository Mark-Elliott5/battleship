import myEmitter from './emitter';

const domManipulator = (() => {
  const constructBoards = (board) => {
    const playerAttackHandler = (square) => {
      console.log('player attacks');
      myEmitter.emit('playerAttack', square.target);
    };
    const playerSquares = document.getElementById('player-board');
    const computerSquares = document.getElementById('computer-board');
    playerSquares.replaceChildren();
    computerSquares.replaceChildren();
    const shipCoords = [];
    for (let y = 0; y < board.length; y += 1) {
      for (let x = 0; x < board[y].length; x += 1) {
        if (typeof board[y][x] === 'object') {
          const squareID = x + y * 10;
          shipCoords.push(squareID);
        }
      }
    }
    for (let i = 0; i < 100; i += 1) {
      const square = document.createElement('div');
      square.classList = 'player-board-square';
      square.dataset.xCoord = i % 10;
      square.dataset.yCoord = Math.floor(i / 10);
      playerSquares.append(square);
      square.id = `player-square-${i}`;
      const computerSquare = square.cloneNode(true);
      computerSquare.classList = 'computer-board-square';
      computerSquare.id = `computer-square-${i}`;
      computerSquare.addEventListener('click', playerAttackHandler, {
        once: true,
      });
      computerSquares.append(computerSquare);
      if (shipCoords.includes(i)) {
        square.classList.add('ship');
      }
    }
  };

  const createSetupGrid = () => {
    let orientation = 'X';
    const orientationButton = document.getElementById('orientation-button');
    orientationButton.addEventListener('click', () => {
      if (orientation === 'X') {
        orientation = 'Y';
      } else {
        orientation = 'X';
      }
    });
    const setupGrid = document.getElementById('setup-grid');
    // while (setupGrid.firstChild) {
    //   setupGrid.firstChild.removeEventListener('click');
    //   setupGrid.firstChild.remove();
    // }
    const checkPlaceable = (square) => {
      const { xCoord } = square.target.dataset;
      const { yCoord } = square.target.dataset;
      myEmitter.emit(`checkPlaceable${orientation}`, [
        parseInt(xCoord, 10),
        parseInt(yCoord, 10),
      ]);
      // if (orientation === 'x') {
      //   myEmitter.emit('checkPlaceableX', square.dataset);
      // } else {
      //   myEmitter.emit('checkPlaceableY', square.dataset);
      // }
    };
    if (!setupGrid.firstChild) {
      for (let i = 0; i < 100; i += 1) {
        const square = document.createElement('div');
        square.classList = 'setup-square';
        square.dataset.xCoord = i % 10;
        square.dataset.yCoord = Math.floor(i / 10);
        square.addEventListener('click', checkPlaceable);
        setupGrid.appendChild(square);
      }
    }
  };

  const toggleSetupBoard = () => {
    const setupGridWrapper = document.getElementById('setup-grid-wrapper');
    setupGridWrapper.classList.toggle('hidden');
  };

  const missHandler = (id) => {
    if (typeof id === 'object') {
      id.classList.add('miss');
      return;
    }
    const square = document.getElementById(`player-square-${id}`);
    square.classList.add('miss');
    console.log(square);
  };
  const hitHandler = (id) => {
    if (typeof id === 'object') {
      id.classList.add('hit');
      return;
    }
    const square = document.getElementById(`player-square-${id}`);
    square.classList.add('hit');
    console.log(square);
  };
  // const unavailableHandler = (id) => {};
  const sankHandler = (id) => {
    hitHandler(id);
    // alert sank message
  };
  const playerWinHandler = (id) => {
    sankHandler(id);
    endGame('player');
  };
  const computerWinHandler = (id) => {
    sankHandler(id);
    endGame('computer');
  };

  const removeGameEmitters = () => {
    myEmitter.off('player-miss', missHandler);
    myEmitter.off('player-hit', hitHandler);
    // myEmitter.on('player-unavailable', (square) => {
    // display unavail message
    // });
    myEmitter.off('player-sank', (square) => {
      // display sank message
    });

    myEmitter.off('computer-miss', missHandler);
    myEmitter.off('computer-hit', hitHandler);
    // myEmitter.on('computer-unavailable', unavailableHandler);
    myEmitter.off('computer-sank', sankHandler);
    myEmitter.off('player-gameOver', playerWinHandler);
    myEmitter.off('computer-gameOver', computerWinHandler);
  };

  const endGame = (winner) => {
    removeGameEmitters();
    const endGameWrapper = document.getElementById('end-game-wrapper');
    const endGameText = document.getElementById('end-game-text');
    endGameText.textContent = `You ${
      winner === 'player' ? 'won' : 'lost'
    } the game!`;
    endGameWrapper.classList.toggle('hidden');
    const resetButton = document.getElementById('reset-game');
    resetButton.addEventListener('click', () => {
      console.log('resetGame emitted');
      myEmitter.emit('resetGame');
    });
  };

  const submitButton = document.getElementById('submit-board');
  submitButton.addEventListener('click', () => {
    console.log('submitted board');
    myEmitter.emit('submitBoard');
  });

  const submitButtonHandler = () => {
    submitButton.disabled = false;
    myEmitter.off('allShipsPlaced', submitButtonHandler);
  };

  const spaceTakenHandler = () => {
    // display space taken message
  };

  const shipPlacedHandler = () => {
    // display all ships placed message
  };

  const startGame = (board) => {
    submitButton.disabled = true;
    // do stuff
    // toggleSetupBoard();
    // unpack data object (data.player1 and data.player2)
    myEmitter.off('startGame', startGame);
    // myEmitter.off('spaceTaken');
    // myEmitter.off('shipPlaced');
    // myEmitter.off('allShipsPlaced');
    toggleSetupBoard();
    constructBoards(board);

    myEmitter.on('player-miss', missHandler);
    myEmitter.on('player-hit', hitHandler);
    // myEmitter.on('player-unavailable', (square) => {
    // display unavail message
    // });
    myEmitter.on('player-sank', (square) => {
      // display sank message
    });

    myEmitter.on('computer-miss', missHandler);
    myEmitter.on('computer-hit', hitHandler);
    // myEmitter.on('computer-unavailable', unavailableHandler);
    myEmitter.on('computer-sank', sankHandler);
    myEmitter.on('player-gameOver', playerWinHandler);
    myEmitter.on('computer-gameOver', computerWinHandler);
  };

  const setBoardHandler = () => {
    myEmitter.on('startGame', startGame);
    myEmitter.on('spaceTaken', spaceTakenHandler);
    myEmitter.on('shipPlaced', shipPlacedHandler);
    myEmitter.on('allShipsPlaced', submitButtonHandler);
    createSetupGrid();
    toggleSetupBoard();
  };

  myEmitter.on('setBoard', setBoardHandler);
})();

export default domManipulator;
