// input.js — the mouse and the keyboard, speaking one language.
//
// The belt collects edges, not states: a press is a single event the
// boot spends the moment it reads it, so holding a key never replays a
// card. Clicks arrive as canvas coordinates (the canvas is the field, so
// no scaling math is needed) and are hit-tested by render.js, which owns
// the geometry. The boot asks, once a tick: what was pressed, and where
// was the last click?

import { hitTest } from './render.js';

// The actions the belt can report, as bits, so one number carries them.
export const ACTION_CONFIRM = 1;
export const ACTION_END_TURN = 2;
export const ACTION_MUTE = 4;
export const ACTION_RESTART = 8;

export function createInput(canvas) {
  let actions = 0;
  let click = null;
  let hover = { x: -1, y: -1 };

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function onPointerDown(event) {
    const point = canvasPoint(event);
    click = point;
    actions |= ACTION_CONFIRM;
    event.preventDefault();
  }

  function onPointerMove(event) {
    hover = canvasPoint(event);
  }

  function onKeyDown(event) {
    // Number keys 1-5 play the card in that hand slot; the boot reads
    // them as ACTION_CARD_n through the key queue below.
    if (event.key >= '1' && event.key <= '5') {
      queuedCards.push(Number(event.key) - 1);
      event.preventDefault();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      actions |= ACTION_CONFIRM | ACTION_END_TURN;
      event.preventDefault();
      return;
    }
    if (event.key === 'm' || event.key === 'M') {
      actions |= ACTION_MUTE;
      return;
    }
    if (event.key === 'r' || event.key === 'R') {
      actions |= ACTION_RESTART;
    }
  }

  const queuedCards = [];
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  window.addEventListener('keydown', onKeyDown);

  return {
    // Spend and return this tick's action bits.
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    // Spend and return this tick's card-key presses, as hand indices.
    takeCardKeys() {
      const taken = queuedCards.slice();
      queuedCards.length = 0;
      return taken;
    },
    // Spend and return the last click point, or null.
    takeClick() {
      const taken = click;
      click = null;
      return taken;
    },
    // Where the pointer is now, in canvas coordinates (for hover lift).
    hoverPoint() {
      return hover;
    },
    // Which hand card the pointer is over right now, or -1: the boot
    // lifts it a little so the hand feels alive under the mouse.
    hoveredIndex(world) {
      const p = hover;
      if (p.x < 0) return -1;
      const hit = hitTest(world, p.x, p.y);
      return hit.kind === 'card' ? hit.index : -1;
    },
    // Where a click point lands: a hand card, the End Turn button, or
    // nowhere — the geometry lives in render.js.
    hitAt(world, point) {
      return hitTest(world, point.x, point.y);
    },
  };
}
