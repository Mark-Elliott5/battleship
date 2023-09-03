import Ship from '../src/factories/Ship';
import Player from '../src/factories/Player';

const ship = Ship(2);

describe('Hits and Sunk', () => {
  test('Returns ship length of 2', () => {
    expect(ship.length).toBe(2);
  });
  test('Hit() should return false (false = not sunk)', () => {
    expect(ship.hit()).toBe(false);
  });
  test('Hit() should return true (2 hits = true = sunk)', () => {
    expect(ship.hit()).toBe(true);
  });
});

const player = Player();

describe('Player test', () => {
  test('Ship is able to be placed at [0,0] in the X-axis', () => {
    expect(player.checkPlaceableX(0, 0)).toBe('shipPlaced');
  });
  test('Ship is NOT able to be placed at [0,0] in the X-axis', () => {
    expect(player.checkPlaceableX(0, 0)).toBe('spaceTaken');
  });
  test('Ship is able to be placed at [0,1] in the Y-axis', () => {
    expect(player.checkPlaceableY(0, 1)).toBe('shipPlaced');
  });
  test('Ship is NOT able to be placed at [0,1] in the Y-axis', () => {
    expect(player.checkPlaceableY(0, 1)).toBe('spaceTaken');
  });
  test('Ship at [0,0] is hit but not sunk (returns hit)', () => {
    expect(player.attack(0, 0)).toBe('hit');
  });
  test('Tries to hit [0,0] but cannot hit in the same coordinate twice', () => {
    expect(player.attack(0, 0)).toBe('unavailable');
  });
  test('Tries to hit [9,9] but misses', () => {
    expect(player.attack(9,9)).toBe('miss')
  });
  test('Hits ship at [0,0] and sinks X-axis ship (returns sank)', () => {
    player.attack(0, 1);
    player.attack(0, 2);
    player.attack(0, 3);
    expect(player.attack(0, 4)).toBe('sank');
  });
  test('Tries to place more than 5 ships but fails', () => {
    player.checkPlaceableX(0,7);
    player.checkPlaceableX(0,8);
    player.checkPlaceableX(0,9);
    expect(player.checkPlaceableX(5,6)).toBe('allShipsPlaced')
  });
});