// render.js — everything the eye sees: the deep-sea table, the cards,
// the stance panel, the duel log, and the four screens.
//
// One canvas, 1280 by 720, painted from the world and nothing else: no
// images, no fonts from the network, every glyph drawn by hand. The
// palette is deep indigo and teal with coral, pearl and pale gold — a
// bioluminescent table, deliberately nothing like the ember-red felt the
// rest of the field is playing on.
//
// The painter is a pure function of (ctx, world): the same world paints
// the same frame. Background bubbles and light rays move on world.time,
// which only advances when the world steps, so a staged screenshot is
// frozen exactly where the staging left it.

import {
  CLASH_CARD,
  END_TURN_RECT,
  FIELD,
  GAME_SUBTITLE,
  GAME_TITLE,
  HAND_CARD,
  HAND_X0,
  RIVAL_CARD,
  RIVAL_NAME,
  RIVAL_TITLE,
  RIVAL_X0,
  SCREEN_LOSS,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_WIN,
  SUITS,
  TIDE_RECT,
} from './config.js';
import { hash1, hash2 } from './random.js';
import { stanceLine } from './rival.js';

const INK = '#12242e';
const PAPER = '#f7f2e4';
const PAPER_EDGE = '#e4d9bd';
const GOLD = '#e8c97a';
const GOLD_DIM = '#b39a55';
const TEXT = '#eaf6ff';
const MUTED = '#9fc3d4';
const PANEL = 'rgba(5, 24, 38, 0.82)';
const PANEL_LINE = 'rgba(140, 220, 255, 0.28)';
const CORAL_RED = '#ff8a66';
const TEAL = '#2fd6c8';

// ---------------------------------------------------------------- helpers

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, font, color, align = 'left', baseline = 'alphabetic') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(str, x, y);
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// ---------------------------------------------------------------- suit glyphs

