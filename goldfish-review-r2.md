# Goldfish Review R2 — TIDEGLASS DUEL (best-card-game-20261122-1826)

Reviewed 23 Nov 2026 ~09:05 WIB, re-review of the polished entry. All 4
polished screenshots viewed directly + top10-ref covers #5 (plucky-gecko-56,
THE BAR) and #10 (akd170396) re-viewed + goldfish-review.md (r1) +
build-log-polish.md read. No submit, no entry file changed. Competition:
3,717 submissions, round 1 ranked 2,744, blind rounds. Round 3 cutoff
10:26 WIB — this review lands ~1,5 jam before that cutoff.

## VERDICT: BELUM LAYAK SUBMIT — satu micro-round terakhir (~30 menit, 1 builder), lalu submit sebelum 10:26 WIB

Polish ronde 1 BENAR-BENAR membaik di gambar — bukan cuma klaim. Skor naik
21,5 → 22,5/25 dan estimasi rank membaik. Tapi perbaikan #1 (figur Nereida)
yang paling berdampak justru yang paling lemah hasilnya: figur ada di code
tapi nyaris tak terlihat di gambar. Satu micro-round — naikkan visibilitas
figur + betulkan label yang ketutup pita — adalah perbaikan terakhir yang
masih sepadan. Kalau micro-round itu tidak sempat selesai sebelum ~10:00 WIB,
submit apa adanya: kondisi saat ini sudah jauh lebih baik dari r1 dan layak
jadi kandidat top-50 yang sah. Jangan lewatkan ronde demi kesempurnaan.

## Skor per kriteria judge (total 22,5 / 25; r1 21,5 — delta +1,0)

### 1. Complete card game in screenshots — 4,75 / 5 (r1: 4,5; +0,25)
**Membaik, terbukti di gambar:** Cover sekarang clash 4 suit 4 warna —
Foam Wave (biru) + Spire Coral (oranye) vs Nacre Shell (emas) + Tangle Kelp
(hijau). Bukan lagi 4× biru monoton. Duel-log naik ke 16 px dan terbaca di
ukuran penuh ("You play Foam — 2 damage (COUNTER x2), 2 soaked." /
"You play Spire — 1 damage, 1 soaked."). Tangan cover 4 kartu 4 suit
(Drift Kelp, Lumen Shell, Branch Coral, Swell Wave).
**Masih kurang:** (a) Log cover cuma 2 baris terisi — panelnya muat 5 tapi
turn 3 baru 2 aksi, jadi separuh panel kosong. (b) Tangan cover keempatnya
tampak redup/dimmed — tide 0/4, semua kartu tak bisa dimainkan lagi, jadi
"pilihan" di tangan terbaca mati, bukan hidup. (c) Tangan tetap 4 kartu,
bukan 5 penuh (satu sudah dimainkan — wajar, tapi tetap).

### 2. Fun and depth — 4,0 / 5 (r1: 4,0; +0)
**Tidak berubah — dan itu jujur:** Mekanik tidak disentuh polish
(autopilot identik: smart 17/20 vs reckless 2/20, validasi lolos). Cover
sedikit lebih komunikatif soal keputusan (tangan 4 suit = counter vs guard
vs surge terbaca), tapi itu presentasi, bukan depth baru. Satu rival, satu
duel, tanpa campaign/ladder/deckbuilder — tetap kalah scope dari #4
(campaign 5 rival + deckbuilder) dan #8 (3-lane scoring). Tidak ada fix
jujur <1 jam untuk ini; jangan memalsukan ladder.

