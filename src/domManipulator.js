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

  const constructBoards = (board) => {
    const playerAttackHandler = (square) => {
      console.log('player attacks');
      square.target.removeEventListener('click', playerAttackHandler);
      myEmitter.emit('playerAttack', square.target);
    };
    const mouseEnterHandler = (square) => {
      square.target.classList.add('selected');
    };
    const mouseLeaveHandler = (square) => {
      square.target.classList.remove('selected');
    };
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
      computerSquares.firstChild.removeEventListener(
        'mouseenter',
        mouseEnterHandler
      );
      computerSquares.firstChild.removeEventListener(
        'mouseleave',
        mouseLeaveHandler
      );
      computerSquares.firstChild.remove();
    }
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
      square.classList = 'board-square';
      square.dataset.xCoord = i % 10;
      square.dataset.yCoord = Math.floor(i / 10);
      playerSquares.append(square);
      square.id = `player-square-${i}`;
      const computerSquare = square.cloneNode(true);
      computerSquare.id = `computer-square-${i}`;
      computerSquare.addEventListener('click', playerAttackHandler, {
        once: true,
      });
      computerSquare.addEventListener('mouseenter', mouseEnterHandler);
      computerSquare.addEventListener('mouseleave', mouseLeaveHandler);
      computerSquares.append(computerSquare);
      if (shipCoords.includes(i)) {
        square.classList.add('ship');
      }
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
    myEmitter.off('gameOver', endGame);
    const endGameWrapper = document.getElementById('end-game-wrapper');
    const endGameText = document.getElementById('end-game-text');
    endGameText.textContent = `You ${
      winner === 'player' ? 'won' : 'lost'
    } the game!`;
    endGameWrapper.classList.toggle('hidden');
    const resetButton = document.getElementById('reset-game');
    resetButton.addEventListener('click', () => {
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

    myEmitter.on('player-miss', missHandler);
    myEmitter.on('player-hit', hitHandler);
    // myEmitter.on('player-unavailable', (square) => {
    //   // display unavail message
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
    myEmitter.on('spaceTaken', () => {
      // spaceTaken() message
    });
    myEmitter.on('shipPlaced', () => {
      // ShipPlaced() message
    });
    myEmitter.on('allShipsPlaced', submitButtonHandler);
    createSetupGrid();
    toggleSetupBoard();
  };

  myEmitter.on('setBoard', setBoardHandler);
})();

export default domManipulator;
