import Ship from '../src/factories/Ship';
import Player from '../src/factories/Player';

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
});

const player = Player();

describe('Player test', () => {
  test('Ship is able to be placed at [0,0] in the X-axis', () => {
    expect(player.checkPlaceableX(0, 0)).toBe(true);
  });
  test('Ship is NOT able to be placed at [0,0] in the X-axis', () => {
    expect(player.checkPlaceableX(0, 0)).toBe(false);
  });
  test('Ship is able to be placed at [0,1] in the Y-axis', () => {
    expect(player.checkPlaceableY(0, 1)).toBe(true);
  });
  test('Ship is NOT able to be placed at [0,1] in the Y-axis', () => {
    expect(player.checkPlaceableY(0, 1)).toBe(false);
  });
  test('Ship at [0,0] is hit but not sunk (returns ship.sunk (false))', () => {
    expect(player.attack(0, 0)).toBe(false);
  });
  test('Tries to hit [0,0] but cannot hit in the same coordinate twice', () => {
    expect(player.attack(0, 0)).toBe('unavailable');
  });
  test('Hits ship at [0,0] and sinks X-axis ship (returns ship.sunk (true))', () => {
    player.attack(0, 1);
    player.attack(0, 2);
    player.attack(0, 3);
    expect(player.attack(0, 4)).toBe(true);
  });
});