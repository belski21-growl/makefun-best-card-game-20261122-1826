# Build log — visual polish round (r3 → r4), TIDEGLASS DUEL

Competition: **best-card-game-20261122-1826**. Polish bedah visual saja,
23 Nov 2026 ~11:30–11:55 WIB. Perintah user: game "jelek", "perbaiki
sekali lagi". SATU ronde, visual only — tidak ada redesign, tidak ada
perubahan mekanik/aturan/seed. No submit — commit repo saja, submit
tetap wewenang koordinator/user. Timebox keras: lapor kembali 12:05 WIB.

## Perubahan per file

### `game/src/render.js` saja (2 pesan edit: meja+kartu, lalu figur+end screen)
1. **Kartu tangan terbaca** (`drawCardFace`): akar masalahnya
   `globalAlpha 0.5` untuk kartu tak-terjangkau — di cover (tide 0/4)
   SEMUA kartu tangan kena, kertas jadi abu-hijau di atas meja teal
   dan glyph nyaris hilang. Sekarang kartu dilukis full-strength lalu
   kena veil gelap `rgba(6,20,32,0.30)` di akhir — muka kartu tetap
   terbaca (nama, glyph, aturan, ATK), affordance tetap kelihatan
   sebagai kartu yang lebih gelap. Plus drop shadow lembut di kertas
   (blur 14, offsetY 5) supaya kartu terangkat dari meja, dan font
   nama suit 0.085→0.095w, aturan 0.068→0.072w.
2. **Kedalaman meja** (`paintTable`): glow tengah 0.16→0.22,
   pool cahaya kedua di bawah baris tangan (0.12), sinar 0.05→0.08,
   vignette lembut di tepi (0→0.38) supaya mata ke tengah meja.
3. **Figur Nereida lebih menonjol** (`drawNereidaFigure`): kubah
   r 205→230 (puncaknya kini membersihkan banner dan membingkai
   clash), halo 0.20→0.26, kubah 0.30→0.36, garis kubah 0.60→0.75
   (lebar 3→3.5), kubah dalam 0.18→0.22, mata cakram 9→10.5
   (kilau 3.5→4), tentakel 0.36→0.45 (lebar 4→5). Tetap di layer
   belakang: kartu kertas opaque melukis di atasnya.
4. **Punch win/loss** (`drawEndScreen`): veil 0.55→0.45 (kartu clash
   di loss tidak lagi abu-abu), bloom warna di belakang pita (emas
   win / koral loss, 0.20), pita fill 0.88→0.94 + border 2→3 +
   headline 38→41 px + glow shadow 22. Label YOU/SHE PLAYED tetap
   dilukis ulang pasca-veil seperti r3.
5. **Life bar** (`drawLifeBar`): teks life kini ber-stroke gelap
   (3 px, 0.55) — di loss, "9 / 20" sebelumnya terpotong di tepi
   fill merah; sekarang terbaca penuh di atas fill maupun track.
6. **Pip tide** (`drawBottom`): spacing pip adaptif (18 px, atau
   13 px saat tideMax 6) + start 124 — pip ke-6 di win shot tidak
   lagi meluber melewati tepi panel (cacat pra-ada sejak r1).

### File yang TIDAK disentuh
`shots.js` (seed tetap: play 542, loss 14, win/start 1), `shots.json`,
`vendor/makefun-game.ts`, `main.ts`, `serve.ts`, `README.md` (3 badge +
About utuh), `LICENSE`, `config.js`, `state.js`, `deck.js`, `rival.js`,
dan semua modul game lain. Tidak ada file di luar entry dir kecuali
scratch `/tmp` (validator + shoot + commit script, log serve).

## Bukti visual (dilihat langsung dari 4 JPG hasil re-shoot)
- (a) Cover 1-play: tangan DRIFT / LUMEN / BRANCH / SWELL kini
  TERBACA PENUH — nama, glyph, aturan, ATK, SURGE +2; kertas
  putih-krem, bukan abu-hijau. Kubah Nereida besar + terang di
  belakang clash, 2 mata kelihatan, 7 tentakel di celah + bawah
  kartu. Banner "COUNTER x2 — Wave drowns Coral!" tetap terbaca.
