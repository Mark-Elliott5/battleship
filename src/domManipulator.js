import myEmitter from './emitter';

const domManipulator = (() => {
  const playerAttackHandler = (square) => {
    // console.log('player attacks');
    myEmitter.emit('playerAttack', square.target);
  };

  const constructBoards = (board) => {
    const playerSquares = document.getElementById('player-board');
    const computerSquares = document.getElementById('computer-board');
    playerSquares.replaceChildren();
    computerSquares.replaceChildren();
    const playerAlert = document.getElementById('player-alert');
    playerAlert.textContent = '';
    const computerAlert = document.getElementById('computer-alert');
    computerAlert.textContent = '';
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
    const orientationHandler = () => {
      if (orientation === 'X') {
        orientation = 'Y';
      } else {
        orientation = 'X';
      }
    };
    orientationButton.addEventListener('click', orientationHandler);
    const setupGrid = document.getElementById('setup-grid');
    setupGrid.replaceChildren();
    const checkPlaceable = (square) => {
      const { xCoord } = square.target.dataset;
      const { yCoord } = square.target.dataset;
      myEmitter.emit(`checkPlaceable${orientation}`, [
        parseInt(xCoord, 10),
        parseInt(yCoord, 10),
      ]);
    };
    for (let i = 0; i < 100; i += 1) {
      const square = document.createElement('div');
      square.classList = 'setup-square';
      square.dataset.xCoord = i % 10;
      square.dataset.yCoord = Math.floor(i / 10);
      square.id = `setup-${i}`;
      square.addEventListener('click', checkPlaceable);
      setupGrid.appendChild(square);
    }
  };

  const toggleSetupBoard = () => {
    const endGameWrapper = document.getElementById('end-game-wrapper');
    endGameWrapper.classList.add('hidden');
    const setupGridWrapper = document.getElementById('setup-grid-wrapper');
    setupGridWrapper.classList.toggle('hidden');
  };

  const missHandler = (id) => {
    if (typeof id === 'object') {
      const computerAlert = document.getElementById('computer-alert');
      computerAlert.textContent = 'You missed!';
      id.classList.add('miss');
      return;
    }
    const playerAlert = document.getElementById('player-alert');
    playerAlert.textContent = 'Computer missed!';
    const square = document.getElementById(`player-square-${id}`);
    square.classList.add('miss');
    // console.log(square);
  };
  const hitHandler = (id) => {
    if (typeof id === 'object') {
      const computerAlert = document.getElementById('computer-alert');
      computerAlert.textContent = 'You hit their ship!';
      id.classList.add('hit');
      return;
    }
    const playerAlert = document.getElementById('player-alert');
    playerAlert.textContent = 'Computer hit your ship!';
    const square = document.getElementById(`player-square-${id}`);
    square.classList.add('hit');
    // console.log(square);
  };
  // const unavailableHandler = (id) => {};
  const sankHandler = (id) => {
    hitHandler(id);
    if (typeof id === 'object') {
      const computerAlert = document.getElementById('computer-alert');
      computerAlert.textContent = 'You sank their ship!';
    }
    const playerAlert = document.getElementById('player-alert');
    playerAlert.textContent = 'Computer sank your ship!';
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
    myEmitter.off('player-sank', sankHandler);

    myEmitter.off('computer-miss', missHandler);
    myEmitter.off('computer-hit', hitHandler);
    // myEmitter.on('computer-unavailable', unavailableHandler);
    myEmitter.off('computer-sank', sankHandler);
    myEmitter.off('player-gameOver', playerWinHandler);
    myEmitter.off('computer-gameOver', computerWinHandler);
  };

  const endGame = (winner) => {
    removeGameEmitters();
    const computerSquares = document.querySelectorAll(
      '.computer-board-square:not([class*=" "])'
    );
    for (let i = 0; i < computerSquares.length; i += 1) {
      computerSquares[i].removeEventListener('click', playerAttackHandler);
    }
    const endGameWrapper = document.getElementById('end-game-wrapper');
    const endGameText = document.getElementById('end-game-text');
    endGameText.textContent = `You ${
      winner === 'player' ? 'won' : 'lost'
    } the game!`;
    endGameWrapper.classList.remove('hidden');
    const resetButton = document.getElementById('reset-game');
    const resetGameHandler = () => {
      // console.log('resetGame emitted');
      myEmitter.emit('resetGame');
    };
    resetButton.addEventListener('click', resetGameHandler);
  };

  const submitButton = document.getElementById('submit-board');
  submitButton.addEventListener('click', () => {
    // console.log('submitted board');
    myEmitter.emit('submitBoard');
  });

  const spaceTakenHandler = () => {
    // display space taken message
  };

  const shipPlacedHandler = (EventObj) => {
    // display all ships placed message
    const { xCoord } = EventObj;
    const { yCoord } = EventObj;
    const { orientation } = EventObj;
    const { length } = EventObj;
    for (let i = 0; i < length; i += 1) {
      let id;
      if (orientation === 'X') {
        id = xCoord + i + yCoord * 10;
      }
      if (orientation === 'Y') {
        id = xCoord + (i + yCoord) * 10;
      }
      const setupSquare = document.getElementById(`setup-${id}`);
      setupSquare.classList.add('ship');
    }
  };

  const submitButtonHandler = (EventObj) => {
    shipPlacedHandler(EventObj);
    submitButton.disabled = false;
    myEmitter.off('allShipsPlaced', submitButtonHandler);
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
    myEmitter.on('player-sank', sankHandler);

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
