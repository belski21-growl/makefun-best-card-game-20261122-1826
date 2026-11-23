// state.js — the duel itself: the world, and the one resolver both
// sides play through.
//
// A world is plain data: two life totals, two shields, two tides, two
// decks and hands, the cards lying in the middle of the table, the duel
// log, and the floating numbers. Nothing here touches the canvas, the
// keyboard or the clock — stepWorld only ages what the loop tells it to,
// so the same seed replays the same duel in a browser, in a screenshot,
// or in a bare Node process running the autopilot.
//
// The rules, once more, in the order they resolve:
//   1. A guard banks its shield on its owner.
//   2. A surge card strikes two harder when its suit was already played
//      this turn by the same side.
//   3. A player's strike whose suit beats the rival's stance deals double.
//   4. A rival strike of her stance suit deals two more.
//   5. Damage soaks the defender's shield first, then life.
//   6. A shield is gone when its owner's next turn starts.

import {
  COUNTER_MULT,
  DRAW_PER_TURN,
  EVENT_COUNTER,
  EVENT_DRAW,
  EVENT_GUARD,
  EVENT_HIT,
  EVENT_LOSS,
  EVENT_PLAY,
  EVENT_SURGE,
  EVENT_TURN,
  EVENT_WIN,
  HAND_START,
  LIFE_START,
  RIVAL_MAX_PLAYS,
  RIVAL_TIDE_BONUS,
  SCREEN_LOSS,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_WIN,
  STANCE_BONUS,
  SURGE_BONUS,
  SUITS,
  tideForTurn,
  suitBeats,
} from './config.js';
import { buildDeck, drawCards } from './deck.js';
import { createRandom } from './random.js';
import { nextStanceAfter, pickRivalCard } from './rival.js';

const LOG_MAX = 9;

// A fresh world: nothing dealt, nothing played, the title up. startDuel
// is what actually shuffles and deals.
export function createWorld(seed) {
  const rng = createRandom(seed);
  return {
    rng,
    seed,
    screen: SCREEN_TITLE,
    turn: 0,
    time: 0,
    player: {
      life: LIFE_START,
      shield: 0,
      tide: 0,
      tideMax: 0,
      deck: [],
      hand: [],
      discard: [],
    },
    rival: {
      life: LIFE_START,
      shield: 0,
      tide: 0,
      tideMax: 0,
      deck: [],
      hand: [],
      discard: [],
      stance: 'coral',
      nextStance: 'wave',
    },
    played: { you: [], rival: [] },
    suitsPlayed: [],
    rivalSuitsPlayed: [],
    log: [],
    fx: [],
    banner: '',
    bannerBorn: -99,
    stats: {
      damageDealt: 0,
      damageTaken: 0,
      surges: 0,
      counters: 0,
      guards: 0,
      cardsPlayed: 0,
    },
    result: null,
    selected: -1,
    hovered: -1,
  };
}

function pushLog(world, text) {
  world.log.push(text);
  while (world.log.length > LOG_MAX) world.log.shift();
}

function pushFx(world, text, x, y, color) {
  world.fx.push({ text, x, y, color, born: world.time, dur: 1.1 });
}

function setBanner(world, text) {
  world.banner = text;
  world.bannerBorn = world.time;
}

// Shuffle, deal five each, pick the opening stance and her intent, and
// open the table. The log's first line is the duel's own opening line.
export function startDuel(world) {
  const { player, rival, rng } = world;
  player.life = LIFE_START;
  player.shield = 0;
  player.deck = buildDeck(rng);
  player.hand = [];
  player.discard = [];
  rival.life = LIFE_START;
  rival.shield = 0;
  rival.deck = buildDeck(rng);
  rival.hand = [];
  rival.discard = [];
  world.played = { you: [], rival: [] };
  world.suitsPlayed = [];
  world.rivalSuitsPlayed = [];
  world.log = [];
  world.fx = [];
  world.stats = { damageDealt: 0, damageTaken: 0, surges: 0, counters: 0, guards: 0, cardsPlayed: 0 };
  world.result = null;
  world.selected = -1;
  world.hovered = -1;
  world.turn = 1;
  player.tideMax = tideForTurn(1);
  player.tide = player.tideMax;
  rival.tideMax = tideForTurn(1);
  rival.tide = rival.tideMax;
  drawCards(player.deck, player.discard, player.hand, HAND_START, rng);
  drawCards(rival.deck, rival.discard, rival.hand, HAND_START, rng);
  rival.stance = rng.pick(['wave', 'coral', 'shell', 'kelp']);
  rival.nextStance = nextStanceAfter(rival.stance, rng);
  world.screen = SCREEN_PLAY;
  setBanner(world, 'The tide is yours — play a card.');
  pushLog(world, 'The duel begins. Your move, tidecaller.');
  pushLog(world, `Nereida takes a ${SUITS[rival.stance].name} stance.`);
  return EVENT_TURN;
}

