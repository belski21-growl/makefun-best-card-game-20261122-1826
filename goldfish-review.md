# Goldfish Review — TIDEGLASS DUEL (best-card-game-20261122-1826)

Reviewed 23 Nov 2026 ~08:45 WIB, from the 4 screenshots viewed directly + top10-ref
covers #5 (plucky-gecko-56, THE BAR), #10 (akd170396, near-bar), #01 (durmogati)
viewed directly + build-log.md + config.js/state.js read. No submit, no file
changed. Competition: 3,717 submissions, round 1 ranked 2,744, blind rounds.
Round 3 cutoff 10:26 WIB — this review lands ~1,5 jam before that cutoff.

## VERDICT: BELUM LAYAK SUBMIT — satu putaran perbaikan dulu (<1 jam, 1 builder), lalu submit sebelum 10:26 WIB

Entry ini lengkap, jujur, dan kuat — tapi estimasi rank jujurnya masih di luar
garis hadiah top-10 dan di luar target revisi (rank 20–30). Per aturan
CHASE-TOP-10: kalau estimasi masih ≥50, revisi belum selesai. Tiga perbaikan
di bawah semuanya kecil dan bisa selesai sebelum cutoff ronde 3. Kalau
perbaikan itu tidak sempat dikerjakan, submit apa adanya tetap lebih baik
daripada melewatkan ronde — entry ini masih kandidat top-50 yang sah.

## Skor per kriteria judge (total 21,5 / 25)

### 1. Complete card game in screenshots — 4,5 / 5
**Kuat:** Cover adalah meja mid-duel yang lengkap: tangan lawan 5 kartu
tertutup di atas, tangan pemain di bawah, life 14/20 vs 11/20, 4 kartu
beradu dengan label VS, banner COUNTER ×2, panel stance lawan, duel-log,
tide 1/4, tombol END TURN, deck 15 / spent 9. Semua elemen kriteria 1 ada
dalam SATU frame, nilai (cost 1–3, ATK 2–3, shield +3) terbaca besar.
Title screen menamai game + aturan sekilas; win (turn 7) dan loss (turn 6)
keduanya render nyata dengan statistik.
**Kurang:** (a) Keempat kartu clash di cover SEMUANYA Wave — satu warna
biru, monoton, terlihat seperti kartu yang sama diulang 4×. (b) Teks duel-log
("THE DUEL SO FAR") terlalu kecil — di thumbnail/contact sheet judge jadi
abu-abu tak terbaca. (c) Tangan pemain di cover hanya 4 kartu (satu sudah
dimainkan — wajar, tapi tangan 5 kartu penuh akan terbaca lebih lengkap).
**Perbaikan paling berdampak:** Reshoot cover dengan clash campuran suit
(mis. kamu main Wave counter + Coral surge vs Shell guard dia) supaya clash
menunjukkan variasi warna; log dipangkas ke 5 baris dengan font lebih besar.

### 2. Fun and depth — 4,0 / 5
**Kuat:** Depth-nya NYATA di code, bukan pajangan — gue baca state.js:
stance lawan + NEXT stance, counter ×2 saat suit mengalahkan stance,
surge +2 kartu kedua satu suit, guard bank shield 1 ronde, shield soak
sebelum life, tide naik 3→6, rival main maks 2 kartu + guard saat tak punya
shield. Validasi autopilot: smart 17/20 menang vs reckless 2/20 — bisa
menang DAN bisa kalah, terbukti. Semua mekanik itu KELIHATAN di cover
(banner, panel stance, label SURGE +2).
**Kurang:** Satu rival, satu duel, tanpa campaign/ladder/deckbuilder —
field punya #4 (campaign 5 rival + deckbuilder) dan #8 (3-lane scoring).
Kedalaman berhenti di satu duel yang diulang; tidak ada kartu draw/heal
yang terlihat di screenshot.
**Perbaikan paling berdampak:** Tidak ada fix <1 jam yang menambah mode
baru secara jujur — JANGAN memalsukan ladder. Yang bisa: pastikan cover
menunjukkan keputusan paling sulit (counter vs guard vs surge di tangan
yang sama) — reshoot cover dengan tangan berisi 1 Wave + 1 Coral + 1 Shell
guard sehingga pilihannya terbaca, bukan 2 kartu dimmed + 1 Coral terang.

