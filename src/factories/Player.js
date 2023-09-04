import Gameboard from './Gameboard';
import Ship from './Ship';

const Player = () => {
  const board = Gameboard();
  const ships = Array.from([2, 3, 3, 4, 5], (length) => Ship(length));
  let shipsSank = 0;

  const EventObj = (event, xCoord, yCoord, orientation, length) => ({
    event,
    xCoord,
    yCoord,
    orientation,
    length,
  });

  const checkPlaceableX = (xCoord, yCoord) => {
    const ship = ships.pop();
    const coords = [];
    if (ship !== undefined) {
      for (let i = 0; i < ship.length; i += 1) {
        coords.push([yCoord, xCoord + i]);
        if (xCoord + i > 9 || board[yCoord][xCoord + i]) {
          console.log('space taken or out of bounds');
          ships.push(ship);
          return EventObj('spaceTaken', xCoord, yCoord, 'X', undefined);
        }
      }
      for (let i = 0; i < coords.length; i += 1) {
        const [y, x] = coords[i];
        board[y][x] = ship;
      }
      if (ships.length) {
        return EventObj('shipPlaced', xCoord, yCoord, 'X', ship.length);
      }
      return EventObj('allShipsPlaced', xCoord, yCoord, 'X', ship.length);
    }
    console.log('all ships have been placed');
    return EventObj('allShipsPlaced', xCoord, yCoord, 'X', undefined);
  };

  const checkPlaceableY = (xCoord, yCoord) => {
    const ship = ships.pop();
    const coords = [];
    if (ship !== undefined) {
      for (let i = 0; i < ship.length; i += 1) {
        coords.push([yCoord + i, xCoord]);
        if (yCoord + i > 9 || board[yCoord + i][xCoord]) {
          console.log('space taken or out of bounds');
          ships.push(ship);
          return EventObj('spaceTaken', xCoord, yCoord, 'Y', undefined);
        }
      }
      for (let i = 0; i < coords.length; i += 1) {
        const [y, x] = coords[i];
        board[y][x] = ship;
      }
      if (ships.length) {
        return EventObj('shipPlaced', xCoord, yCoord, 'Y', ship.length);
      }
      return EventObj('allShipsPlaced', xCoord, yCoord, 'Y', ship.length);
    }
    console.log('all ships have been placed');
    return EventObj('allShipsPlaced', xCoord, yCoord, 'Y', undefined);
  };

  const attack = (x, y) => {
    // Empty spaces are 0.
    // 1 = shelled area.
    // 2 = ship hit here and obj has been removed from this space
    // to prevent multiple hits.
    if (board[y][x] === 0) {
      board[y][x] = 1;
      return 'miss';
    }
    if (board[y][x] === 1 || board[y][x] === 2) {
      return 'unavailable';
    }
    const result = board[y][x].hit();
    board[y][x] = 2;
    if (result) {
      shipsSank += 1;
      if (shipsSank === 5) {
        return 'gameOver';
      }
      return 'sank';
    }
    return 'hit';
  };

  const generateRandomAttackCoord = () => {
    const coords = [];
    for (let y = 0; y < board.length; y += 1) {
      const yArray = board[y];
      for (let x = 0; x < yArray.length; x += 1) {
        const space = yArray[x];
        if (space !== 1 && space !== 2) {
          const coord = [x, y];
          coords.push(coord);
        }
      }
    }
    const result = coords[Math.floor(Math.random() * coords.length)];
    return result;
  };

  const generateRandomBoard = () => {
    while (ships.length) {
      const orientation = ['X', 'Y'][Math.floor(Math.random() * 2)];
      // let result;
      if (orientation === 'X') {
        checkPlaceableX(...generateRandomAttackCoord());
      }
      if (orientation === 'X') {
        checkPlaceableY(...generateRandomAttackCoord());
      }
    }
  };

  // const currentShip = () => ships.slice(-1)[0];

  return {
    board,
    checkPlaceableX,
    checkPlaceableY,
    attack,
    generateRandomAttackCoord,
    generateRandomBoard,
  };
};

export default Player;
