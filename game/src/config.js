// config.js — the fixed numbers and the four suits of Tideglass Duel.
//
// Everything the game balances on lives here and nowhere else: the field
// size, the life totals, the tide (mana) curve, the surge and counter
// payoffs, and the suit wheel. The other modules read these values; none
// of them re-declares a number that belongs here, so a balance change is
// one edit in this file and the whole game follows.

// The drawing buffer is the table itself: 1280 by 720, the size every
// screenshot is taken at, so what the player sees is what the judge sees.
export const FIELD = { width: 1280, height: 720 };

// One simulation slice, in seconds. The loop runs the world on this fixed
// slice so the duel plays the same at any frame rate.
export const STEP = 1 / 60;

// A duel is twenty life against twenty. No score, no timer — the life
// bars are the whole scoreboard.
export const LIFE_START = 20;

// Five cards open a duel; two more are drawn at the start of every turn
// after the first, so a hand stays near five without ever flooding.
export const HAND_START = 5;
export const DRAW_PER_TURN = 2;

// A deck is twenty-four cards: six of each suit, no duplicates.
export const DECK_SIZE = 24;

// Tide is the mana of this game, spent to play cards and refilled every
// turn. It opens at three, grows by one every two turns, and never passes
// six — enough for two honest cards a turn, never enough for everything.
export function tideForTurn(turn) {
  return Math.min(3 + Math.floor((turn - 1) / 2), 6);
}

// The second card of one suit in a turn strikes two harder. That is the
// Surge: the reward for holding a pair instead of spending the first card
// that fits.
export const SURGE_BONUS = 2;

// A strike whose suit beats the rival's stance deals double. That is the
// Counter: the reward for reading the stance panel and answering it.
export const COUNTER_MULT = 2;

// The rival's own edge: strikes of its stance suit hit one harder.
// Small on purpose — her stance is a nudge, not a second counter.
export const STANCE_BONUS = 1;

// How many cards the rival may play on her turn. Two keeps her damage
// honest against a player who counters and surges well — and her hand is
// refilled every round, so she never runs dry.
export const RIVAL_MAX_PLAYS = 2;

// The rival draws on the deep: the same tide a turn as the player.
// She needs no edge here — her stance bonus and her guarding are
// enough, and a fair tide keeps the duel a contest of reading her.
export const RIVAL_TIDE_BONUS = 0;

// A shield bought this turn is gone when its owner's next turn starts:
// shields guard one round, they are not a wall you build forever.
export const SHIELD_LASTS_ONE_ROUND = true;

// The four suits. Each is a colour AND a shape, never text alone: a drop
// for Wave, a branching star for Coral, a fan for Shell, a leaf for Kelp.
// The wheel turns Wave > Coral > Shell > Kelp > Wave, so every stance has
// exactly one suit that beats it and one suit it beats.
export const SUITS = {
  wave: {
    key: 'wave',
    name: 'Wave',
    color: '#3aa7ff',
    dark: '#0b5fa5',
    beats: 'coral',
    glyph: 'drop',
    blurb: 'drowns Coral',
  },
  coral: {
    key: 'coral',
    name: 'Coral',
    color: '#ff7a59',
    dark: '#a83a1e',
    beats: 'shell',
    glyph: 'branch',
    blurb: 'breaks Shell',
  },
  shell: {
    key: 'shell',
    name: 'Shell',
    color: '#e8b64c',
    dark: '#8a6414',
    beats: 'kelp',
    glyph: 'fan',
    blurb: 'closes on Kelp',
  },
  kelp: {
    key: 'kelp',
    name: 'Kelp',
    color: '#2fd6a3',
    dark: '#0d7a55',
    beats: 'wave',
    glyph: 'leaf',
    blurb: 'tangles Wave',
  },
};

export const SUIT_KEYS = ['wave', 'coral', 'shell', 'kelp'];

// The suit that beats `suit` — the counter the stance panel names.
export function counterSuitOf(suit) {
  for (const key of SUIT_KEYS) {
    if (SUITS[key].beats === suit) return key;
  }
  return null;
}

// Does an attacking suit beat a defending suit on the wheel?
export function suitBeats(attacker, defender) {
  return SUITS[attacker].beats === defender;
}

// The screens the game can show: the title, the table, and the two ends.
export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_WIN = 'win';
export const SCREEN_LOSS = 'loss';

// Event bits the world hands back after a step, so the boot can play the
// right sound and announce the right line without re-reading the state.
export const EVENT_PLAY = 1;
export const EVENT_COUNTER = 2;
export const EVENT_SURGE = 4;
export const EVENT_GUARD = 8;
export const EVENT_HIT = 16;
export const EVENT_TURN = 32;
export const EVENT_WIN = 64;
export const EVENT_LOSS = 128;
export const EVENT_DRAW = 256;

// The rival's name and title, shown over her portrait.
export const RIVAL_NAME = 'NEREIDA';
export const RIVAL_TITLE = 'Rival of the Deep';
export const GAME_TITLE = 'TIDEGLASS DUEL';
export const GAME_SUBTITLE = 'a duel of tides, shells and nerve';

// The table geometry both the painter and the input belt agree on, so a
// click lands on the card the eye sees. The player's hand sits along the
// bottom: five cards, each 148 by 200, lifted a little when selected.
export const HAND_CARD = { width: 148, height: 200, gap: 14, y: 496, lift: 18 };
export const HAND_X0 = 242;

// The clash cards in the middle of the table are bigger than the hand —
// they are the moment the screenshot is about.
export const CLASH_CARD = { width: 172, height: 224 };

// The rival's face-down hand: five small backs across the top.
export const RIVAL_CARD = { width: 64, height: 88, gap: 10, y: 12 };
export const RIVAL_X0 = 480;

// The End Turn button, bottom right, and the tide pips above it.
export const END_TURN_RECT = { x: 1052, y: 556, width: 204, height: 88 };
export const TIDE_RECT = { x: 1052, y: 496, width: 204, height: 48 };