// The one resolver. `side` is 'you' or 'rival'. Returns the event bits
// the play raised and the number the clash card should show: the damage
// dealt, or the shield banked for a guard.
export function resolveStrike(world, card, side) {
  const attacker = side === 'you' ? world.player : world.rival;
  const defender = side === 'you' ? world.rival : world.player;
  const playedSuits = side === 'you' ? world.suitsPlayed : world.rivalSuitsPlayed;
  let events = EVENT_PLAY;
  const who = side === 'you' ? 'You' : 'Nereida';

  if (card.kind === 'guard') {
    attacker.shield += card.shield;
    if (side === 'you') world.stats.guards += 1;
    events |= EVENT_GUARD;
    pushLog(world, `${who} play ${card.name} — +${card.shield} shield.`);
    // No floating number for a guard: the shield already shows inside
    // the life bar, and a centre-screen label used to pile over the
    // banner and the "she played" caption.
    playedSuits.push(card.suit);
    return { events, shown: card.shield, label: 'shield' };
  }

  let power = card.power;
  let surge = false;
  let counter = false;
  if (card.kind === 'surge' && playedSuits.includes(card.suit)) {
    power += SURGE_BONUS;
    surge = true;
    events |= EVENT_SURGE;
    if (side === 'you') world.stats.surges += 1;
  }
  if (side === 'you' && suitBeats(card.suit, world.rival.stance)) {
    power *= COUNTER_MULT;
    counter = true;
    events |= EVENT_COUNTER;
    if (side === 'you') world.stats.counters += 1;
  }
  if (side === 'rival' && card.suit === world.rival.stance) {
    power += STANCE_BONUS;
  }

  const shieldBefore = defender.shield;
  const lifeBefore = defender.life;
  let left = power;
  if (defender.shield > 0) {
    const soaked = Math.min(defender.shield, left);
    defender.shield -= soaked;
    left -= soaked;
  }
  if (left > 0) defender.life = Math.max(0, defender.life - left);
  const lifeLost = lifeBefore - defender.life;
  if (side === 'you') world.stats.damageDealt += lifeLost;
  else world.stats.damageTaken += lifeLost;
  events |= EVENT_HIT;

  const parts = [];
  if (surge) parts.push('SURGE +2');
  if (counter) parts.push('COUNTER x2');
  const tag = parts.length > 0 ? ` (${parts.join(' · ')})` : '';
  const soakedNote = shieldBefore > 0 && lifeLost < power ? `, ${shieldBefore - defender.shield} soaked` : '';
  pushLog(world, `${who} play ${card.name} — ${power} damage${tag}${soakedNote}.`);
  pushFx(world, `-${lifeLost}`, 640, side === 'you' ? 200 : 430, counter ? '#ffd76a' : '#ff9a7a');
  if (counter) setBanner(world, `COUNTER x2 — ${SUITS[card.suit].name} drowns ${SUITS[world.rival.stance].name}!`);
  else if (surge) setBanner(world, `${SUITS[card.suit].name.toUpperCase()} SURGE +2 — the second ${SUITS[card.suit].name} card strikes harder.`);
  playedSuits.push(card.suit);
  return { events, shown: power, label: 'damage' };
}

