const Gameboard = () => {
  const board = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => 0)
  );
  return board;
};

export default Gameboard;
