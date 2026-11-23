// Tideglass Duel — the hand-in program for make.fun's "Make the best
// card game" bounty. Node 22, standard library only. The game itself is
// plain static files under game/ (game/index.html plus its ES modules, no
// library, no network request at runtime); this program copies game/ and
// screenshots/ next to it into /output and writes /output/dossier.json
// with the vendored make.fun library, so the judge can read the game
// from the dossier.
//
// Play it locally with `node serve.ts` (http://localhost:8080). Outside
// the grader's container MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Two runs write byte-identical /output (same files in, same dossier
// out); see build-log.md for the validation runs.

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const handInRoot = fileURLToPath(new URL('.', import.meta.url));
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const playDir = join(handInRoot, 'game');
const shotDir = join(handInRoot, 'screenshots');

const SHOT_BYTE_CAP = 262144;
const TREE_ENTRY_CAP = 993;
const TREE_BYTE_CAP = 50331648;
const PATH_BYTE_CAP = 1000;

/** Walk a directory and count every file and directory below it. */
function tallyTree(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    total += 1;
    if (entry.isDirectory()) total += tallyTree(join(dir, entry.name));
  }
  return total;
}

/** Walk a directory and sum the bytes of every file below it. */
function sumTreeBytes(dir) {
  let bytes = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) bytes += sumTreeBytes(path);
    else bytes += statSync(path).size;
  }
  return bytes;
}

/** Every path below a directory, relative to it, in walk order. */
function walkPaths(dir, prefix = '') {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    out.push(rel);
    if (entry.isDirectory()) out.push(...walkPaths(join(dir, entry.name), rel));
  }
  return out;
}

/**
 * Refuse a hand-in the gate would refuse, with a readable reason, before
 * a single file is copied: a missing game/index.html, the wrong number
 * of screenshots, an oversized screenshot, or a game/ past the file,
 * byte or path caps. Nothing here changes the bytes of a valid entry —
 * it only fails loudly instead of handing in something the scorer would
 * reject.
 */
function refuseBadEntry() {
  if (!existsSync(join(playDir, 'index.html'))) {
    throw new Error('hand-in refused: game/index.html is missing');
  }
  if (!existsSync(shotDir)) throw new Error('hand-in refused: screenshots/ is missing');
  const shots = readdirSync(shotDir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > 4) {
    throw new Error(`hand-in refused: expected 3-4 screenshots, found ${shots.length}`);
  }
  for (const shot of shots) {
    const size = statSync(join(shotDir, shot)).size;
    if (size > SHOT_BYTE_CAP) {
      throw new Error(`hand-in refused: ${shot} is ${size} bytes (cap ${SHOT_BYTE_CAP})`);
    }
    // The gate's own name rule for screenshots: letters, digits and
    // . _ - only, never starting with . or -, at most 128 characters.
    if (!/^[A-Za-z0-9_][A-Za-z0-9._-]{0,127}$/.test(shot) || shot.startsWith('-')) {
      throw new Error(`hand-in refused: screenshot name ${shot} breaks the gate's name rule`);
    }
  }
  const entries = tallyTree(playDir);
  if (entries > TREE_ENTRY_CAP) {
    throw new Error(`hand-in refused: game/ holds ${entries} entries (cap ${TREE_ENTRY_CAP})`);
  }
  if (sumTreeBytes(playDir) > TREE_BYTE_CAP) {
    throw new Error('hand-in refused: game/ is over the 48 MiB cap');
  }
  for (const rel of walkPaths(playDir)) {
    if (Buffer.byteLength(rel, 'utf8') > PATH_BYTE_CAP) {
      throw new Error(`hand-in refused: game/${rel} is over ${PATH_BYTE_CAP} bytes long`);
    }
  }
}

refuseBadEntry();

mkdirSync(targetDir, { recursive: true });
cpSync(playDir, join(targetDir, 'game'), { recursive: true });
mkdirSync(join(targetDir, 'screenshots'), { recursive: true });
cpSync(shotDir, join(targetDir, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the rest mirror what the gate refuses, so a preflighted
// entry cannot trip them (more than 4 screenshots or one over 256 KiB;
// more than 993 files in game/ or 48 MiB of game files in all, or a path
// under game/ over 1000 bytes; game/ counts beside /output's own
// 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(targetDir, 'dossier.json'),
  buildDossier(targetDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: SHOT_BYTE_CAP },
    game_max_files: TREE_ENTRY_CAP,
    game_max_bytes: TREE_BYTE_CAP,
    game_path_max_bytes: PATH_BYTE_CAP,
  }),
);
