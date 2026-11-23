// shots.js — the four staged scenes and the two pilots that play them.
//
// A shot is a frozen moment of a real duel, never a hand-placed diorama:
// the smart pilot actually plays the duel (countering stances, pairing
// surges, guarding when hurt), the reckless pilot actually throws cards
// away, and the cover pose is a real turn-four table with two cards in
// the middle. Because every scene comes out of the same world step the
// game itself uses, the screenshots cannot drift from the game.
//
// This file touches no DOM and no clock, so the validator can import it
// in plain Node and run the same pilots a hundred times: the smart one
// must win, the reckless one must lose, and both must prove it.

import { STEP, SCREEN_PLAY, suitBeats, SURGE_BONUS, COUNTER_MULT } from './config.js';
import { cheapestCost } from './deck.js';
import {
  createWorld,
  endTurn,
  playCard,
  startDuel,
  stepWorld,
} from './state.js';

// One ambient slice: the clock advances, the bubbles rise, nothing plays.
function ambient(world, seconds) {
  const cap = Math.floor(seconds / STEP);
  for (let i = 0; i < cap; i += 1) stepWorld(world, STEP);
}

// What one of the player's cards is worth right now: the damage it
// would deal after surge and counter, or the shield it would bank when
// the player is hurting. A guard at full life is worth nothing — the
// pilot would rather hold its tide.
function playerCardValue(world, card) {
  if (card.kind === 'guard') {
    // A shield banked while healthy is still worth a turn: it soaks the
    // rival's next strike whole. It only loses to a counter in hand.
    if (world.player.shield > 0) return -1;
    if (world.player.life <= 10) return 100 + card.shield;
    return 45 + card.shield;
  }
  let power = card.power;
  if (card.kind === 'surge' && world.suitsPlayed.includes(card.suit)) power += SURGE_BONUS;
  if (suitBeats(card.suit, world.rival.stance)) power *= COUNTER_MULT;
  // A cheap card that deals the same damage is worth a little more: it
  // leaves tide for a second play.
  return power * 10 - card.cost;
}

// The smart pilot's turn: guard first when hurt, then the best damage
// card it can afford, again and again until the tide runs out. It never
// plays a card it cannot afford and never spends a turn it does not have.
export function smartPilotTurn(world, maxPlays = 99) {
  let played = 0;
  while (played < maxPlays) {
    if (world.screen !== SCREEN_PLAY) break;
    if (world.player.tide < cheapestCost(world.player.hand)) break;
    let bestIndex = -1;
    let bestValue = -Infinity;
    world.player.hand.forEach((card, i) => {
      if (card.cost > world.player.tide) return;
      const value = playerCardValue(world, card);
      if (value > bestValue) {
        bestValue = value;
        bestIndex = i;
      }
    });
    if (bestIndex < 0 || bestValue < 0) break;
    playCard(world, bestIndex);
    played += 1;
  }
  return played;
}

// The reckless pilot: throw the first affordable non-guard card, in hand
// order, until the tide runs out. No counters, no surges, no guards —
// the control that proves the duel can be lost.
export function recklessPilotTurn(world) {
  let played = 0;
  while (played < 10) {
    if (world.screen !== SCREEN_PLAY) break;
    const index = world.player.hand.findIndex(
      (card) => card.kind !== 'guard' && card.cost <= world.player.tide,
    );
    if (index < 0) break;
    playCard(world, index);
    played += 1;
  }
  return played;
}

// Play a whole duel with one pilot until it ends or the turn cap hits.
// Returns the world, so the caller can read the screen and the result.
export function runDuel(world, pilotTurn, maxTurns = 30) {
  startDuel(world);
  while (world.screen === SCREEN_PLAY && world.turn <= maxTurns) {
    pilotTurn(world);
    if (world.screen !== SCREEN_PLAY) break;
    endTurn(world);
  }
  return world;
}

// The cover pose: two full smart turns, then turn three played only
// two cards deep — a counter first, then a surge card of a SECOND suit
// so the clash shows two colours, not one — and frozen there, mid-turn,
// with both cards in the middle of the table and the banner still lit.
// Turn three, not four: by turn four a good duel is often already
// decided.
function playCoverTurn(world) {
  const hand = world.player.hand;
  const stance = world.rival.stance;
  // First: the best counter strike the tide allows.
  let first = -1;
  let firstValue = -Infinity;
  hand.forEach((card, i) => {
    if (card.kind === 'guard' || card.cost > world.player.tide) return;
    if (!suitBeats(card.suit, stance)) return;
    const value = card.power * 10 - card.cost;
    if (value > firstValue) {
      firstValue = value;
      first = i;
    }
  });
  // No counter in hand: the best damage card instead.
  if (first < 0) {
    hand.forEach((card, i) => {
      if (card.kind === 'guard' || card.cost > world.player.tide) return;
      const value = playerCardValue(world, card);
      if (value > firstValue) {
        firstValue = value;
        first = i;
      }
    });
  }
  if (first < 0) return 0;
  const firstSuit = hand[first].suit;
  playCard(world, first);
  // Second: a surge card of a DIFFERENT suit first — the cover wants
  // two colours in the clash, not a repeat of the first card. A
  // same-suit surge still ranks above a plain strike (it pays +2), and
  // a guard still ranks last: the cover wants two cards in the middle,
  // not one, and not a shield.
  let second = -1;
  let secondValue = -Infinity;
  world.player.hand.forEach((card, i) => {
    if (card.cost > world.player.tide) return;
    let value = card.power * 10 - card.cost;
    if (card.kind === 'surge' && card.suit !== firstSuit) value += 90;
    else if (card.suit === firstSuit) value += 50;
    if (card.kind === 'surge' && card.suit === firstSuit) value += 30;
    if (card.kind === 'guard') value -= 40;
    if (value > secondValue) {
      secondValue = value;
      second = i;
    }
  });
  if (second >= 0) playCard(world, second);
  return world.played.you.length;
}

// Stage one named scene on a fresh world. Returns the screen it landed
// on, so the capture driver and the validator can assert it.
export function stageShot(name, world) {
  if (name === 'start') {
    ambient(world, 5);
    return { screen: world.screen };
  }
  if (name === 'play') {
    startDuel(world);
    while (world.screen === SCREEN_PLAY && world.turn < 3) {
      smartPilotTurn(world);
      if (world.screen !== SCREEN_PLAY) break;
      endTurn(world);
    }
    if (world.screen === SCREEN_PLAY) playCoverTurn(world);
    // Settle 1.3 s: long enough for the floating damage numbers (1.1 s)
    // to fade, short enough that the COUNTER banner (6 s) still shows.
    ambient(world, 1.3);
    return { screen: world.screen };
  }
  if (name === 'win') {
    runDuel(world, smartPilotTurn, 30);
    ambient(world, 1.3);
    return { screen: world.screen };
  }
  if (name === 'loss') {
    runDuel(world, recklessPilotTurn, 30);
    ambient(world, 1.3);
    return { screen: world.screen };
  }
  return { screen: world.screen };
}

// Convenience for the validator: a whole duel from a seed, one pilot.
export function playSeededDuel(seed, pilotTurn, maxTurns = 30) {
  const world = createWorld(seed);
  return runDuel(world, pilotTurn, maxTurns);
}
