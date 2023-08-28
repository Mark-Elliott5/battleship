import Gameboard from './Gameboard';
import Ship from './Ship';

const Player = () => {
  const board = Gameboard();
  const ships = Array.from([2, 3, 3, 4, 5], (length) => Ship(length));

  const checkPlaceableX = (x, y, ship) => {
    const coords = [];
    for (let i = 0; i < ship.length; i += 1) {
      coords.push(board[y][x + i]);
      if (coords[i] || undefined) {
        console.log('space taken or out of bounds');
        return false;
      }
    }
    for (let i = 0; i < coords.length; i += 1) {
      coords[i] = ship;
    }
    return true;
  };

  const checkPlaceableY = (xCoord, yCoord, ship) => {
    const coords = [];
    for (let i = 0; i < ship.length; i += 1) {
      coords.push([yCoord + i, xCoord]);
      if (board[yCoord + i][xCoord]) {
        console.log('space taken or out of bounds');
        return false;
      }
    }
    for (let i = 0; i < coords.length; i += 1) {
      const [y, x] = coords[i];
      board[y][x] = ship;
    }
    return true;
  };

  const getBoard = () => board;

  return {
    board,
    getBoard,
    checkPlaceableX,
    checkPlaceableY,
  };
};
