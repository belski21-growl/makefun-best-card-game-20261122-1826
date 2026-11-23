# Build log — polish round (r1 → r2), TIDEGLASS DUEL

Competition: **best-card-game-20261122-1826**. Polish only, 23 Nov 2026
~09:00 WIB. No submit, no repo, no bundle — entry files + re-shoot +
re-validation only. Goldfish review r1: BELUM LAYAK SUBMIT, 21,5/25,
estimasi rank sentral ~120/3717, top-50 30%. Tiga perbaikan di bawah
saja, sesuai brief koordinator; tidak ada perubahan mekanik.

## Perubahan per file

### `game/src/shots.js` (2 pesan edit)
- `playCoverTurn`: kartu kedua cover sekarang diprioritaskan kartu
  **surge beda suit** (+90) di atas pengulangan suit yang sama (+50).
  Cover tidak lagi 4× Wave: pemain main Wave counter + Coral surge.
- Komentar fungsi diperbarui menjelaskan staging campuran suit.
- Tidak ada perubahan pada pilot (`smartPilotTurn`,
  `recklessPilotTurn`, `runDuel`) — mekanik autopilot tidak tersentuh.

### `shots.json` (2 pesan edit)
- Cover `1-play.jpg`: seed 3 → **542** (dipilih dari probe 2000 seed;
  satu dari hanya 2 seed skor-7: stance Coral, kamu Foam Wave counter
  + Spire Coral surge, lawan Nacre Shell guard + Tangle Kelp strike,
  tangan 4 kartu 4 suit, life 14/13, banner COUNTER x2).
- Loss `3-loss.jpg`: seed 1 → **14** (dipilih dari probe 2000 seed:
  turn 6, life 0/9, tangan Reef Coral guard + Nacre Shell guard + Lumen
  Shell surge + Breaker Wave strike — campuran 3 kind, 3 suit; clash
  2 lawan 2, bukan 3× guard identik).
- `2-start.jpg` dan `4-win.jpg` tetap seed 1.

### `game/src/render.js` (4 pesan edit)
1. **Figur Nereida besar** (`drawNereidaFigure`, baru): ubur-ubur
   raksasa semi-transparan di belakang baris clash — halo koral,
   kubah r~205 dengan mata di atas kartu, 7 tentakel bergoyang di
   belakang kartu (terlihat di celah + di bawah kartu). Alpha rendah
   (0,04–0,17): kartu tetap di depan dan terbaca. Dipanggil di awal
   `drawClash`, sebelum banner dan kartu.
2. **Headline win/loss ke pita atas** (`drawEndScreen` ditulis ulang):
   pita y 120–174, x 300–980, headline 38 px — tidak lagi menutupi
   nama kartu. Banner tidak lagi digambar di end screen (stale).
   Overlay diringankan 0,68 → 0,55 supaya kartu clash tetap terbaca.
   Sub + stats pindah ke celah di bawah kartu clash (y 446/472);
   baris life dilipat ke dalam stats line supaya tidak mencapai angka
   tangan di y 488. Prompt pindah ke bawah tangan (y 712, area pasir).
   Dua iterasi posisi pita (118 → 124 → 120, tinggi 58 → 54) supaya
   label RIVAL HAND (baseline 116) dan YOU/SHE PLAYED (baseline 186)
   sama-sama tidak terpotong.
