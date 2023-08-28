const Ship = (inputLength) => {
  const length = inputLength;
  let hits = 0;
  let sunk = false;

  const getHits = () => hits;

  const sink = () => {
    sunk = true;
  };

  const hit = () => {
    hits += 1;
    if (hits >= length) {
      sink();
    }
  };

  return {
    length,
    getHits,
    hit,
  };
};
export default Ship;
