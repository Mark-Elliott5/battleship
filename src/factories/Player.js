import Gameboard from './Gameboard';
import Ship from './Ship';

const Player = () => {
  const board = Gameboard();
  const ships = Array.from([2, 3, 3, 4, 5], (length) => Ship(length));
  let shipsSank = 0;

  const checkPlaceableX = (xCoord, yCoord) => {
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

  const checkPlaceableY = (xCoord, yCoord) => {
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

  return {
    board,
    checkPlaceableX,
    checkPlaceableY,
    attack,
    generateRandomAttackCoord,
  };
};

export default Player;
