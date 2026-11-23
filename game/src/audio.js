// audio.js — every sound in the game, synthesised, no audio files.
//
// A tiny kit around one WebAudio context: a tone is an oscillator with an
// envelope, a splash is filtered noise, and a motif is a few tones in a
// row. Nothing is loaded from disk, so there is nothing for the gate to
// chase and nothing for the network to serve. The context is created on
// the first user gesture (browsers refuse sound before one); every call
// before that, or in a headless capture, is a safe no-op.

const NOTE = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
};

export function createAudio() {
  let ctx = null;
  let muted = false;
  let master = null;

  // Build the context on demand. A headless browser may hand back a
  // suspended context or throw outright; both are fine — the game plays
  // on silently.
  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
    } catch (err) {
      ctx = null;
    }
    return ctx;
  }

  function tone(freq, dur, type, vol, when = 0, slideTo = null) {
    if (muted) return;
    const ac = ensure();
    if (!ac || ac.state !== 'running') return;
    try {
      const t0 = ac.currentTime + when;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo !== null) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch (err) {
      // Sound is garnish; a failed note never breaks a duel.
    }
  }

  function splash(dur = 0.25, vol = 0.25) {
    if (muted) return;
    const ac = ensure();
    if (!ac || ac.state !== 'running') return;
    try {
      const t0 = ac.currentTime;
      const len = Math.max(1, Math.floor(ac.sampleRate * dur));
      const buffer = ac.createBuffer(1, len, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      }
      const source = ac.createBufferSource();
      source.buffer = buffer;
      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.8;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(t0);
    } catch (err) {
      // See above.
    }
  }

  return {
    // Call on the first pointer or key gesture so later sounds may play.
    unlock() {
      const ac = ensure();
      if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    // A card leaving the hand: a soft pluck.
    play() {
      tone(NOTE.E4, 0.14, 'triangle', 0.5, 0, NOTE.G4);
    },
    // A counter landing: a bright two-note chime, the loudest good news.
    counter() {
      tone(NOTE.C5, 0.16, 'sine', 0.55);
      tone(NOTE.G5, 0.22, 'sine', 0.5, 0.09);
      splash(0.18, 0.15);
    },
    // A surge pairing: a rising third.
    surge() {
      tone(NOTE.G4, 0.12, 'triangle', 0.45);
      tone(NOTE.B4, 0.16, 'triangle', 0.45, 0.07);
    },
    // A guard banking: a low, round thud.
    guard() {
      tone(NOTE.C4, 0.2, 'sine', 0.5, 0, NOTE.F4);
    },
    // Damage landing: a short low knock plus a splash.
    hit() {
      tone(140, 0.16, 'sawtooth', 0.35, 0, 70);
      splash(0.2, 0.2);
    },
    // A new turn: one clear bell.
    turn() {
      tone(NOTE.A4, 0.3, 'sine', 0.4);
    },
    // A draw: a quick ripple up.
    draw() {
      tone(NOTE.D4, 0.1, 'triangle', 0.3, 0, NOTE.A4);
    },
    // The win: a rising arpeggio over the tide.
    win() {
      const seq = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5];
      seq.forEach((freq, i) => tone(freq, 0.35, 'sine', 0.45, i * 0.11));
      splash(0.6, 0.12);
    },
    // The loss: three notes sinking down.
    loss() {
      const seq = [NOTE.A4, NOTE.F4, NOTE.D4];
      seq.forEach((freq, i) => tone(freq, 0.4, 'triangle', 0.4, i * 0.16));
    },
    // The title's first dive: a deep swell that rises and settles.
    dive() {
      tone(98, 0.7, 'sine', 0.4, 0, 196);
      tone(NOTE.C5, 0.4, 'sine', 0.25, 0.25);
      splash(0.5, 0.1);
    },
    // A click on a button: the smallest sound there is.
    click() {
      tone(NOTE.G4, 0.06, 'square', 0.18);
    },
  };
}
