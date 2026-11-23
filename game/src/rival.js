// rival.js — Nereida, the rival: her stance, her intent, and her turn.
//
// Nereida is readable on purpose. Each round she declares a stance — a
// suit — and the table shows it with what it beats and what counters it,
// plus her NEXT stance, so the player can plan a turn ahead. Her stance
// suit strikes two harder for her; the suit that beats it strikes double
// for the player. She is not a random card spiller: she guards when she
// is hurt, she leans on her stance suit, and she pairs a surge when she
// holds one. She does not read the player's hand, and she never counters
// — the counter is the player's weapon, not hers.
//
// This file only DECIDES her plays. state.js applies them through the
// same resolver the player uses, so both sides play by the same rules and
// there is no import cycle between the two files.

import { STANCE_BONUS, SUITS, SUIT_KEYS } from './config.js';

// Pick the next stance from the stream: any suit except the current one,
// so the panel always turns over and the player is never told "same".
export function nextStanceAfter(current, rng) {
  const others = SUIT_KEYS.filter((key) => key !== current);
  return rng.pick(others);
}

// How much damage one of her cards would deal right now, before shield
// soak: her stance suit gets the stance bonus, a surge card gets its
// pair bonus when she has already played its suit this turn.
export function rivalCardDamage(card, world) {
  let power = card.power;
  if (card.kind === 'surge' && world.rivalSuitsPlayed.includes(card.suit)) {
    power += 2;
  }
  if (card.suit === world.rival.stance) power += STANCE_BONUS;
  return power;
}

// Score one of her cards for this turn. Guards score by need: worthless
// at full life, worth more than a jab when she is bleeding. Strikes score
// by damage, with her stance suit and her surge pairs worth a little
// extra, so she reaches for them first.
function scoreRivalCard(card, world) {
  const rival = world.rival;
  if (card.kind === 'guard') {
    // She banks a shield whenever she has none: a shield is worth more
    // than a weak strike, and a fresh shield every round is what makes
    // the duel last past three turns. A stance strike still outranks it.
    if (rival.shield > 0) return -1;
    if (rival.life <= 8) return 100 + card.shield;
    return 45 + card.shield;
  }
  let value = rivalCardDamage(card, world);
  if (card.suit === world.rival.stance) value += 3;
  if (card.kind === 'surge' && world.rivalSuitsPlayed.includes(card.suit)) value += 3;
  return value;
}

// Her best affordable card right now, or null when nothing fits her tide
// or nothing is worth playing (a guard at full life stays in her hand).
// Ties break toward the earlier card in her hand, so the choice is
// deterministic for a given hand and tide.
export function pickRivalCard(world) {
  const rival = world.rival;
  let best = null;
  let bestScore = -Infinity;
  for (let i = 0; i < rival.hand.length; i += 1) {
    const card = rival.hand[i];
    if (card.cost > rival.tide) continue;
    const score = scoreRivalCard(card, world);
    if (score > bestScore) {
      bestScore = score;
      best = { index: i, card };
    }
  }
  if (!best || bestScore < 0) return null;
  return best;
}

// The one-line read of her stance for the panel: what it beats, and what
// counters it. The panel prints this verbatim.
export function stanceLine(stance) {
  const suit = SUITS[stance];
  const counter = SUIT_KEYS.find((key) => SUITS[key].beats === stance);
  return `${suit.name} — beats ${SUITS[suit.beats].name}, counter with ${SUITS[counter].name}`;
}