### 3. Feel and polish — 3,5 / 5
**Kuat:** Win/loss mendarat dengan statistik lengkap ("Won in 7 turns · 20
damage dealt · 2 surges · 5 counters", "Nereida 0 life · You 5 life");
WebAudio synth, keyboard 1–5 + Enter + M + R, 0 console error, 0 request
eksternal (validasi headless Chromium).
**Kurang:** (a) Headline win/loss MENUTUPI nama kartu clash — "THE TIDE IS
YOURS" menutup nama kartu yang dimainkan, "THE DEEP KEEPS YOU" juga;
bukti duelnya justru disembunyikan di momen yang paling penting.
(b) Animasi (slide/flip/pop) tidak bisa diverifikasi dari screenshot statis
— judge hanya melihat outline + gambar, jadi polish ini tidak ikut
dinilai penuh. (c) Loss screen: 3 kartu tangan semuanya "Gain 3 shield"
— repetitif, terlihat seperti deck guard semua.
**Perbaikan paling berdampak:** Pindahkan headline win/loss ke pita atas
(di atas baris clash) atau perkecil, dan redupkan kartu lebih sedikit,
supaya nama kartu yang dimainkan tetap terbaca; reshoot loss dengan tangan
campuran (attack + guard + surge).

### 4. Look and originality — 4,5 / 5
**Kuat:** Ini pembeda terbesar entry ini. Tema deep-sea bioluminescent
(indigo/teal + coral + pearl + pale-gold) JELAS BUKAN ember/ash — 7/10
field adalah ember duel, 3 berjudul sama "Ember Duel". Suit dibedakan
warna DAN bentuk (drop/branch/fan/leaf). Kartu terbaca di thumbnail: cost
besar di cincin, glyph besar, nama pendek, satu baris efek, ATK besar.
Title screen bersih, 4 suit dengan glyph + "beats X" dalam satu pandang.
**Kurang:** (a) Tidak ada figur rival di meja — hanya potret jellyfish
kecil di header. #5 dan #10 menjual duel dengan momen fokal dramatis
("Vex strikes for 14!"); Tideglass clash-nya empat kartu datar berjajar,
tidak ada yang menggerakkan mata ke satu titik. (b) Title screen sangat
gelap/kosong di tepinya. (c) Palet keseluruhan gelap — di thumbnail kecil,
kartu terang vs meja gelap masih oke, tapi meja sendiri hampir hitam.
**Perbaikan paling berdampak:** Tambahkan figur Nereida besar (siluet
jellyfish/putri laut, render canvas) di belakang baris clash sebagai momen
fokal — ini satu-satunya fix yang menaikkan daya tarik cover ke kelas #5.
Kalau itu terlalu berat untuk <1 jam, minimal: perbesar potret header 2×
dan tambahkan glow di belakang kartu clash.

### 5. Structure — 5,0 / 5
**Kuat:** 10 modul game, satu tugas jelas per file (config, deck, rival,
state, render, audio, input, shots, main, random); main.ts + serve.ts;
vendor/makefun-game.ts utuh (sha256 cocok dengan kit); dossier 676.880
byte (< 1,5 MiB); shot deterministik (seed, sha256 identik di 2× take);
grep bersih dari http/fetch/WebSocket.
**Kurang:** Tidak ada yang material. Satu-satunya catatan: build-log
mencatat serve process mungkin masih jalan di background — kebersihan,
bukan struktur.
**Perbaikan paling berdampak:** Tidak ada — kriteria ini sudah maksimal.

## Estimasi rank (kalibrasi kejujuran)

Kalibrasi WAJIB: heist r3 Goldfish estimasi rank 20–45 (sentral ~27–30),
AKTUAL 154/5761 — meleset ~5×. Estimasi di bawah sudah didiskon dari
pembacaan naif ("kualitas ~25–40") dengan faktor ~3–4× ke arah konservatif.
Field: 3.717 entry, 2.744 sudah di-rank ronde 1. Sebagian besar field tipis
(starter clone, title-only), tapi garis hadiah top-10 berarti mengalahkan
game lengkap sekelas #5/#10 — dan Tideglass masih kalah dari mereka di
satu hal: momen fokal dramatis di cover.

- **Range: 45 – 260 dari 3.717**
- **Sentral: ~120**
- **Peluang top 50: ~30%**
- **Peluang top 25: ~10%**
- **Peluang top 10: ~3%**

Artinya: lolos cut top-40 dev board untuk final heat itu plausibel
(~30–40%), tapi hadiah top-10 butuh keberuntungan pairing + perbaikan
cover di bawah. Entry ini BELUM layak top-10 — katakan apa adanya.

## Kekuatan (urut)

1. Tema deep-sea — pembeda visual paling kuat melawan 7/10 field ember/ash.
2. Cover lengkap: meja mid-duel dengan kedua tangan, life, clash, stance,
   log, tide, END TURN dalam satu frame.
3. Depth terbukti di code + autopilot (17/20 smart vs 2/20 reckless) —
   winnable DAN losable, bukan pajangan.
4. Kartu terbaca di thumbnail (cost/glyph/ATK besar, suit warna+bentuk).
5. Struktur rapi, dossier 677 KB, deterministik, 0 error, 0 request eksternal.

## Kelemahan (urut prioritas)

1. **Cover tanpa momen fokal** — tidak ada figur rival besar; clash 4 kartu
   datar, semuanya satu suit (Wave) sehingga monoton.
2. **Headline win/loss menutupi kartu clash** — bukti duel disembunyikan di
   momen yang paling penting; loss screen tangan 3× guard identik.
3. **Duel-log terlalu kecil** di cover — tidak terbaca di thumbnail judge.
4. **Satu rival, satu duel** — tanpa campaign/ladder/deckbuilder, kalah scope
   dari #4/#8 di kriteria depth (tidak bisa diperbaiki jujur dalam <1 jam).
5. Title screen gelap/kosong di tepi; meja keseluruhan sangat gelap.

## Perbaikan paling berdampak (top 3, konkret, <1 jam, 1 builder)

1. **Reshoot cover: clash campuran suit + figur Nereida besar.**
   Ubah seed/scene cover supaya kamu main Wave (counter) + Coral (surge)
   vs Shell guard dia — tiga warna di baris clash, bukan empat biru.
   Tambahkan siluet Nereida besar di belakang clash (atau minimal perbesar
   potret header 2× + glow). Dampak: kriteria 1 + 4 sekaligus, ini yang
   paling menaikkan rank.
2. **Perbaiki overlay win/loss: headline jangan menutupi kartu.**
   Pindahkan headline ke pita atas / perkecil 20% / kurangi dimming kartu,
   lalu reshoot win + loss. Reshoot loss dengan tangan campuran (attack +
   guard), bukan 3× "Gain 3 shield". Dampak: kriteria 3, bukti duel tetap
   terlihat.
3. **Perbesar + pangkas duel-log di cover.**
   Log maks 5 baris, font naik ~30%, hanya baris punchy (counter/surge/
   shift stance). Dampak: kriteria 1 — cerita duel terbaca di thumbnail
   judge, bukan abu-abu.

## Catatan waktu

Review selesai ~08:45 WIB. Cutoff ronde 3: 10:26 WIB. Tiga perbaikan di
atas muat sebelum cutoff. Setelah perbaikan: reshoot 4 screenshot,
re-validasi dossier, lalu submit sebelum 10:26 WIB. Kalau perbaikan tidak
selesai sebelum 10:26 WIB, submit apa adanya — jangan lewatkan ronde demi
kesempurnaan.