### 3. Feel and polish — 4,0 / 5 (r1: 3,5; +0,5)
**Membaik, terbukti di gambar:** Headline win/loss SUDAH di pita atas dan
TIDAK lagi menutupi nama kartu — UNDERTOW / FROND / HOLDFAST (win) dan
PEARL / DRIFT / RIPPLE / DEEPWOOD (loss) terbaca penuh. Tangan loss sudah
campuran (Reef Coral guard + Nacre Shell guard + Lumen Shell surge +
Breaker Wave strike) — bukan lagi 3× "Gain 3 shield". Sub + stats satu
baris terbaca ("Won in 7 turns · 20 damage dealt · 2 surges · 5 counters").
**Masih kurang:** (a) CACAT BARU dari pita: label "YOU PLAYED" (dan di
loss, "SHE PLAYED") terpotong separuh di tepi bawah pita — pita menutupi
bagian atas label di win DAN loss. (b) Tangan loss masih 2× "Gain 3 shield"
(Reef + Nacre) — lebih baik dari 3×, tapi masih repetitif. (c) Pip tide di
panel TIDE win shot meluber melewati tepi panel (pre-existing, dicatat
build log; tideMax 6). (d) Kartu clash di end screen masih agak redup,
meski nama tetap terbaca.

### 4. Look and originality — 4,75 / 5 (r1: 4,5; +0,25)
**Membaik, terbukti di gambar:** Clash 4 warna mengubah cover dari
monokrom biru jadi penuh warna — di thumbnail pun bedanya langsung
kelihatan. Tema deep-sea tetap pembeda terkuat vs 7/10 field ember/ash.
Banner "COUNTER x2 — Wave drowns Coral!" + panel stance + log bikin cover
terasa seperti momen duel, bukan pajangan kartu.
**Masih kurang — ini yang paling penting:** Figur Nereida besar HAMPIR
TIDAK KELIHATAN. Yang terlihat cuma busur kubah sangat samar di atas kartu
+ 2 titik mata kecil + garis tentakel tipis di bawah kartu. Di thumbnail
judge, figur praktis tidak ada — momen fokal dramatis ala #5 ("Vex strikes
for 14!" + potret besar) tetap belum tercapai. Alpha 0,04–0,17 terlalu
rendah. Title screen tetap gelap/kosong di tepinya (tak berubah dari r1).

### 5. Structure — 5,0 / 5 (r1: 5,0; +0)
**Tidak berubah, tetap maksimal:** Dossier 700.871 byte (< 1,5 MiB),
deterministik 2× shoot (sha256 identik), 0 console error, 0 request
eksternal, autopilot identik baseline. Tidak ada yang perlu diperbaiki.

## Status 3 perbaikan ronde 1 (dinilai dari gambar, bukan klaim build log)

| # | Perbaikan r1 | Status | Bukti di gambar |
|---|---|---|---|
| 1a | Cover clash campuran suit | ✅ TERBUKTI PENUH | 4 suit 4 warna di baris clash cover; tangan cover juga 4 suit |
| 1b | Figur Nereida besar di belakang clash | ⚠️ SETENGAH — ada di code, nyaris tak terlihat | Busur kubah + 2 titik mata samar; di thumbnail praktis hilang. Ini satu-satunya perbaikan yang BELUM membaik secara visual |
| 2a | Headline win/loss ke pita atas, tidak menutupi kartu | ✅ TERBUKTI PENUH | Semua nama kartu clash terbaca penuh di win + loss |
| 2b | Reshoot loss tangan campuran | ✅ TERBUKTI SEBAGIAN BESAR | 3 suit 3 kind di tangan loss; tapi masih 2× "Gain 3 shield" |
| 3 | Duel-log +33% (12→16 px), 5 baris | ✅ TERBUKTI SEBAGIAN BESAR | Font jelas lebih besar, terbaca di ukuran penuh; tapi cover baru terisi 2 baris (turn 3), panel separuh kosong |

## Estimasi rank (kalibrasi kejujuran)

Kalibrasi WAJIB: heist r3 Goldfish estimasi rank 20–45 (sentral ~27–30),
AKTUAL 154/5761 — meleset ~5×. Ronde 1 entry ini: sentral ~120. Polish ini
menaikkan skor 21,5 → 22,5 (+1,0) lewat perbaikan visual yang terbukti —
tapi perbaikan paling berdampak (figur fokal) tidak mendarat, dan tidak ada
depth baru. Jadi kenaikan estimasi harus SEDIKIT, bukan lompatan. Field:
3.717 entry, 2.744 sudah di-rank ronde 1. Garis hadiah top-10 berarti
mengalahkan game lengkap sekelas #5/#10 — Tideglass sekarang setara mereka
di kelengkapan cover, masih di bawah di momen fokal dramatis dan scope
(campaign/ladder).

