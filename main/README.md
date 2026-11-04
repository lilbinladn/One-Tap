# Campaign levels

One JSON file per level, plus a manifest. Loaded at boot by `js/levels/loader.js`.

```
main/
  manifest.json   areas, play order, the secret level
  001.json … 200.json
  secret.json     the hidden level
songs/
  manifest.json   every song the charts can be built on
  audio/          optional real audio files
```

`manifest.json` lists the level files in play order, so adding a level means adding a file
and listing it there. The game uses that order exactly as written — position 1 is the first
card — so levels inside an area are listed easiest to hardest, the way the old built-in
table was sorted at start-up. Reordering the list reorders the campaign and remaps saved
progress through `js/levels/legacy-order.js`, so keep the order stable once players have scores.

## Level

```json
{
  "version": 2,
  "id": 0,
  "name": "Warm-up",
  "song": "neon-drive",
  "bpm": 90,
  "beats": 44,
  "subdivisions": [1],
  "density": 0,
  "seed": 13,
  "mechanics": {},
  "notes": null
}
```

| field | meaning |
| --- | --- |
| `id` | position in the campaign (matches the level number in saves) |
| `name` | shown in the level list |
| `song` | id from `songs/manifest.json` |
| `bpm` | base tempo; tempo changes live in `mechanics.t` |
| `beats` | level length in beats |
| `subdivisions` | note grid for each beat, e.g. `[4,3]` mixes 16ths and triplets |
| `density` | 0–1, how often off-beat grid slots get a note |
| `seed` | the chart is generated from this, so the same seed always gives the same notes |
| `mechanics` | `h` holds, `t` tempo shifts `[[beat, bpm], …]`, `r` flip every N beats, `d` decoys, `x` double taps, `w` wavy track, `tr` triples, `ro` rolls, `li` lifts, `wp` warp, `ph` phantom, `rb` rebound, `sg` stutter, `sc` scatter, `s` spin, `q` squeeze |
| `notes` | `null` to generate from `seed`, or a fixed chart: `[{"b": 4, "n": 7, "t": "tap", "len": 0}, …]` |

Note types: `tap`, `hold`, `lift`, `roll`, `dbl`, `tri`, `decoy`, `ph`, `rb`, `sg`, `scl`, `scr`.

## Song

`songs/manifest.json`:

```json
{
  "version": 2,
  "songs": [
    {
      "id": "neon-drive",
      "name": "Neon Drive",
      "root": 57,
      "scale": [0, 2, 3, 5, 7, 8, 10],
      "chords": [0, 5, 3, 6],
      "lead": "sawtooth",
      "drums": 0
    }
  ]
}
```

`root` is a MIDI note, `chords` are degrees into `scale`, `lead` is an oscillator type and
`drums` picks a beat pattern. This is synthesised live, so it needs no audio file.

To play a real audio file instead, add **either** a path:

```json
"url": "../songs/audio/neon-drive.mp3"
```

or the file itself as base64, optionally gzipped first:

```json
"audio": "H4sIAAAA…"
```

With `url` or `audio` the file is fetched once, decoded and played back in sync with the
chart (the note clicks stay); the synth is skipped. The game falls back to the synth if the
file can't be loaded. Keep the files in `songs/audio/` and use `../songs/audio/<id>.mp3` for
`url`, since the path is resolved from the page, not from the manifest.

## Manifest

```json
{
  "version": 2,
  "songs": "../songs/manifest.json",
  "secret": "secret.json",
  "areas": [
    { "name": "Downbeat", "first": 0, "count": 50 },
    { "name": "Afterglow", "first": 50, "count": 50 }
  ],
  "levels": ["001.json", "002.json"]
}
```

`areas` drives the headings in the level list, `levels` is play order and `secret` is the
hidden level shown once it has been found.