- (b) Loss 3-loss: pita "THE DEEP KEEPS YOU" kini nge-punch dengan
  bloom koral; kartu clash PEARL / DRIFT / RIPPLE / DEEPWOOD
  terang dan terbaca; tangan REEF / NACRE terbaca, LUMEN /
  BREAKER (tak-terjangkau) lebih redup tapi glyph + nilai tetap
  kelihatan; "9 / 20" utuh.
- (c) Win 4-win: pita "THE TIDE IS YOURS" bloom emas; pip TIDE
  3/6 kini SEMUA di dalam panel (dulu pip ke-6 meluber).
- (d) Title 2-start: tidak disentuh langsung, hanya ikut berubah
  lewat glow/vignette meja di balik veil — sinar sedikit lebih
  kelihatan, kartu sampel dapat drop shadow; tidak ada yang rusak.
  Tepi title tetap gelap (pra-ada, di luar brief ronde ini).

## Validasi (validator r4 `/tmp/validate-card-r4.mjs`, ditulis ulang —
validator r1 hilang dari /tmp; dijalankan penuh)

- `node --check` 10 file game JS: PASS.
- Autopilot seeds 1–20: **smart 17W/3L avg 5,9 turn**,
  **reckless 2W/18L avg 5,3 turn** — IDENTIK dengan baseline r1–r3;
  mekanik tidak bergeser.
- Live Chromium (Playwright 1255, keyboard Enter/1/Enter):
  **0 console error, 0 exception, 0 external request**; status
  live "The duel begins — your move, tidecaller."
- `grep game/` http(s)/fetch/WebSocket: clean.
- `main.ts` 2× ke 2 dir scratch: output byte-identical. Dossier
  **765.716 byte** (< 1,5 MiB), schema `makefun/dossier/v1`,
  4 images.
- Screenshot 2× shoot: sha256 identik antar run.

## Screenshot baru (1280×720 JPEG q88, deterministik 2×)

| File | Bytes | sha256 |
| --- | --- | --- |
| `screenshots/1-play.jpg` (cover, turn 3, 14 vs 13) | 155.025 | `0c24cd017c0e1f7d1a9316d863567ab0032eb8e9599c0612c27a46bb204783e5` |
| `screenshots/2-start.jpg` (title) | 86.328 | `98ee723f01cc7634d51cfb98c0553704eb3a3b59408f101056026798d04490c2` |
| `screenshots/3-loss.jpg` (loss, turn 6, seed 14) | 135.520 | `4b99593a426c489b62d6ba219bf27ecba8044e80fbc8b065d38666420e43706f` |
| `screenshots/4-win.jpg` (win, turn 7) | 129.330 | `77e2d695176579d987fde3ac963f067e60b942ac2c03c80274d43fd72b14bec9` |

Semua < 256 KiB. `2-start.jpg` sha-nya BERUBAH dari r3 (bukan
karena title disentuh — meja di balik veil ikut terang).

## Catatan untuk koordinator

- Serve `node serve.ts --port 8903` dari validator dimatikan di
  akhir run (kill process group); cek port bila perlu.
- Estimasi JUJUR: visual membaik nyata di 3 titik yang diminta
  user (tangan cover, figur, punch end screen) — tapi ini tetap
  polish, bukan lompatan kualitas: satu rival tanpa campaign,
  title gelap di tepi, dan figur end screen tetap tertutup pita
  (mata). Goldfish r3 sentral ~90 / top-50 ~38% — ronde ini
  tidak mengubah depth/scope, jadi jangan harapkan revisi
  estimasi besar; paling banter sentral turun sedikit karena
  cover + end screen lebih terbaca. Angka pasti wewenang Goldfish,
  bukan builder.
- Skill: `makefun-transcript-gate` (file-tool-only, ≥2 pesan per
  file yang diubah: render.js 2 pesan edit; build log ini via
  file-write tool).
