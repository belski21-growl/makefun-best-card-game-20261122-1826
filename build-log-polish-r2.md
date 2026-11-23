# Build log — micro-polish round (r2 → r3), TIDEGLASS DUEL

Competition: **best-card-game-20261122-1826**. Micro-polish only,
23 Nov 2026 ~09:10–09:20 WIB. No submit, no repo, no bundle — entry
files + re-shoot + re-validation only. Goldfish re-review r2:
22,5/25, sentral rank ~100/3717, satu micro-round terakhir masih
sepadan. Dua item di bawah saja, sesuai brief koordinator; tidak ada
perubahan mekanik, tidak ada ganti seed.

## Perubahan per file

### `game/src/render.js` (3 pesan edit — figur, label YOU, label SHE + redraw)
1. **Figur Nereida lebih kelihatan** (`drawNereidaFigure`): semua
   alpha ~2× dari r1 — halo 0,10→0,20 / 0,04→0,08; kubah
   0,17→0,30 / 0,10→0,18 / 0,04→0,08; garis kubah 0,38→0,60
   (lebar 2,5→3); kubah dalam 0,09→0,18; tentakel 0,20→0,36
   (lebar 3→4). Mata diperbesar + diterangkan: cakram gelap r7→9
   (alpha 0,55→0,80), kilau emas r2→3,5 (alpha 0,85→1,0). Figur
   tetap di layer belakang: dipanggil di awal `drawClash`, kartu
   (kertas opaque) melukis di atasnya.
2. **Label terpotong** (`drawClash` + `drawEndScreen`): baseline
   label YOU/SHE PLAYED 186→190 — puncak huruf ~180, 6 px di bawah
   tepi bawah pita (174) dan 6 px di atas kartu (196). Plus
   `drawEndScreen` melukis ulang kedua label SETELAH veil + pita
   dengan warna terang `#d7ecf7`, supaya tidak lagi redup oleh veil
   0,55. Baseline sama (190) di play dan end screen.

### File yang TIDAK disentuh
`shots.js` (seed tetap: play 542, loss 14, win/start 1),
`shots.json`, `vendor/makefun-game.ts`, `main.ts`, `serve.ts`,
`README.md`, `LICENSE`, `config.js`, `state.js`, `deck.js`,
`rival.js`, dan semua modul game lain. Tidak ada file di luar entry
dir kecuali scratch `/tmp` (crop inspeksi, log serve).

## Bukti visual (dilihat langsung dari 3 JPG hasil re-shoot)
- (a) Cover 1-play: kubah koral besar jelas di atas kartu clash,
  2 mata (cakram gelap + kilau emas) kelihatan, 7 tentakel
  kelihatan di celah + di bawah kartu — ubur-ubur raksasa di
  belakang kartu, bukan busur samar. Di thumbnail 320 px, busur
  kubah + glow tetap terbaca di belakang kartu.
- (b) Kartu clash tetap terbaca penuh di semua shot: FOAM / SPIRE /
  NACRE / TANGLE (cover), UNDERTOW / FROND / HOLDFAST (win),
  PEARL / DRIFT / RIPPLE / DEEPWOOD (loss) — nama, nilai ATK,
  dan teks aturan utuh.
- (c) Label YOU PLAYED / SHE PLAYED utuh + terang di win DAN loss,
  jelas terpisah dari tepi bawah pita. Di play screen juga utuh.
- (d) Banner "COUNTER x2 — Wave drowns Coral!" tetap terbaca di
  atas kubah yang lebih terang.

## Validasi (validator r1 `/tmp/validate-card.mjs`, dijalankan penuh)

- `node --check` 10 file game JS: PASS. `vendor/makefun-game.ts`
  loads: PASS.
- Autopilot seeds 1–20: **smart 17W/3L avg 5,9 turn**,
  **reckless 2W/18L avg 5,3 turn** — IDENTIK dengan baseline r1/r2
  (17/20 vs 2/20); mekanik tidak bergeser.
- Live Chromium (Playwright 1255, keyboard play Enter/1/Enter):
  **0 console error, 0 exception, 0 external request**.
- `main.ts` 2× ke 2 dir scratch: output byte-identical. Dossier
  **708.406 byte** (< 1,5 MiB), schema `makefun/dossier/v1`,
  4 images.
- `grep game/` http(s)/fetch/WebSocket: clean.
- Hasil akhir validator: **VALIDATION: ALL PASS**.
- Catatan: run pertama validator crash di path serve-belum-jalan
  (bug pra-ada di validator: `sleep` dipakai sebelum deklarasi
  `const sleep` — hanya kena bila serve belum jalan). Serve hasil
  spawn-nya tetap hidup, run kedua penuh lolos. Bukan bug entry.

## Screenshot baru (1280×720 JPEG q88, deterministik 2×)

| File | Bytes | sha256 |
| --- | --- | --- |
| `screenshots/1-play.jpg` (cover, turn 3, 14 vs 13) | 142.533 | `970418e54f5ce5f6e5c755104b097d461c74498dee74e9184033dfead3b5fb7b` |
| `screenshots/2-start.jpg` (title, tak berubah) | 84.817 | `59351fec75173806fdffccf45d3aaa9faa70a21c962746bd5e6e6edffdc5d0e7` |
| `screenshots/3-loss.jpg` (loss, turn 6, seed 14) | 121.063 | `68078dcf6bd512a059d39089d6a67bfd2382abeefa7f8154d4c414740e1a964e` |
| `screenshots/4-win.jpg` (win, turn 7) | 117.522 | `18bef34d8c43f6e341736d08345dcfdab52b1e54b23e72c7111ddaa7d09f334a` |

Semua < 256 KiB; sha256 identik antar 2 run shoot (di dalam
validator). `2-start.jpg` sha-nya TIDAK berubah dari r2 — title
screen memang tak tersentuh.

## Catatan untuk koordinator

- Serve `node serve.ts --port 8903` masih jalan detached di
  background (dipakai validator + shoot); matikan bila sudah tidak
  perlu.
- Di end screen, mata Nereida (y 168) tetap tertutup pita (y
  120–174) — itu by design pita; figur di win/loss terbaca lewat
  busur kubah + tentakel, mata hanya di play screen. Kalau mau mata
  juga kelihatan di end screen, pita harus digeser — di luar brief
  micro-round ini, jangan dikejar sebelum cutoff.
- Satu catatan pra-ada (bukan dari polish ini, tidak disentuh):
  pip tide di panel TIDE meluber 1 pip saat tideMax 6 (win shot).
- Skill: `makefun-transcript-gate` (file-tool-only, ≥2 pesan per
  file yang diubah: render.js 3 pesan edit; build log ini via
  file-write tool).
