import Gameboard from './Gameboard';
import Ship from './Ship';

const Player = () => {
  let board;
  let ships;
  let shipsSank;

  const reset = () => {
    board = Gameboard();
    ships = Array.from([2, 3, 3, 4, 5], (length) => Ship(length));
    shipsSank = 0;
  };

  const checkPlaceableX = (data) => {
    const xCoord = parseInt(data.xCoord, 10);
    const yCoord = parseInt(data.yCoord, 10);
    const ship = ships.pop();
    const coords = [];
    if (ship !== undefined) {
      for (let i = 0; i < ship.length; i += 1) {
        coords.push([yCoord, xCoord + i]);
        if (board[yCoord][xCoord + i]) {
          console.log('space taken or out of bounds');
          ships.push(ship);
          return 'spaceTaken';
        }
      }
      for (let i = 0; i < coords.length; i += 1) {
        const [y, x] = coords[i];
        board[y][x] = ship;
      }
      if (ships.length) {
        return 'shipPlaced';
      }
      return 'allShipsPlaced';
    }
    console.log('all ships have been placed');
    return 'allShipsPlaced';
  };

  const checkPlaceableY = (data) => {
    const xCoord = parseInt(data.xCoord, 10);
    const yCoord = parseInt(data.yCoord, 10);
    const ship = ships.pop();
    const coords = [];
    if (ship !== undefined) {
      for (let i = 0; i < ship.length; i += 1) {
        coords.push([yCoord + i, xCoord]);
        if (board[yCoord + i][xCoord]) {
          console.log('space taken or out of bounds');
          ships.push(ship);
          return 'spaceTaken';
        }
      }
      for (let i = 0; i < coords.length; i += 1) {
        const [y, x] = coords[i];
        board[y][x] = ship;
      }
      return 'shipPlaced';
    }
    console.log('all ships have been placed');
    return 'allShipsPlaced';
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
    // if (board[y][x] instanceof Object) {
    const result = board[y][x].hit();
    board[y][x] = 2;
    if (result) {
      shipsSank += 1;
      if (shipsSank === 5) {
        // emit gameOver message
        return 'gameOver';
      }
      // emit sunk message
      return 'sank';
    }
    // emit not sunk but hit message
    return 'hit';
  };

  reset();

  return {
    board,
    checkPlaceableX,
    checkPlaceableY,
    attack,
    reset,
  };
};

export default Player;
