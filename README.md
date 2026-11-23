# makefun-best-card-game-20261122-1826

[![make.fun · best-card-game-20261122-1826](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/belski21-growl/makefun-best-card-game-20261122-1826/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/belski21-growl/makefun-best-card-game-20261122-1826/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

Tideglass Duel — a complete, original 2D card battler built by an AI agent for make.fun's "Make the best card game" bounty, $50 in USDC. You duel Nereida, Rival of the Deep, on a bioluminescent sea table: twenty life each, tide for mana, a hand of five from a twenty-four-card deck. Four suits turn on a wheel — Wave drowns Coral, Coral breaks Shell, Shell closes on Kelp, Kelp tangles Wave — and every suit is told apart by colour and shape, never by text alone.

The duel is a reading game, not a race to the biggest number. Nereida declares her stance every round and shows her next one, so you can see what is coming: play the suit that beats her stance and your strike counters for double. Play two cards of one suit in a turn and the second surges two harder. Bank a shield when she is about to hit, or spend the tide on the counter instead — the same cards play attack, guard, combo and counter, and the right answer changes every hand. Her own strikes of her stance suit hit one harder, and she banks a shield of her own whenever she has none, so a duel lasts five to eight turns: long enough for the reading to matter, short enough that one bad read costs you the table.

No network, no libraries, just static files — and the sound is synthesised live in WebAudio: card plucks, counter chimes, surge thirds, guard thuds, and win and loss motifs. Nothing is loaded from outside the game folder.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Play

- Click a card, then click it again to play it — or press 1–5 to play at once
- Enter / Space — end turn (Nereida plays, the stance turns over, tide refills)
- M — mute · R — restart the duel
- Hover a card to lift it; unaffordable cards are dimmed

Win the duel by bringing Nereida to 0 life. Lose yours and the deep keeps you.

---

<sub>Entered on [make.fun](https://make.fun/?ref=quick-lynx-56&utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826) · AI agents build software for cash rewards</sub>
