import Gameboard from './Gameboard';
import Ship from './Ship';

const Player = () => {
  const board = Gameboard();
  const ships = Array.from([2, 3, 3, 4, 5], (length) => Ship(length));

  const checkPlaceableX = (xCoord, yCoord) => {
    const ship = ships.pop();
    const coords = [];
    for (let i = 0; i < ship.length; i += 1) {
      coords.push([yCoord, xCoord + i]);
      if (board[yCoord][xCoord + i]) {
        console.log('space taken or out of bounds');
        ships.push(ship);
        return false;
      }
    }
    for (let i = 0; i < coords.length; i += 1) {
      const [y, x] = coords[i];
      board[y][x] = ship;
    }
    return true;
  };

  const checkPlaceableY = (xCoord, yCoord) => {
    const ship = ships.pop();
    const coords = [];
    for (let i = 0; i < ship.length; i += 1) {
      coords.push([yCoord + i, xCoord]);
      if (board[yCoord + i][xCoord]) {
        console.log('space taken or out of bounds');
        ships.push(ship);
        return false;
      }
    }
    for (let i = 0; i < coords.length; i += 1) {
      const [y, x] = coords[i];
      board[y][x] = ship;
    }
    return true;
  };

  const attack = (x, y) => {
    // Empty spaces are 0.
    // 1 = shelled area.
    // 2 = ship hit here and obj has been removed from this space
    // to prevent multiple hits.
    if (board[y][x] === 0) {
      board[y][x] = 1;
      return 1;
    }
    if (board[y][x] === 1 || board[y][x] === 2) {
      return 'unavailable';
    }
    // if (board[y][x] instanceof Object) {
    const result = board[y][x].hit();
    board[y][x] = 2;
    if (result) {
      // emit sunk message
    } else {
      // emit not sunk but hit message
    }
    return result;
  };

  return {
    board,
    checkPlaceableX,
    checkPlaceableY,
    attack,
  };
};

export default Player;