// Each suit's shape, drawn in the suit's colour at (cx, cy) with radius r:
// a drop for Wave, a branching star for Coral, a fan for Shell, a leaf
// for Kelp. Colour and shape together carry the suit — never text alone.
export function drawSuitGlyph(ctx, suitKey, cx, cy, r, color) {
  const suit = SUITS[suitKey];
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2, r * 0.12);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (suit.glyph === 'drop') {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.bezierCurveTo(cx + r * 0.85, cy - r * 0.1, cx + r * 0.7, cy + r * 0.75, cx, cy + r * 0.8);
    ctx.bezierCurveTo(cx - r * 0.7, cy + r * 0.75, cx - r * 0.85, cy - r * 0.1, cx, cy - r);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - r * 0.28, cy + r * 0.28, r * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fill();
  } else if (suit.glyph === 'branch') {
    for (let i = 0; i < 5; i += 1) {
      const a = -Math.PI / 2 + (i - 2) * 0.62;
      const x2 = cx + Math.cos(a) * r * 0.9;
      const y2 = cy + Math.sin(a) * r * 0.9;
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 0.25);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x2, y2, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(cx, cy + r * 0.95);
    ctx.lineTo(cx, cy + r * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.15, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  } else if (suit.glyph === 'fan') {
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.55, r * 0.85, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(18, 36, 46, 0.5)';
    ctx.lineWidth = Math.max(1.5, r * 0.07);
    for (let i = -2; i <= 2; i += 1) {
      const a = -Math.PI / 2 + i * 0.42;
      ctx.beginPath();
      ctx.moveTo(cx, cy + r * 0.55);
      ctx.lineTo(cx + Math.cos(a) * r * 0.85, cy + r * 0.55 + Math.sin(a) * r * 0.85);
      ctx.stroke();
    }
  } else {
    // leaf
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.bezierCurveTo(cx + r * 0.95, cy - r * 0.3, cx + r * 0.7, cy + r * 0.8, cx, cy + r);
    ctx.bezierCurveTo(cx - r * 0.7, cy + r * 0.8, cx - r * 0.95, cy - r * 0.3, cx, cy - r);
    ctx.fill();
    ctx.strokeStyle = 'rgba(18, 36, 46, 0.45)';
    ctx.lineWidth = Math.max(1.5, r * 0.08);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.7);
    ctx.lineTo(cx, cy + r * 0.85);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the table

function paintTable(ctx, world) {
  const { width, height } = FIELD;
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#04101f');
  bg.addColorStop(0.55, '#0a2e3f');
  bg.addColorStop(1, '#0d3f4a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // The glow of the deep: a soft teal pool in the middle of the table.
  const glow = ctx.createRadialGradient(640, 330, 40, 640, 330, 520);
  glow.addColorStop(0, 'rgba(47, 214, 200, 0.16)');
  glow.addColorStop(0.6, 'rgba(47, 150, 200, 0.07)');
  glow.addColorStop(1, 'rgba(47, 150, 200, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Light rays falling from the surface, swaying slowly on the clock.
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#bfefff';
  for (let i = 0; i < 4; i += 1) {
    const sway = Math.sin(world.time * 0.12 + i * 1.7) * 18;
    const x0 = 180 + i * 300 + sway;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0 + 90, 0);
    ctx.lineTo(x0 + 190, height);
    ctx.lineTo(x0 + 40, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Rising bubbles: placed by a hash, rising on the clock, wrapping.
  for (let i = 0; i < 26; i += 1) {
    const x = hash2(i, 7) * width;
    const speed = 12 + hash1(i) * 26;
    const y = ((hash2(i, 13) * height - world.time * speed) % height + height) % height;
    const r = 1.5 + hash2(i, 29) * 5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(190, 240, 255, ${0.10 + hash2(i, 41) * 0.16})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fill();
  }

  // The sand floor at the bottom of the sea.
  const sand = ctx.createLinearGradient(0, 648, 0, height);
  sand.addColorStop(0, 'rgba(20, 58, 66, 0)');
  sand.addColorStop(1, 'rgba(14, 44, 52, 0.85)');
  ctx.fillStyle = sand;
  ctx.fillRect(0, 648, width, height - 648);
  for (let i = 0; i < 90; i += 1) {
    const x = hash2(i, 3) * width;
    const y = 656 + hash2(i, 11) * 58;
    ctx.fillStyle = `rgba(232, 201, 122, ${0.05 + hash2(i, 17) * 0.12})`;
    ctx.fillRect(x, y, 2, 2);
  }
}

// ---------------------------------------------------------------- cards

// One card face: pearl paper, a suit-coloured band with the name, a big
// cost ring, a big suit glyph, one line of rules, and a big power or
// shield number. `opts` may dim an unaffordable card or flag a selected
// one. The clash cards reuse this at a larger size.
export function drawCardFace(ctx, card, x, y, w, h, opts = {}) {
  const suit = SUITS[card.suit];
  const pop = opts.pop === undefined ? 1 : opts.pop;
  const cx = x + w / 2;
  ctx.save();
  if (pop < 1) {
    ctx.globalAlpha = pop;
    const s = 0.82 + 0.18 * pop;
    ctx.translate(cx, y + h / 2);
    ctx.scale(s, s);
    ctx.translate(-cx, -(y + h / 2));
  }
  if (opts.dim) ctx.globalAlpha = (opts.dim ? 0.5 : 1) * (pop < 1 ? pop : 1);

  // Paper.
  const paper = ctx.createLinearGradient(x, y, x, y + h);
  paper.addColorStop(0, PAPER);
  paper.addColorStop(1, PAPER_EDGE);
  rr(ctx, x, y, w, h, 12);
  ctx.fillStyle = paper;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = opts.selected ? GOLD : suit.color;
  ctx.stroke();

  // The cost ring's radius, shared by the band layout and the ring.
  const cr = Math.round(w * 0.15);

  // Name band. The name is centred in the band's free width — from the
  // cost ring's right edge to the card's right edge — so a long name
  // never runs under the ring.
  const bandH = Math.round(h * 0.16);
  rr(ctx, x + 3, y + 3, w - 6, bandH, 9);
  ctx.fillStyle = suit.color;
  ctx.fill();
  const nameCx = x + cr * 2 + (w - cr * 2) / 2;
  text(ctx, card.name.toUpperCase(), nameCx, y + 3 + bandH / 2 + 1, `bold ${Math.round(w * 0.095)}px Georgia, serif`, '#ffffff', 'center', 'middle');

  // Cost ring, top left, overlapping the band.
  const ccx = x + cr + 4;
  const ccy = y + bandH + cr * 0.35;
  ctx.beginPath();
  ctx.arc(ccx, ccy, cr, 0, Math.PI * 2);
  ctx.fillStyle = '#12242e';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = GOLD;
  ctx.stroke();
  text(ctx, String(card.cost), ccx, ccy + 1, `bold ${Math.round(cr * 1.05)}px Georgia, serif`, '#ffffff', 'center', 'middle');

  // The suit glyph, big and centred — the card's face at thumbnail size.
  // The name sits below it with a clear gap, and the rules line below
  // that, clear of the big number's caption at the bottom.
  drawSuitGlyph(ctx, card.suit, cx, y + h * 0.44, Math.round(w * 0.21), suit.color);
  text(ctx, suit.name.toUpperCase(), cx, y + h * 0.62, `bold ${Math.round(w * 0.085)}px Georgia, serif`, suit.dark, 'center');

  // One line of rules, never a paragraph. It sits clear of the big
  // number and its caption below it.
  text(ctx, card.text, cx, y + h * 0.73, `${Math.round(w * 0.068)}px system-ui, sans-serif`, '#3a4a52', 'center');

  // The big number: power for a strike, shield for a guard.
  if (card.kind === 'guard') {
    text(ctx, `+${card.shield}`, x + w - 12, y + h - 12, `bold ${Math.round(w * 0.19)}px Georgia, serif`, '#0b5fa5', 'right');
    text(ctx, 'SHIELD', x + w - 12, y + h - 12 - Math.round(w * 0.19) - 2, `bold ${Math.round(w * 0.06)}px system-ui, sans-serif`, '#0b5fa5', 'right');
  } else {
    text(ctx, String(card.shown !== undefined ? card.shown : card.power), x + w - 12, y + h - 12, `bold ${Math.round(w * 0.19)}px Georgia, serif`, INK, 'right');
    text(ctx, 'ATK', x + w - 12, y + h - 12 - Math.round(w * 0.19) - 2, `bold ${Math.round(w * 0.06)}px system-ui, sans-serif`, INK, 'right');
  }

  // Surge cards wear their payoff on their face.
  if (card.kind === 'surge') {
    text(ctx, 'SURGE +2', x + 10, y + h - 12, `bold ${Math.round(w * 0.07)}px system-ui, sans-serif`, suit.dark, 'left');
  }
  ctx.restore();
}

// The back of a card: deep teal with a pale wave ring.
export function drawCardBack(ctx, x, y, w, h) {
  const back = ctx.createLinearGradient(x, y, x + w, y + h);
  back.addColorStop(0, '#0e4a5a');
  back.addColorStop(1, '#072a38');
  rr(ctx, x, y, w, h, 10);
  ctx.fillStyle = back;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = GOLD_DIM;
  ctx.stroke();
  rr(ctx, x + 6, y + 6, w - 12, h - 12, 7);
  ctx.strokeStyle = 'rgba(232, 201, 122, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  drawSuitGlyph(ctx, 'wave', x + w / 2, y + h / 2, Math.round(w * 0.2), 'rgba(140, 220, 255, 0.65)');
}

// The deck pile and the spent pile, left of the clash.
function drawPiles(ctx, world) {
  const { player } = world;
  drawCardBack(ctx, 40, 190, 100, 140);
  text(ctx, `DECK ${player.deck.length}`, 90, 352, 'bold 15px system-ui, sans-serif', TEXT, 'center');
  const spent = player.discard.length + world.played.you.length + world.played.rival.length;
  ctx.save();
  ctx.globalAlpha = 0.85;
  drawCardBack(ctx, 52, 352, 76, 106);
  ctx.restore();
  text(ctx, `SPENT ${spent}`, 90, 480, 'bold 15px system-ui, sans-serif', MUTED, 'center');
}

// ---------------------------------------------------------------- header

function drawLifeBar(ctx, x, y, w, life, max, shield, fillA, fillB) {
  rr(ctx, x, y, w, 22, 11);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fill();
  const frac = clamp01(life / max);
  if (frac > 0) {
    const grad = ctx.createLinearGradient(x, y, x + w, y);
    grad.addColorStop(0, fillA);
    grad.addColorStop(1, fillB);
    rr(ctx, x + 2, y + 2, Math.max(8, (w - 4) * frac), 18, 9);
    ctx.fillStyle = grad;
    ctx.fill();
  }
  text(ctx, `${life} / ${max}`, x + w / 2 - (shield > 0 ? 24 : 0), y + 16, 'bold 14px system-ui, sans-serif', '#ffffff', 'center', 'middle');
  // Shield, right-aligned inside the bar, so it can never run over the
  // next card or pile beside the bar.
  if (shield > 0) {
    text(ctx, `+${shield} SHIELD`, x + w - 8, y + 16, 'bold 11px system-ui, sans-serif', '#bfe9ff', 'right', 'middle');
  }
}

function drawRivalPortrait(ctx, x, y, r, time) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#160d2e';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = GOLD;
  ctx.stroke();
  // Nereida: a jellyfish dome in coral, tentacles trailing below.
  ctx.beginPath();
  ctx.arc(x, y - 4, r * 0.52, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#ff7a59';
  ctx.fill();
  ctx.strokeStyle = '#ffb59e';
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i += 1) {
    const tx = x + i * r * 0.2;
    ctx.beginPath();
    ctx.moveTo(tx, y + r * 0.42);
    ctx.quadraticCurveTo(tx + Math.sin(time * 1.4 + i) * 4, y + r * 0.7, tx, y + r * 0.95);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x - r * 0.2, y - r * 0.12, r * 0.07, 0, Math.PI * 2);
  ctx.arc(x + r * 0.2, y - r * 0.12, r * 0.07, 0, Math.PI * 2);
  ctx.fillStyle = '#160d2e';
  ctx.fill();
}

function drawHeader(ctx, world) {
  const { rival } = world;
  // Rival identity, top left.
  drawRivalPortrait(ctx, 64, 62, 40, world.time);
  text(ctx, RIVAL_NAME, 116, 42, 'bold 24px Georgia, serif', GOLD);
  text(ctx, RIVAL_TITLE, 116, 66, '13px system-ui, sans-serif', MUTED);
  drawLifeBar(ctx, 116, 80, 300, rival.life, 20, rival.shield, '#ff7a59', '#ffb59e');

  // Her face-down hand, top centre — at most five backs, so a big hand
  // never runs over the TURN readout; the extras count on a chip.
  const shownRival = Math.min(5, rival.hand.length);
  for (let i = 0; i < shownRival; i += 1) {
    drawCardBack(ctx, RIVAL_X0 + i * (RIVAL_CARD.width + RIVAL_CARD.gap), RIVAL_CARD.y, RIVAL_CARD.width, RIVAL_CARD.height);
  }
  if (rival.hand.length > shownRival) {
    const ccx = RIVAL_X0 + (shownRival - 1) * (RIVAL_CARD.width + RIVAL_CARD.gap) + RIVAL_CARD.width - 12;
    const ccy = RIVAL_CARD.y + 12;
    ctx.beginPath();
    ctx.arc(ccx, ccy, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#12242e';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = GOLD;
    ctx.stroke();
    text(ctx, `+${rival.hand.length - shownRival}`, ccx, ccy + 1, 'bold 12px system-ui, sans-serif', '#ffffff', 'center', 'middle');
  }
  text(ctx, 'RIVAL HAND', RIVAL_X0 + 2, RIVAL_CARD.y + RIVAL_CARD.height + 16, 'bold 11px system-ui, sans-serif', MUTED);

  // The turn, top centre-right.
  text(ctx, `TURN ${Math.max(1, world.turn)}`, 900, 40, 'bold 26px Georgia, serif', TEXT, 'center');
  text(ctx, 'tide refills each turn', 900, 64, '12px system-ui, sans-serif', MUTED, 'center');

  // The stance panel, top right: the readable heart of the duel.
  const px = 1052;
  const py = 12;
  const pw = 204;
  const ph = 106;
  rr(ctx, px, py, pw, ph, 10);
  ctx.fillStyle = PANEL;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = SUITS[rival.stance].color;
  ctx.stroke();
  text(ctx, 'RIVAL STANCE', px + 12, py + 20, 'bold 11px system-ui, sans-serif', GOLD);
  drawSuitGlyph(ctx, rival.stance, px + 36, py + 56, 24, SUITS[rival.stance].color);
  text(ctx, SUITS[rival.stance].name.toUpperCase(), px + 68, py + 50, 'bold 21px Georgia, serif', TEXT);
  const line = stanceLine(rival.stance);
  text(ctx, line.slice(line.indexOf('—') + 2), px + 12, py + 82, '12px system-ui, sans-serif', MUTED);
  text(ctx, `NEXT: ${SUITS[rival.nextStance].name.toUpperCase()}`, px + 12, py + 100, 'bold 12px system-ui, sans-serif', SUITS[rival.nextStance].color);
}

// ---------------------------------------------------------------- clash + log

// Nereida herself, looming behind the clash: a giant jellyfish, drawn
// faint and far back so the cards stay in front and stay readable. The
// dome caps above the clash row, the tentacles trail behind the cards
// and show in the gaps and below them — a focal point, not a curtain.
// Alpha stays low on purpose: if this ever fights the cards, the fix
// is to dim it further, never to move the cards.
function drawNereidaFigure(ctx, world) {
  const cx = 640;
  const domeY = 315;
  const r = 205;
  // Warm halo behind the whole clash, so the figure reads as one glow.
  const halo = ctx.createRadialGradient(cx, 310, 30, cx, 310, 340);
  halo.addColorStop(0, 'rgba(255, 122, 89, 0.10)');
  halo.addColorStop(0.6, 'rgba(255, 122, 89, 0.04)');
  halo.addColorStop(1, 'rgba(255, 122, 89, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(cx - 340, 0, 680, 560);
  // The dome: a half-disc rising above the clash row.
  const dome = ctx.createRadialGradient(cx, 190, 20, cx, 240, r);
  dome.addColorStop(0, 'rgba(255, 170, 140, 0.17)');
  dome.addColorStop(0.7, 'rgba(255, 122, 89, 0.10)');
  dome.addColorStop(1, 'rgba(255, 122, 89, 0.04)');
  ctx.beginPath();
  ctx.arc(cx, domeY, r, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = dome;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255, 181, 158, 0.38)';
  ctx.stroke();
  // Inner dome, a second shell of light.
  ctx.beginPath();
  ctx.arc(cx, domeY, r * 0.62, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 190, 160, 0.09)';
  ctx.fill();
  // Her eyes on the dome cap, above the cards: she is watching the duel.
  ctx.fillStyle = 'rgba(22, 13, 46, 0.55)';
  ctx.beginPath();
  ctx.arc(cx - 52, 168, 7, 0, Math.PI * 2);
  ctx.arc(cx + 52, 168, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(232, 201, 122, 0.85)';
  ctx.beginPath();
  ctx.arc(cx - 50, 166, 2, 0, Math.PI * 2);
  ctx.arc(cx + 54, 166, 2, 0, Math.PI * 2);
  ctx.fill();
  // Tentacles trailing behind the cards, swaying slowly on the clock.
  ctx.strokeStyle = 'rgba(255, 150, 120, 0.20)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = -3; i <= 3; i += 1) {
    const tx = cx + i * 52;
    const sway = Math.sin(world.time * 1.1 + i * 1.3) * 10;
    ctx.beginPath();
    ctx.moveTo(tx, domeY - 6);
    ctx.quadraticCurveTo(tx + sway, domeY + 80, tx + sway * 0.6, domeY + 155);
    ctx.stroke();
  }
}

function drawClash(ctx, world) {
  // The figure first: everything else in the clash paints over her.
  drawNereidaFigure(ctx, world);
  // The banner: the last surge or counter, or the turn's invitation.
  // Never on an end screen: the headline ribbon owns that space now,
  // and a stale banner would fight it.
  if (world.screen === SCREEN_PLAY && world.banner && world.time - world.bannerBorn < 6) {
    text(ctx, world.banner, 640, 152, 'bold 20px Georgia, serif', GOLD, 'center');
  }

  const you = world.played.you;
  const foe = world.played.rival;
  const cardW = CLASH_CARD.width;
  const cardH = CLASH_CARD.height;
  const cy = 196;
  const YOU_X = 300;
  const FOE_X = 688;

  text(ctx, 'YOU PLAYED', YOU_X, 186, 'bold 13px system-ui, sans-serif', MUTED);
  if (you.length === 0) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    rr(ctx, YOU_X, cy, cardW, cardH, 12);
    ctx.strokeStyle = PANEL_LINE;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();
    text(ctx, 'play a card', YOU_X + cardW / 2, cy + cardH / 2, '14px system-ui, sans-serif', MUTED, 'center', 'middle');
  } else {
    you.forEach((card, i) => {
      const pop = clamp01((world.time - card.born) / 0.22);
      drawCardFace(ctx, card, YOU_X + i * (cardW + 14), cy, cardW, cardH, { pop });
    });
  }

  text(ctx, 'VS', 672, cy + cardH / 2 + 8, 'bold 24px Georgia, serif', CORAL_RED, 'center', 'middle');

  text(ctx, 'SHE PLAYED', FOE_X, 186, 'bold 13px system-ui, sans-serif', MUTED);
  if (foe.length === 0) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    rr(ctx, FOE_X, cy, cardW, cardH, 12);
    ctx.strokeStyle = PANEL_LINE;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();
    text(ctx, 'Nereida waits', FOE_X + cardW / 2, cy + cardH / 2, '14px system-ui, sans-serif', MUTED, 'center', 'middle');
  } else {
    foe.forEach((card, i) => {
      const pop = clamp01((world.time - card.born) / 0.22);
      drawCardFace(ctx, card, FOE_X + i * (cardW + 14), cy, cardW, cardH, { pop });
    });
  }

  // Floating damage and shield numbers.
  for (const fx of world.fx) {
    const age = (world.time - fx.born) / fx.dur;
    if (age < 0 || age > 1) continue;
    ctx.save();
    ctx.globalAlpha = 1 - age;
    text(ctx, fx.text, fx.x, fx.y - age * 46, 'bold 30px Georgia, serif', fx.color, 'center');
    ctx.restore();
  }
}

function drawLog(ctx, world) {
  const lx = 1052;
  const ly = 130;
  const lw = 204;
  // Shorter panel than before (210, was 330): the log now holds five
  // punchy lines at a bigger size, and the Surge explainer moved to the
  // title screen, which already states the rule in full.
  const lh = 210;
  rr(ctx, lx, ly, lw, lh, 10);
  ctx.fillStyle = PANEL;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = PANEL_LINE;
  ctx.stroke();
  text(ctx, 'THE DUEL SO FAR', lx + 12, ly + 22, 'bold 12px system-ui, sans-serif', GOLD);
  // Wrap long lines to the panel's width so no log line ever runs past
  // the panel's edge, then show the last five wrapped lines, at 16 px
  // (was 12 px) so the duel's story still reads at thumbnail size.
  ctx.font = '16px system-ui, sans-serif';
  const wrapped = [];
  for (const line of world.log) {
    const words = line.split(' ');
    let cur = '';
    for (const word of words) {
      const trial = cur === '' ? word : `${cur} ${word}`;
      if (ctx.measureText(trial).width > lw - 24 && cur !== '') {
        wrapped.push(cur);
        cur = word;
      } else {
        cur = trial;
      }
    }
    if (cur !== '') wrapped.push(cur);
  }
  const shown = wrapped.slice(-5);
  shown.forEach((line, i) => {
    text(ctx, line, lx + 12, ly + 54 + i * 27, '16px system-ui, sans-serif', i === shown.length - 1 ? TEXT : MUTED);
  });
}

// ---------------------------------------------------------------- bottom

export function handCardRect(world, i) {
  const x = HAND_X0 + i * (HAND_CARD.width + HAND_CARD.gap);
  const lifted = world.selected === i || world.hovered === i;
  return {
    x,
    y: HAND_CARD.y - (lifted ? HAND_CARD.lift : 0),
    width: HAND_CARD.width,
    height: HAND_CARD.height,
  };
}

function drawBottom(ctx, world) {
  const { player } = world;
  // You, bottom left.
  text(ctx, 'YOU', 24, 500, 'bold 20px Georgia, serif', TEXT);
  drawLifeBar(ctx, 24, 514, 206, player.life, 20, player.shield, '#2fd6c8', '#7fe8d8');
  text(ctx, 'YOUR HAND — click a card,', 24, 566, '12px system-ui, sans-serif', MUTED);
  text(ctx, 'or press 1–5 to play it.', 24, 584, '12px system-ui, sans-serif', MUTED);
  text(ctx, 'Enter ends the turn · M mutes', 24, 612, '12px system-ui, sans-serif', MUTED);

  // The hand itself.
  player.hand.forEach((card, i) => {
    const rect = handCardRect(world, i);
    const afford = card.cost <= player.tide;
    drawCardFace(ctx, card, rect.x, rect.y, rect.width, rect.height, {
      dim: !afford,
      selected: world.selected === i,
      pop: 1,
    });
    text(ctx, String(i + 1), rect.x + rect.width / 2, rect.y - 8, 'bold 12px system-ui, sans-serif', MUTED, 'center');
  });

  // Tide pips, above the End Turn button.
  rr(ctx, TIDE_RECT.x, TIDE_RECT.y, TIDE_RECT.width, TIDE_RECT.height, 10);
  ctx.fillStyle = PANEL;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = PANEL_LINE;
  ctx.stroke();
  text(ctx, `TIDE  ${player.tide} / ${player.tideMax}`, TIDE_RECT.x + 12, TIDE_RECT.y + 30, 'bold 16px system-ui, sans-serif', TEXT);
  for (let i = 0; i < player.tideMax; i += 1) {
    ctx.beginPath();
    ctx.arc(TIDE_RECT.x + 128 + i * 18, TIDE_RECT.y + 24, 6, 0, Math.PI * 2);
    ctx.fillStyle = i < player.tide ? '#2fd6c8' : 'rgba(255,255,255,0.18)';
    ctx.fill();
  }

  // The End Turn button.
  const b = END_TURN_RECT;
  const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.height);
  grad.addColorStop(0, '#e8c97a');
  grad.addColorStop(1, '#c9a24a');
  rr(ctx, b.x, b.y, b.width, b.height, 12);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#8a6d2b';
  ctx.stroke();
  text(ctx, 'END TURN', b.x + b.width / 2, b.y + 40, 'bold 26px Georgia, serif', '#241a05', 'center');
  text(ctx, '[Enter]', b.x + b.width / 2, b.y + 66, 'bold 13px system-ui, sans-serif', '#5c4a1e', 'center');
}

// ---------------------------------------------------------------- screens

function drawTitle(ctx, world) {
  ctx.fillStyle = 'rgba(3, 12, 22, 0.62)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);

  text(ctx, GAME_TITLE, 640, 148, 'bold 72px Georgia, serif', GOLD, 'center');
  text(ctx, GAME_SUBTITLE, 640, 186, 'italic 22px Georgia, serif', TEXT, 'center');

  // The rules, in three short lines — the whole duel at a glance.
  const rules = [
    'Play cards with tide. First to 0 life loses.',
    'Two of one suit in a turn — the second SURGES +2.',
    'Beat her stance and your strike COUNTERS ×2.',
  ];
  rules.forEach((line, i) => {
    text(ctx, line, 640, 246 + i * 30, '17px system-ui, sans-serif', TEXT, 'center');
  });

  // The four suits, each with its shape, its name, and what it beats.
  const legend = ['wave', 'coral', 'shell', 'kelp'];
  legend.forEach((key, i) => {
    const cx = 400 + i * 160;
    drawSuitGlyph(ctx, key, cx, 372, 26, SUITS[key].color);
    text(ctx, SUITS[key].name.toUpperCase(), cx, 414, 'bold 16px Georgia, serif', TEXT, 'center');
    text(ctx, `beats ${SUITS[SUITS[key].beats].name}`, cx, 436, '13px system-ui, sans-serif', MUTED, 'center');
  });

  // Three sample cards, fanned in the middle of the title.
  const samples = [
    { id: 'w2', suit: 'wave', name: 'Breaker', kind: 'strike', cost: 2, power: 2, shield: 0, text: 'Deal 2.' },
    { id: 'c5', suit: 'coral', name: 'Spire', kind: 'surge', cost: 2, power: 1, shield: 0, text: 'Deal 1. +2 if Coral.' },
    { id: 's3', suit: 'shell', name: 'Nacre', kind: 'guard', cost: 1, power: 0, shield: 3, text: 'Gain 3 shield.' },
  ];
  samples.forEach((card, i) => {
    drawCardFace(ctx, card, 430 + i * 160, 470, 140, 186, { pop: 1 });
  });

  // The prompt is solid gold, never a blink frozen mid-fade in a shot.
  text(ctx, 'CLICK OR PRESS ENTER TO DIVE IN', 640, 700 - 24, 'bold 18px system-ui, sans-serif', GOLD, 'center');
}

function drawEndScreen(ctx, world, won) {
  // A lighter veil than before (0.55, was 0.68): the clash cards are
  // the evidence of the duel and must stay readable under it.
  ctx.fillStyle = 'rgba(3, 12, 22, 0.55)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  const title = won ? 'THE TIDE IS YOURS' : 'THE DEEP KEEPS YOU';
  const color = won ? GOLD : CORAL_RED;
  const sub = won
    ? 'Nereida’s light goes out — the duel is yours.'
    : 'Nereida wins — the tide takes its due.';
  // Headline ribbon ABOVE the clash row (y 120–174): it never covers a
  // card name again. The ribbon sits between the rival-hand label
  // (baseline 116) and the YOU PLAYED / SHE PLAYED labels (baseline
  // 186), clear of both.
  const rx = 300;
  const rw = 680;
  const ry = 120;
  const rh = 54;
  rr(ctx, rx, ry, rw, rh, 12);
  ctx.fillStyle = 'rgba(5, 24, 38, 0.88)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
  text(ctx, title, 640, ry + rh / 2 + 1, 'bold 38px Georgia, serif', color, 'center', 'middle');
  // Sub and stats in the gap below the clash cards (420) and above the
  // hand (496); the life line folds into the stats line so nothing
  // reaches the hand numbers at y 488.
  text(ctx, sub, 640, 446, 'italic 20px Georgia, serif', TEXT, 'center');
  const r = world.result || { turns: world.turn, damageDealt: 0, surges: 0, counters: 0 };
  const statsLine = won
    ? `Won in ${r.turns} turns · ${r.damageDealt} damage dealt · ${r.surges} surges · ${r.counters} counters · Nereida ${world.rival.life} life · You ${world.player.life} life`
    : `Lasted ${r.turns} turns · ${r.damageDealt} damage dealt · ${r.surges} surges · ${r.counters} counters · Nereida ${world.rival.life} life · You ${world.player.life} life`;
  text(ctx, statsLine, 640, 472, '17px system-ui, sans-serif', TEXT, 'center');
  // The prompt moves below the hand, into the sand: it used to sit in
  // the same gap the sub and stats now need.
  // The prompt is solid gold, never a blink frozen mid-fade in a shot.
  text(ctx, 'PRESS ENTER TO DUEL AGAIN', 640, 712, 'bold 18px system-ui, sans-serif', GOLD, 'center');
}

// The one entry point: paint the whole frame for this world.
export function drawScene(ctx, world) {
  ctx.clearRect(0, 0, FIELD.width, FIELD.height);
  paintTable(ctx, world);
  if (world.screen === SCREEN_TITLE) {
    drawTitle(ctx, world);
    return;
  }
  drawHeader(ctx, world);
  drawPiles(ctx, world);
  drawClash(ctx, world);
  drawLog(ctx, world);
  drawBottom(ctx, world);
  if (world.screen === SCREEN_WIN) drawEndScreen(ctx, world, true);
  if (world.screen === SCREEN_LOSS) drawEndScreen(ctx, world, false);
}

// Hit-testing for the input belt, in the same coordinates the painter
// uses: the hand cards first, then the End Turn button. (No canvas
// needed: the geometry is pure arithmetic on the world.)
export function hitTest(world, px, py) {
  if (world.screen !== SCREEN_PLAY) return { kind: 'anywhere' };
  for (let i = 0; i < world.player.hand.length; i += 1) {
    const r = handCardRect(world, i);
    if (px >= r.x && px <= r.x + r.width && py >= r.y && py <= r.y + r.height) {
      return { kind: 'card', index: i };
    }
  }
  const b = END_TURN_RECT;
  if (px >= b.x && px <= b.x + b.width && py >= b.y && py <= b.y + b.height) {
    return { kind: 'endTurn' };
  }
  return { kind: 'none' };
}
