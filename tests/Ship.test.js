import Ship from "../src/factories/Ship";

const ship = Ship(2);

test('Returns length of 2', () => {
  expect(ship.length).toBe(2);
});

describe('Hits and Sunk', () => {
  test('Hit() should return false (1 hit)', () => {
    expect(ship.hit()).toBe(false);
  });
  test('Hit() should return true (2 hits = length)', () => {
    expect(ship.hit()).toBe(true);
  });
})