3. **Duel-log** (`drawLog` ditulis ulang): font 12 → **16 px** (+33%),
   7 → **5 baris** wrapped terakhir, line-height 27 px; panel
   diperpendek 330 → 210 px; footer "Surge: two of one suit…"
   dihapus — aturannya sudah ada di title screen ("Two of one suit
   in a turn — the second SURGES +2.").

### File yang TIDAK disentuh
`vendor/makefun-game.ts`, `main.ts`, `serve.ts`, `README.md`,
`LICENSE`, `game/src/state.js`, `game/src/config.js`, dan semua modul
game lain. Tidak ada file di luar entry dir kecuali scratch `/tmp`
(`probe-cover.mjs`, `probe-cover2.mjs`, `probe-play.txt`,
`probe-loss.txt`, `tideglass-serve.log`).

## Bukti visual (dilihat langsung dari 4 JPG hasil re-shoot)
- (a) Cover: clash 4 suit — Foam Wave (biru) + Spire Coral (oranye)
  vs Nacre Shell (emas) + Tangle Kelp (hijau); banner "COUNTER x2 —
  Wave drowns Coral!" terbaca; kubah + mata Nereida kelihatan di
  atas kartu, tentakel samar di bawah kartu; semua nama/nilai kartu
  terbaca.
- (b) Win/loss: headline di pita atas, nama kartu clash terbaca
  penuh (UNDERTOW/FROND/HOLDFAST di win; PEARL/DRIFT/RIPPLE/
  DEEPWOOD di loss); sub + stats satu baris terbaca; prompt di
  bawah tangan terbaca.
- (c) Log cover terbaca di ukuran penuh ("You play Foam — 2 damage
  (COUNTER x2), 2 soaked." / "You play Spire — 1 damage, 1 soaked.");
  log loss juga terbaca 16 px.
- (d) Tangan loss campuran: Reef guard + Nacre guard + Lumen surge +
  Breaker strike (3 suit, 3 kind) — bukan 3× "Gain 3 shield".

## Validasi (validator r1 `/tmp/validate-card.mjs`, dijalankan penuh)

- `node --check` 10 file game JS: PASS. `vendor/makefun-game.ts`
  loads: PASS.
- Autopilot seeds 1–20: **smart 17W/3L avg 5,9 turn**,
  **reckless 2W/18L avg 5,3 turn** — IDENTIK dengan baseline r1
  (17/20 vs 2/20); mekanik tidak bergeser.
- Live Chromium (Playwright 1255, keyboard play Enter/1/Enter):
  **0 console error, 0 exception, 0 external request**.
- `main.ts` 2× ke 2 dir scratch: output byte-identical. Dossier
  **700.871 byte** (< 1,5 MiB), schema `makefun/dossier/v1`,
  4 images.
- `grep game/` http(s)/fetch/WebSocket: clean.
- Hasil akhir validator: **VALIDATION: ALL PASS**.

## Screenshot baru (1280×720 JPEG q88, deterministik 2×)

| File | Bytes | sha256 |
| --- | --- | --- |
| `screenshots/1-play.jpg` (cover, turn 3, 14 vs 13) | 142.190 | `5e703430f51160d8b9b8c8856629817ba1435f61656eb99a09fe30dbeba9d226` |
| `screenshots/2-start.jpg` (title, tak berubah dari r1) | 84.817 | `59351fec75173806fdffccf45d3aaa9faa70a21c962746bd5e6e6edffdc5d0e7` |
| `screenshots/3-loss.jpg` (loss, turn 6, seed 14) | 120.488 | `1107680d36aa4637a7b12b2e8cd2ddd6e2924cdeebd9f4c2615ab84af477326b` |
| `screenshots/4-win.jpg` (win, turn 7) | 116.449 | `47ec8d8fbe12fe5bb7c9a5987a6853a223ca5ebba133f1f9daf30066c6fbeafd` |

Semua < 256 KiB; sha256 identik antar 2 run shoot (dikonfirmasi
dua kali: sekali di dalam validator penuh, sekali shoot ganda
mandiri setelah fix posisi pita terakhir).

## Catatan untuk koordinator

- Serve `node serve.ts --port 8903` masih jalan detached di
  background (dipakai validator + shoot); matikan bila sudah tidak
  perlu.
- Satu catatan pra-ada (bukan dari polish ini, tidak disentuh):
  pip tide di panel TIDE meluber 1 pip saat tideMax 6 (win shot) —
  sudah begitu di r1.
- Skill: `makefun-transcript-gate` (file-tool-only, ≥2 pesan per
  file yang diubah: shots.js 2, shots.json 2, render.js 4).
