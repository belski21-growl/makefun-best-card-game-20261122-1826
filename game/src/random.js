// random.js — the duel's only source of chance, a seeded generator.
//
// Every shuffle, every stance pick and every bubble's place comes from
// one mulberry32 stream, seeded when the world is made. The same seed
// deals the same duel, so a screenshot staged today is the same duel
// staged tomorrow, and the autopilot's wins and losses can be re-run by
// anyone with the seed. Nothing in this file touches the clock, the DOM
// or Math.random — a run that did would not reproduce.

// mulberry32: a small, fast generator with a full 32-bit period for our
// purposes. The constants are the standard ones; the state is one uint32.
export function createRandom(seed) {
  let state = (seed >>> 0) || 0x9e3779b9;
  return {
    // The next float in [0, 1).
    next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    // The next integer in [0, n).
    below(n) {
      return Math.floor(this.next() * n);
    },
    // One element of an array, uniformly.
    pick(list) {
      return list[this.below(list.length)];
    },
  };
}

// A Fisher–Yates shuffle that spends the given stream and nothing else:
// the deck order is a pure function of the seed.
export function shuffleInto(deck, rng) {
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = rng.below(i + 1);
    const held = deck[i];
    deck[i] = deck[j];
    deck[j] = held;
  }
  return deck;
}

// A cheap deterministic hash of two small integers, for scattering the
// background bubbles and sand flecks without spending the main stream:
// the table's decoration never eats the duel's randomness.
export function hash2(x, y) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// A second hash for a one-dimensional scatter (a bubble's drift phase, a
// ray's sway): same idea, one input, still no stream spent.
export function hash1(n) {
  let h = (Math.imul(n | 0, 2246822519) ^ 0x5bd1e995) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 3266489917);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Draw `count` items from `list` without replacement, spending the stream
// in order: used for the opening stance pair, where the next stance must
// differ from the current one.
export function drawWithoutReplacement(list, count, rng) {
  const pool = list.slice();
  const out = [];
  while (out.length < count && pool.length > 0) {
    out.push(pool.splice(rng.below(pool.length), 1)[0]);
  }
  return out;
}
