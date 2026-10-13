---
title: "Kioo Kisicho na Mwisho"
task: "Endesha programu uone kinachotokea. Kisha weka `//` mbele ya mwito wa `kioo()` ulio **ndani** ya kitendakazi, ili kiandike mara moja tu."
initialCode: |
  fanya kioo = unda() {
      andika("Natazama kwenye kioo...")
      kioo()
  }

  kioo()
solution: |
  fanya kioo = unda() {
      andika("Natazama kwenye kioo...")
      // kioo()
  }

  kioo()
tests:
  - type: exact_output
    message: "Programu iandike Natazama kwenye kioo... mara moja tu."
---
Umewahi kusimama kati ya vioo viwili vinavyotazamana? Unaona picha yako ndani ya picha yako, ndani ya picha yako, bila mwisho.

Kitendakazi kinaweza **kujiita chenyewe**. Hii inaitwa **kujirudia** (recursion).

```nuru
fanya sema = unda() {
    andika("Habari!")
    +++sema()+++ // kinajiita chenyewe
}
```

Hatari yake: kitendakazi kikijiita bila sheria ya kusimama, kinajiita tena na tena mpaka kompyuta inaishiwa nafasi ya kukumbuka miito yote. Programu inaanguka.

Usiogope kuendesha programu ya mwanzo. Utaona kosa, na hilo ndilo somo: kila kitendakazi kinachojirudia kinahitaji njia ya kusimama.
