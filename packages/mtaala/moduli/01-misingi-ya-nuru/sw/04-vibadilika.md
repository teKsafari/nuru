---
title: "Vibadilika (Variables)"
task: "Tengeneza kibadilika `maembe` chenye thamani `500` na `machungwa` chenye thamani `300`. Kisha andika jumla yao."
initialCode: |
  // Bei sokoni (shilingi)
  fanya maembe =
  fanya machungwa =
  andika()
solution: |
  // Bei sokoni (shilingi)
  fanya maembe = 500
  fanya machungwa = 300
  andika(maembe + machungwa)
tests:
  - type: match_code
    pattern: 'fanya\s+maembe\s*=\s*500'
    message: "Tengeneza kibadilika maembe chenye thamani 500."
  - type: match_code
    pattern: 'fanya\s+machungwa\s*=\s*300'
    message: "Tengeneza kibadilika machungwa chenye thamani 300."
  - type: match_code
    pattern: 'andika\([^)]*maembe\s*\+\s*machungwa|andika\([^)]*machungwa\s*\+\s*maembe'
    message: "Andika jumla kwa kutumia majina ya vibadilika, kama andika(maembe + machungwa)."
  - type: exact_output
    message: "Jumla inapaswa kuwa 800."
---
Kibadilika ni kama kikapu chenye jina. Unaweka thamani ndani yake, kisha unaitumia baadaye kwa kutaja jina la kikapu.

Unatengeneza kibadilika kipya kwa neno `fanya` na alama `=`:

```nuru
fanya +++nanasi+++ = 1500
fanya +++ndizi+++ = 200
andika(nanasi + ndizi)
```

Programu hii inaandika `1700`. Ukibadilisha bei ya nanasi, unabadilisha mstari mmoja tu na jumla inajirekebisha.

Baadaye unaweza kumpa kibadilika thamani mpya bila `fanya`:

```nuru
nanasi = 1200
```

### Kanuni za majina
- Anza na herufi, si namba: `bei1` ni sawa, `1bei` si sawa.
- Tumia `_` badala ya nafasi: `bei_ya_embe`.
- Herufi kubwa na ndogo ni tofauti: `Bei` na `bei` ni vibadilika viwili.