// Play the player's hand card at `index`. Refused quietly (events 0)
// when the screen is not the table, the index is out of hand, or the
// tide is short — the UI never offers those plays, and the pilots never
// ask for them.
export function playCard(world, index) {
  if (world.screen !== SCREEN_PLAY) return 0;
  const { player } = world;
  const card = player.hand[index];
  if (!card || card.cost > player.tide) return 0;
  player.hand.splice(index, 1);
  player.tide -= card.cost;
  const outcome = resolveStrike(world, card, 'you');
  world.played.you.push({ ...card, shown: outcome.shown, label: outcome.label, born: world.time });
  player.discard.push(card);
  world.stats.cardsPlayed += 1;
  if (world.selected >= player.hand.length) world.selected = -1;
  else if (world.selected === index) world.selected = -1;
  checkEnd(world);
  return outcome.events;
}

// Her turn, then the next round. Her shield resets first (a shield
// guards one round), she plays up to RIVAL_MAX_PLAYS cards, and only
// then does the round turn over: the stance becomes the intent she
// showed, a new intent is drawn, the player's shield resets, two cards
// are drawn, and the tide refills. Returns the event bits raised.
export function endTurn(world) {
  if (world.screen !== SCREEN_PLAY) return 0;
  const { player, rival } = world;
  let events = 0;
  rival.shield = 0;
  rival.tideMax = tideForTurn(world.turn) + RIVAL_TIDE_BONUS;
  rival.tide = rival.tideMax;
  // She draws two, like the player: without this her hand empties after
  // three rounds and the duel goes quiet.
  drawCards(rival.deck, rival.discard, rival.hand, DRAW_PER_TURN, world.rng);
  world.rivalSuitsPlayed = [];
  world.played.rival = [];
  let played = 0;
  while (played < RIVAL_MAX_PLAYS) {
    const pick = pickRivalCard(world);
    if (!pick) break;
    const card = rival.hand.splice(pick.index, 1)[0];
    rival.tide -= card.cost;
    const outcome = resolveStrike(world, card, 'rival');
    events |= outcome.events;
    world.played.rival.push({ ...card, shown: outcome.shown, label: outcome.label, born: world.time });
    rival.discard.push(card);
    played += 1;
    if (checkEnd(world)) return events | EVENT_TURN;
  }
  world.turn += 1;
  rival.stance = rival.nextStance;
  rival.nextStance = nextStanceAfter(rival.stance, world.rng);
  player.shield = 0;
  world.suitsPlayed = [];
  world.played.you = [];
  player.tideMax = tideForTurn(world.turn);
  player.tide = player.tideMax;
  const drawn = drawCards(player.deck, player.discard, player.hand, DRAW_PER_TURN, world.rng);
  if (drawn > 0) events |= EVENT_DRAW;
  pushLog(world, `— Turn ${world.turn} — tide ${player.tide}, Nereida shifts to ${SUITS[rival.stance].name}.`);
  events |= EVENT_TURN;
  return events;
}

// Settle the duel when a life total reaches zero, and record the result
// the end screens print. Returns true when the duel ended.
export function checkEnd(world) {
  if (world.rival.life <= 0 && world.screen === SCREEN_PLAY) {
    world.screen = SCREEN_WIN;
    world.result = {
      turns: world.turn,
      damageDealt: world.stats.damageDealt,
      surges: world.stats.surges,
      counters: world.stats.counters,
    };
    pushLog(world, 'Nereida yields — the tide is yours!');
    return true;
  }
  if (world.player.life <= 0 && world.screen === SCREEN_PLAY) {
    world.screen = SCREEN_LOSS;
    world.result = {
      turns: world.turn,
      damageDealt: world.stats.damageDealt,
      surges: world.stats.surges,
      counters: world.stats.counters,
    };
    pushLog(world, 'The deep keeps you — Nereida wins.');
    return true;
  }
  return false;
}

// The clock: advance the duel's time and age the floating numbers out.
// Called every fixed slice, on every screen — the title's bubbles drift
// on this clock, and a frozen shot never advances it.
export function stepWorld(world, dt) {
  world.time += dt;
  while (world.fx.length > 0 && world.time - world.fx[0].born > world.fx[0].dur) {
    world.fx.shift();
  }
}