- **Range: 40 – 250 dari 3.717**
- **Sentral: ~100** (r1: ~120)
- **Peluang top 50: ~35%** (r1: ~30%)
- **Peluang top 25: ~12%** (r1: ~10%)
- **Peluang top 10: ~4%** (r1: ~3%)

Artinya: lolos cut top-40 dev board untuk final heat itu plausibel
(~35–40%), tapi hadiah top-10 tetap butuh keberuntungan pairing + micro-round
di bawah. Entry ini BELUM layak top-10 — katakan apa adanya. Angka di atas
sudah didiskon dari pembacaan naif ("kualitas ~25–40") dengan faktor ~3–4×,
sama seperti r1.

## Kekuatan (urut)

1. Cover lengkap + sekarang berwarna: meja mid-duel 4 suit, banner counter,
   stance, log terbaca, kedua tangan, life, tide, END TURN dalam satu frame.
2. Tema deep-sea — pembeda visual paling kuat melawan 7/10 field ember/ash.
3. Depth terbukti di code + autopilot (17/20 smart vs 2/20 reckless) —
   winnable DAN losable, bukan pajangan.
4. Headline win/loss sudah tidak menutupi bukti duel.
5. Struktur rapi, dossier 701 KB, deterministik, 0 error, 0 request eksternal.

## Kelemahan (urut prioritas)

1. **Figur Nereida nyaris tak terlihat** — perbaikan #1 ronde 1 setengah
   gagal; cover masih tanpa momen fokal dramatis vs #5/#10.
2. **Label "YOU PLAYED"/"SHE PLAYED" terpotong pita** — cacat baru dari
   polish, kelihatan di win DAN loss.
3. **Satu rival, satu duel** — tanpa campaign/ladder/deckbuilder, kalah scope
   dari #4/#8 (tidak bisa diperbaiki jujur dalam <1 jam).
4. **Tangan cover redup (tide 0/4)** — pilihan di tangan terbaca mati;
   log cover baru 2 baris, panel separuh kosong.
5. Title screen gelap/kosong di tepi; pip tide meluber di win shot;
   tangan loss masih 2× guard identik.

## Perbaikan lanjutan (satu micro-round, ~30 menit, 1 builder)

ADA satu perbaikan yang masih sepadan — dan hanya satu:

1. **Naikkan visibilitas figur Nereida + betulkan label pita (WAJIB, ~30 mnt).**
   - `drawNereidaFigure`: naikkan alpha ~2× (mis. 0,04–0,17 → 0,10–0,30),
     perbesar/terangkan mata, tambah glow di tepi kubah — supaya figur
     terbaca di thumbnail TANPA menutupi kartu. Reshoot cover saja, cek
     di thumbnail kecil sebelum lanjut.
   - Pita win/loss: geser pita naik ~6 px ATAU geser label YOU/SHE PLAYED
     turun ~10 px supaya label tidak terpotong; reshoot win + loss.
   - Lalu re-validasi dossier + submit sebelum 10:26 WIB.
   - Dampak: kriteria 4 (momen fokal — satu-satunya gap besar vs #5) +
     kriteria 3 (cacat label hilang). Ini perbaikan terakhir yang masih
     mengubah rank; setelah ini tidak ada lagi fix <1 jam yang sepadan.

**Tidak ada perbaikan lain yang sepadan:** seed-hunting tangan loss tanpa
guard ganda, atau cover dengan tide tersisa supaya tangan terang — keduanya
marginal, jangan habiskan waktu. Setelah micro-round di atas: TIDAK ADA lagi
perbaikan lanjutan — submit.

## Catatan waktu

Review selesai ~09:05 WIB. Cutoff ronde 3: 10:26 WIB. Micro-round di atas
muat sebelum cutoff. Kalau tidak selesai sebelum ~10:00 WIB, submit apa
adanya — kondisi saat ini sudah lebih baik dari r1 dan tidak boleh
melewatkan ronde.
