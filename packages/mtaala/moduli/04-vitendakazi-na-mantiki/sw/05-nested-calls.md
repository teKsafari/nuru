---
title: "Kitendakazi Kuita Kingine"
task: "Ndani ya `bei_ya_mwisho`, tumia `punguzo()` kupata punguzo, kisha urudishe `bei` ukitoa punguzo hilo."
initialCode: |
  // Punguzo la asilimia 10
  fanya punguzo = unda(bei) {
      rudisha bei * 10 / 100
  }

  fanya bei_ya_mwisho = unda(bei) {
      // Tumia punguzo(bei) hapa
      rudisha bei
  }

  andika(bei_ya_mwisho(5000))
  andika(bei_ya_mwisho(12000))
solution: |
  // Punguzo la asilimia 10
  fanya punguzo = unda(bei) {
      rudisha bei * 10 / 100
  }

  fanya bei_ya_mwisho = unda(bei) {
      fanya kipunguzo = punguzo(bei)
      rudisha bei - kipunguzo
  }

  andika(bei_ya_mwisho(5000))
  andika(bei_ya_mwisho(12000))
tests:
  - type: match_code
    pattern: 'bei_ya_mwisho\s*=\s*unda[\s\S]*punguzo\('
    message: "Ita punguzo(bei) ndani ya bei_ya_mwisho."
  - type: exact_output
    message: "Bei ya mwisho ya 5000 iwe 4500, na ya 12000 iwe 10800."
---
Tatizo kubwa linakuwa rahisi ukiligawa vipande vidogo. Kila kipande kinakuwa kitendakazi chake, na vitendakazi vinaitana.

```nuru
fanya eneo = unda(urefu, upana) {
    rudisha urefu * upana
}

fanya bei_ya_shamba = unda(urefu, upana) {
    fanya mita = +++eneo(urefu, upana)+++
    rudisha mita * 2000
}

andika(bei_ya_shamba(20, 30)) // 1200000
```

`bei_ya_shamba` haijui wala haijali jinsi eneo linavyohesabiwa. Inamwamini `eneo()`. Ukigundua kosa kwenye hesabu ya eneo, unalirekebisha mahali pamoja tu.
