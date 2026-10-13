---
title: "Mraba"
task: "Chora mraba wenye pande za hatua `120`, ukigeuka **kushoto** digrii `90` kila kona. Tumia kitanzi cha `kwa` kinachorudia mara 4."
initialCode: |
  tumia kobe

  kobe.mbele(120)
  kobe.kushoto(90)
solution: |
  tumia kobe

  kwa i ktk mfululizo(4) {
      kobe.mbele(120)
      kobe.kushoto(90)
  }
tests:
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk'
    message: "Tumia kitanzi cha kwa badala ya kuandika kila upande kwa mkono."
  - type: kobe_picha
    message: "Mraba wako haufanani na unaotakiwa: pande 4 za hatua 120, kona za digrii 90."
---
Mraba una pande 4 zinazolingana na kona 4 za digrii 90. Kwa kila upande, kobe anafanya mambo mawili: anatembea, kisha anageuka.

Unaweza kuandika amri hizo mara nne. Lakini umeshajifunza njia bora: **kitanzi**.

```nuru
tumia kobe

+++kwa i ktk mfululizo(3)+++ {
    kobe.mbele(80)
    kobe.kulia(90)
}
```

Mfano huu unachora pande 3 tu za mraba. Kobe akigeuka mara 4 kwa digrii 90, amezunguka digrii 360 na anarudi alipoanzia, akitazama upande uleule.
