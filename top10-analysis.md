# Top-10 analysis — best-card-game-20261122-1826

Written 23 Nov 2026 ~07:30 WIB, pre-build (build SEKALI, klasifikasi BERAT).
Competition: opens 22 Nov 18:26 UTC (23 Nov 01:26 WIB), deadline 23 Nov 06:26 UTC
(13:26 WIB), $50 (top 10: $12/$8/$6/$5/$4/$3×5), 3,717 submissions.
Blind rounds: 4 (cutoffs 04:26 / 07:26 / 10:26 / 13:26 WIB); round 1 judged,
2,744 entries ranked — board hidden. Next round cutoff 10:26 WIB: an entry
submitted before that enters round 3.

## What could actually be observed (honest limitation)

The leaderboard is BLIND: `GET .../leaderboard` returns `entries: []`,
`metrics_withheld: true`; `GET .../rounds` returns `ranked: [2744, null, null,
null]`, board hidden. **No live top-10 entry can be identified, so there is no
verified top-10 list.** What IS visible: `GET .../submissions` (page 1, 50
items, newest first) — 25 of them `finished` with a judged `artifact.webp`.
This analysis is built on the first 10 finished artifacts, ALL VIEWED
(`top10-ref/01–10-*.webp`, covers only — artifact.webp is the cover
screenshot, not the judge's contact sheet), plus (a) the judge's five
published criteria in competition.yaml, (b) the kit starter baseline, (c)
field facts (3,717 submissions, final cut = top 40 dev board → 3 Swiss rounds
→ playoff top 12).

CORRECTION of the 06:12 watch note: seen-competitions.json said "belum buka
(opens 23 Nov 13:26 WIB)" — that mistook the DEADLINE (13:26 WIB) for the
opening. The competition opened 01:26 WIB; it was already open at 06:12.
That is why no top10-analysis existed and no build had started. Verified live
07:26 WIB: status open, acceptingSubmissions true, can_submit true.

## The 10 field entries viewed (covers, created 07:22–07:24 WIB)

| # | Handle | Title | Cover shows |
|---|--------|-------|-------------|
| 1 | durmogati | Ember Duel | Title overlay ON live table: opp hand 5 face-down top, player hand 5 bottom (costs, names, suits), life 20/20 both, embers 3/3 |
| 2 | clever-sparrow-32 | Ashen Duel | Title screen only + 3 sample cards, dark bg. No table in cover |
| 3 | ninjahatori | Ashen Tide | Title modal over dimmed table + rules text (play / attack / guard / surge) |
| 4 | richkys1 | Ember Court | Menu: Duel / Campaign (5-rival ladder) / Deckbuilder (24-card deck) / How to play. No table in cover |
| 5 | plucky-gecko-56 | Ember Duel — Court of Cinders | **THE BAR.** Full mid-duel: opp portrait + life 11/20, turn 4, opp hand 5 face-down, centre clash YOU PLAYED vs SHE PLAYED (Wildfire 6 ATK vs Stone Wall 7 shield), duel-log sidebar with play-by-play, player life 14/20 (+3 shield), embers, 5-card hand (cost dots, ATK, suits by colour+shape), END TURN button |
| 6 | lively-fox-91-9301 | Ember Sigil Duel | Title, green felt, 4 sigils (triangle/circle/diamond/square) + colours, Resonance mechanic (two same-sigil cards +2) |
| 7 | calm-coyote-92 | Ember Duel | Title on EMPTY green table, faint zone labels (WITCH BOARD / YOUR BOARD / YOUR HAND). Weakest cover |
| 8 | gunawan-1357 | RUNEFALL — Battle of the Three Lanes | Title + how-to box: 3 lanes, 4 suits, 6 rounds, matching-lane +2, Wild Runes, Shatter Runes. Distinct lane mechanic. Life 20 vs 20 in header |
| 9 | opik-sopian | Galebound: Duel of the Four Winds | Title, 4 winds (Ember/Tide/Gale/Stone) as shape+colour chips. Title-only |
| 10 | akd170396 | GLYPHBOUND | **Near-bar.** Full mid-duel: rival Vex 30 life, RIVAL STANCE panel ("EMBER — beats Gale, counter with Tide"), rival strike 2+3, "Vex strikes for 14!", your strike 4+5+8 Guard, deck 12, spent 12, 4-card hand, "Click a card to guard — Tide parries double. Or take the hit." + TAKE THE HIT button, round 3 |

## Field patterns (what the judge is already seeing all day)

- **Theme clustering is extreme: 7/10 are ember/ash fantasy duels, 3 literally
  titled "Ember Duel".** Dark green/red felt + gold serif title is the
  default look. Criterion 4 (look/originality) is WON by NOT being another
  ember duel — a different theme + palette is the single biggest differentiator
  available.
- **4-element suit system is near-universal** (Flame/Tide/Leaf/Stone or
  Ember/Tide/Gale/Stone), told apart by colour AND shape (triangle/circle/
  diamond/square, flame drop / tide drop / leaf). The judge explicitly wants
  suits told apart by colour and shape, never text alone — the field already
  does this; we must too, and must not regress to text-only suits.
- **Standard frame: life 20 (or 30), mana/embers per turn, hand of 5,
  Slay-the-Spire-like play-a-card-then-End-Turn.** Any entry that only does
  this is interchangeable with dozens of others.
- **Depth hooks seen (each in 1–2 entries):** Resonance (same-sigil pair +2),
  Surge (two of one suit in a turn, second +2), Guard/taunt, 3-lane scoring,
  campaign ladder + deckbuilder, readable rival stance with beats/counter.
- **Strongest covers are mid-duel tables (#5, #10, #1)** — they show
  criterion 1 in ONE frame (both hands, life totals, played cards clashing,
  readable values). **Title-only covers (#2, #6, #7, #9) waste the cover:**
  the judge's contact sheet puts the cover large on top and it carries most
  of the 1,536 judge-view tokens; a title-only cover tells the judge almost
  nothing about whether the game is complete.
- **Weaknesses seen:** empty table (#7), card text unreadable at thumbnail
  size (several), generic dark felt everywhere, three entries sharing one
  title ("Ember Duel") — a judge comparing two of them has little to tell
  apart.

## The known baseline: kit starter "Block Dodger" (house game #2)

- Dodge-and-collect, NO cards, NO hands, NO table. Fails judge criterion 1
  outright. It is the floor, not the bar: any complete card game beats it by a
  wide margin. The real bar is the other complete entries — #5/#10 above.

## Our entry vs the judge's five criteria (design targets)

1. **Complete card game in screenshots (most important):** cover MUST be a
   mid-duel table like #5/#10 — both hands visible, life totals, played-card
   clash, cost/values readable at thumbnail size. 4 screenshots: 1-cover
   mid-duel table, 2-title, 3-win, 4-loss. Title screen must name the game
   and show the rules in one glance; win AND loss screens both real renders.
2. **Fun and depth:** a mechanic beyond mana+attack that the screenshots can
   SHOW — e.g. a readable rival stance/intent panel (like #10's "beats X,
   counter with Y") + a combo system (pair/surge) with visible payoff, and
   an opponent whose choices can be read and countered. Cards must combine
   in more than one way (attack / guard / combo / counter), not just "play
   biggest number".
3. **Feel and polish:** cards that slide/flip/snap (animate deal + play),
   a dealt hand with weight, a win that lands with a flourish (win screen
   with totals), synthesised WebAudio, keyboard + mouse both working.
4. **Look and originality: AVOID ember/ash + dark-green felt entirely.**
   Pick a visually distinct theme and palette (NOT red/gold-on-dark-green),
   original names, suits told apart by colour AND shape. Cards legible at
   thumbnail size: big cost numeral, big suit glyph, short name, one-line
   effect — no paragraph text on cards.
5. **Structure:** source split into files with one clear job each, named for
   what they do (config, deck, ai/rival, world/state, render, audio, shots,
   main) + main.ts hand-in + serve.ts; dossier < 1.5 MiB; vendor/
   makefun-game.ts unchanged (kit sha256 as in kit).

## Field reading

- 3,717 submissions in a 12-hour window; round 1 already ranked 2,744.
  Most of the field is thin (starter clones, title-only covers, single-
  mechanic toys): the gate + criterion 1 cut most of them. A complete,
  winnable, demonstrably losable game whose COVER alone shows the full table
  should clear the top-40 dev-board cut for the final heat. The top-10 prize
  line is a different fight: it needs beating the other complete, polished
  games — #5/#10-class covers plus a theme that is not ember. Our sharpest
  edge available is (theme originality + cover completeness); our softest
  spot to guard is card legibility at thumbnail size and proving the game is
  winnable AND losable (autopilot win + reckless loss, like heist r3).
- Blind rounds mean no provisional rank exists for anyone until their own
  round lands; round 3 cutoff is 10:26 WIB. Build once, correctly, now.

## Verdict sought from Goldfish

Does this entry, as built, deserve LAYAK SUBMIT — and, honestly, what rank
range (of 3,717) and what chance of top 40 / top 10? Per the user's standing
rules: peluang top-50 lower bound must be ≥30% (target 50%+), and the
revision target is an estimated rank of 20–30. If the honest estimate is
still rank ≥50, the revision has not done its job and one more highest-impact
improvement round is needed before calling it ready. Do NOT inflate numbers:
heist r3's Goldfish estimate (rank 20–45, sentral ~27–30) missed the actual
154/5761 by ~5× — calibrate against that miss.
