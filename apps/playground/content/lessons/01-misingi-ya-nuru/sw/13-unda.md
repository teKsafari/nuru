---
title: "13. Vitendakazi (Functions)"
task: "Tengeneza kitendakazi `jumla` kinachochukua `a` na `b` na kurudisha jumla yao."
initialCode: |
  jumla = unda(a, b) {
      rudisha a + b
  }
  
  andika(jumla(5, 7))
solution: "jumla = unda(a, b) {\n    rudisha a + b\n}\n\nandika(jumla(5, 7))"
---
Vitendakazi ni mapande ya msimbo unayoweza kuyaita wakati wowote. Tunatumia neno `unda` kutengeneza kitendakazi.

### Kwa nini tutumie vitendakazi?
1. Kurahisisha kazi inayojirudia.
2. Kufanya msimbo uwe nadhifu.

### Mfano:
```nuru
fanya mraba = +++unda(n)+++ {
    +++rudisha n * n+++
}

andika(mraba(5)) // 25
andika(mraba(10)) // 100
```

