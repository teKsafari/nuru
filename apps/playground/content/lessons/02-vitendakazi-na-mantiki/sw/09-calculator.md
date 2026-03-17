---
title: "9. Mradi Mdogo: Kikokotozi"
task: "Malizia kitendakazi `kikokotozi` (calculator) kwa kujaza mantiki ya kutoa, kuzidisha, na kugawanya."
initialCode: |
  fanya kikokotozi = unda(a, b, tendo) {
      kama (tendo == "jumla") {
          rudisha a + b
      }
      kama (tendo == "toa") {
          // ?
      }
      kama (tendo == "zidisha") {
          // ?
      }
      kama (tendo == "gawanya") {
          // ?
      }
      rudisha "Tendo halijulikani"
  }

  andika("10 + 5 =", kikokotozi(10, 5, "jumla"))
  // andika("10 - 5 =", kikokotozi(10, 5, "toa"))
  // andika("10 * 5 =", kikokotozi(10, 5, "zidisha"))
  // andika("10 / 5 =", kikokotozi(10, 5, "gawanya"))
solution: |
  fanya kikokotozi = unda(a, b, tendo) {
      kama (tendo == "jumla") {
          rudisha a + b
      }
      kama (tendo == "toa") {
          rudisha a - b
      }
      kama (tendo == "zidisha") {
          rudisha a * b
      }
      kama (tendo == "gawanya") {
          rudisha a / b
      }
      rudisha "Tendo halijulikani"
  }

  andika("10 + 5 =", kikokotozi(10, 5, "jumla"))
  andika("10 - 5 =", kikokotozi(10, 5, "toa"))
  andika("10 * 5 =", kikokotozi(10, 5, "zidisha"))
  andika("10 / 5 =", kikokotozi(10, 5, "gawanya"))
---
Hongera kwa kufika mbali hivi! Umejifunza jinsi ya kutengeneza vitendakazi, kupitisha hoja, kurudisha thamani, na hata kushughulikia wigo na closures.

Sasa, hebu tujenge kitu cha muhimu: **Kikokotozi** (Calculator).

### Kutumia Maamuzi ya Kimantiki:
Tunatumia sentensi ya `kama` (if) ili kuangalia kile ambacho mtumiaji anataka kufanya. Ikiwa `tendo == "jumla"`, tunajumlisha namba hizo.

### Kwa nini hii ni muhimu?
Mfumo huu unatumika kila mahali! Kuanzia kuamua ni kitufe gani mtumiaji alibonyeza kwenye tovuti hadi kuamua jinsi mhusika anavyosogea kwenye mchezo wa video (game).

**Kazi Yako:** Kamilisha mantiki iliyokosekana kwa shughuli nyingine tatu za kihisabati (`toa`, `zidisha`, `gawanya`). Usisahau kutoa alama za `//` kwenye majaribio yaliyo chini kabisa!