// main.js — the boot: the fixed-step loop, the shot mode, and the flow
// between the four screens.
//
// Two ways to run. With ?shot=start|play|win|loss in the URL the game
// stages that scene once and then repaints the frozen frame until the
// shot is captured (window.__shotReady tells the capture driver the
// first paint is done). Without it, this is the playable game: title,
// table, win, loss — with the input belt, the sound kit, and a pause
// when the tab hides. Input arrives edge by edge, so a press is spent
// the moment it is read; the world itself steps on a fixed slice so the
// duel plays the same at any frame rate.

import { STEP, FIELD, EVENT_COUNTER, EVENT_GUARD, EVENT_HIT, EVENT_LOSS, EVENT_PLAY, EVENT_SURGE, EVENT_TURN, EVENT_WIN, SCREEN_LOSS, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './config.js';
import { createWorld, startDuel, playCard, endTurn, stepWorld } from './state.js';
import { createInput, ACTION_CONFIRM, ACTION_END_TURN, ACTION_MUTE, ACTION_RESTART } from './input.js';
import { createAudio } from './audio.js';
import { drawScene } from './render.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
// The drawing buffer is the table itself: without this the canvas stays
// at its 300x150 default and the game paints into a postage stamp in the
// corner while the stylesheet stretches it over the whole window.
canvas.width = FIELD.width;
canvas.height = FIELD.height;
const statusEl = document.getElementById('status');
const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const seed = Number(params.get('seed') || '1') || 1;

const input = createInput(canvas);
const audio = createAudio();

let world = createWorld(seed);

function announce(text) {
  if (statusEl) statusEl.textContent = text;
}

// One event word per sound: the boot never re-reads the state to decide
// what it just heard — the world hands it the bits.
function playSounds(events) {
  if (events & EVENT_WIN) {
    audio.win();
    return;
  }
  if (events & EVENT_LOSS) {
    audio.loss();
    return;
  }
  if (events & EVENT_COUNTER) audio.counter();
  else if (events & EVENT_SURGE) audio.surge();
  else if (events & EVENT_PLAY) audio.play();
  if (events & EVENT_GUARD) audio.guard();
  if (events & EVENT_HIT) audio.hit();
  if (events & EVENT_TURN) audio.turn();
}

const unlockOnce = () => {
  audio.unlock();
  window.removeEventListener('pointerdown', unlockOnce);
  window.removeEventListener('keydown', unlockOnce);
};
window.addEventListener('pointerdown', unlockOnce);
window.addEventListener('keydown', unlockOnce);

document.addEventListener('visibilitychange', () => {
  // Hiding the tab starves requestAnimationFrame, which freezes the
  // loop below on its own: the duel simply waits, unstepped, for return.
  // There is no pause screen to show — the table is where it was left.
});

let prevConfirm = false;
let prevEndTurn = false;

// A press on a still screen: start the duel, or begin a fresh one after
// a win or a loss. Returns true when the press was spent on the screen
// itself and no world step should follow.
function handleStillScreen(screen, confirmEdge, click) {
  if (screen === SCREEN_TITLE) {
    if (confirmEdge || click) {
      audio.dive();
      startDuel(world);
      announce('The duel begins — your move, tidecaller.');
    }
    return true;
  }
  if (screen === SCREEN_WIN || screen === SCREEN_LOSS) {
    if (confirmEdge || click) {
      audio.unlock();
      world = createWorld((Date.now() % 2147483647) || 1);
      announce('Tideglass Duel');
    }
    return true;
  }
  return false;
}

function tick() {
  const actions = input.takeActions();
  const confirmEdge = Boolean(actions & ACTION_CONFIRM) && !prevConfirm;
  const endTurnEdge = Boolean(actions & ACTION_END_TURN) && !prevEndTurn;
  prevConfirm = Boolean(actions & ACTION_CONFIRM);
  prevEndTurn = Boolean(actions & ACTION_END_TURN);
  if (actions & ACTION_MUTE) {
    const muted = audio.toggleMute();
    announce(muted ? 'Sound muted' : 'Sound on');
  }
  if (actions & ACTION_RESTART) {
    world = createWorld((Date.now() % 2147483647) || 1);
    announce('Tideglass Duel');
    return;
  }
  const cardKeys = input.takeCardKeys();
  const click = input.takeClick();
  const screen = world.screen;

  // The title breathes: its bubbles rise and its light sways.
  if (screen === SCREEN_TITLE) stepWorld(world, STEP);

  if (handleStillScreen(screen, confirmEdge, click)) return;

  // A click on the table: a hand card, the End Turn button, or nothing.
  if (click && screen === SCREEN_PLAY) {
    const hit = input.hitAt(world, click);
    if (hit.kind === 'card') {
      if (world.selected === hit.index) {
        const events = playCard(world, hit.index);
        playSounds(events);
        if (world.screen === SCREEN_WIN) announce(`You win — Nereida yields in ${world.turn} turns.`);
        if (world.screen === SCREEN_LOSS) announce('Nereida wins — the deep keeps you.');
      } else {
        world.selected = hit.index;
        audio.click();
      }
      return;
    }
    if (hit.kind === 'endTurn') {
      const events = endTurn(world);
      playSounds(events);
      if (world.screen === SCREEN_LOSS) announce('Nereida wins — the deep keeps you.');
      return;
    }
    if (hit.kind === 'none') world.selected = -1;
  }

  // Number keys play at once: no select-then-confirm for the keyboard.
  if (screen === SCREEN_PLAY) {
    for (const index of cardKeys) {
      if (index < world.player.hand.length) {
        const events = playCard(world, index);
        playSounds(events);
        if (world.screen !== SCREEN_PLAY) break;
      }
    }
    if (world.screen === SCREEN_WIN) announce(`You win — Nereida yields in ${world.turn} turns.`);
    if (world.screen === SCREEN_LOSS) announce('Nereida wins — the deep keeps you.');
    if (endTurnEdge && world.screen === SCREEN_PLAY) {
      const events = endTurn(world);
      playSounds(events);
      if (world.screen === SCREEN_LOSS) announce('Nereida wins — the deep keeps you.');
    }
    // Hover lifts the card under the pointer; it is separate from the
    // click selection, so the two never fight over one card.
    world.hovered = input.hoveredIndex(world);
  }
}

if (shotName) {
  // Shot mode: stage once, repaint the frozen frame forever, and raise
  // the flag after the first paint so the capture driver can shoot.
  try {
    stageShot(shotName, world);
    announce(`Tideglass Duel — ${shotName} scene`);
  } catch (err) {
    window.__shotError = String(err && err.message ? err.message : err);
  }
  let ready = false;
  const repaint = () => {
    drawScene(ctx, world);
    if (!ready) {
      ready = true;
      window.__shotReady = true;
    }
    window.requestAnimationFrame(repaint);
  };
  window.requestAnimationFrame(repaint);
} else {
  announce('Tideglass Duel');
  let last = window.performance.now();
  let acc = 0;
  const frame = (now) => {
    window.requestAnimationFrame(frame);
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.25) dt = 0.25;
    acc += dt;
    let guard = 0;
    while (acc >= STEP && guard < 8) {
      acc -= STEP;
      guard += 1;
      tick();
    }
    if (guard >= 8) acc = 0;
    // The clock runs on real frame time: bubbles rise, floating numbers
    // fade, and the title breathes even between fixed steps.
    stepWorld(world, dt);
    drawScene(ctx, world);
  };
  window.requestAnimationFrame(frame);
}
