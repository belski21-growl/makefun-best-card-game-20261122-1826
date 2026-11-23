// deck.js — the twenty-four cards of Tideglass Duel.
//
// Six cards per suit, four suits, no duplicates: a deck you can hold in
// your head after one duel. Every card does exactly one thing, in one
// short line: a strike deals its power, a guard banks its shield, a surge
// card strikes and then strikes two harder when its suit has already been
// played this turn. The numbers live here; the rules that bend them
// (Surge +2, Counter x2, stance +2) live in state.js and config.js.
//
// Card fields:
//   id     a short stable key, suit letter + number (w1..w6, c1..c6, ...)
//   suit   one of wave / coral / shell / kelp
//   name   short, one or two words, readable at thumbnail size
//   kind   'strike' | 'guard' | 'surge' (a surge card is a strike with a
//          same-suit payoff; a guard never attacks)
//   cost   tide to play, 1 to 3
//   power  damage when played as a strike, before bonuses
//   shield shield banked when played as a guard
//   text   the card's whole rules text, one line, no paragraph

import { SUITS } from './config.js';
import { shuffleInto } from './random.js';

// One suit's six cards, in cost order: a cheap jab, a solid hit, a guard,
// a heavy hit, and TWO surge cards — the pair is the point of the suit,
// so each suit holds two chances to fire one.
function suitCards(suit, names) {
  const [jab, hit, wall, heavy, surgeA, surgeB] = names;
  return [
    { id: `${suit[0]}1`, suit, name: jab, kind: 'strike', cost: 1, power: 1, shield: 0, text: 'Deal 1.' },
    { id: `${suit[0]}2`, suit, name: hit, kind: 'strike', cost: 2, power: 2, shield: 0, text: 'Deal 2.' },
    { id: `${suit[0]}3`, suit, name: wall, kind: 'guard', cost: 1, power: 0, shield: 3, text: 'Gain 3 shield.' },
    { id: `${suit[0]}4`, suit, name: heavy, kind: 'strike', cost: 3, power: 3, shield: 0, text: 'Deal 3.' },
    { id: `${suit[0]}5`, suit, name: surgeA, kind: 'surge', cost: 2, power: 1, shield: 0, text: `Deal 1. +2 if ${SUITS[suit].name}.` },
    { id: `${suit[0]}6`, suit, name: surgeB, kind: 'surge', cost: 2, power: 1, shield: 0, text: `Deal 1. +2 if ${SUITS[suit].name}.` },
  ];
}

// The whole deck, suit by suit. Names are short and sea-born; no name is
// borrowed from another game.
export const CARD_DEFS = [
  ...suitCards('wave', ['Ripple', 'Breaker', 'Tidewall', 'Undertow', 'Foam', 'Swell']),
  ...suitCards('coral', ['Spark', 'Branch', 'Reef', 'Bloom', 'Spire', 'Frill']),
  ...suitCards('shell', ['Shard', 'Fan', 'Nacre', 'Spiral', 'Pearl', 'Lumen']),
  ...suitCards('kelp', ['Frond', 'Tangle', 'Canopy', 'Deepwood', 'Drift', 'Holdfast']),
];

// A fresh copy of the deck, unshuffled: buildDeck shuffles its own copy,
// so the definition table is never mutated by a game.
export function freshDeck() {
  return CARD_DEFS.map((card) => ({ ...card }));
}

// A shuffled deck, dealt from the end (pop) so the top card is the last
// element. The shuffle spends the world's stream, in order.
export function buildDeck(rng) {
  return shuffleInto(freshDeck(), rng);
}

// Look a card up by id, for the pilots and the tests. Returns a copy.
export function cardById(id) {
  const found = CARD_DEFS.find((card) => card.id === id);
  return found ? { ...found } : null;
}

// Draw up to `count` cards from `deck` into `hand`. When the deck runs
// dry the discard is shuffled back in and the draw continues; when both
// are empty nothing is drawn and no error is raised — a duel with no
// cards left to draw is still a duel.
export function drawCards(deck, discard, hand, count, rng) {
  let drawn = 0;
  for (let i = 0; i < count; i += 1) {
    if (deck.length === 0) {
      if (discard.length === 0) break;
      while (discard.length > 0) deck.push(discard.pop());
      shuffleInto(deck, rng);
    }
    hand.push(deck.pop());
    drawn += 1;
  }
  return drawn;
}

// The cheapest tide any card in a hand costs, or Infinity when the hand
// holds nothing affordable at all — the pilot's "can I still play?"
export function cheapestCost(hand) {
  let cheapest = Infinity;
  for (const card of hand) {
    if (card.cost < cheapest) cheapest = card.cost;
  }
  return cheapest;
}

// Count the cards of one suit in a hand: the pilot's "do I hold a pair?"
// check, and the renderer's hint for which suits are live.
export function countSuit(hand, suit) {
  let n = 0;
  for (const card of hand) {
    if (card.suit === suit) n += 1;
  }
  return n;
}

// The total power a hand could still throw this turn at a given tide,
// counting surge cards at their plain power and ignoring counters: a
// rough "how dangerous is this hand" for the rival's guard decisions.
export function handThreat(hand, tide) {
  let threat = 0;
  for (const card of hand) {
    if (card.cost > tide) continue;
    if (card.kind === 'guard') continue;
    threat += card.power;
  }
  return threat;
}
