const Ship = (inputLength) => {
  const length = inputLength;
  let hits = 0;
  let sunk = false;

  const getHits = () => hits;

  const sink = () => {
    if (getHits() >= length) {
      sunk = true;
    }
    return sunk;
  };

  const hit = () => {
    hits += 1;
    return sink();
  };

  return {
    length,
    hit,
  };
};
export default Ship;
