---
title: "5. Msururu wa Wito (Call Stack)"
task: "Weka `andika(n)` *baada* ya `hesabu(n - 1)` ili uone jinsi msururu wa wito unavyofunguka."
initialCode: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          rudisha tupu
      }
      
      hesabu(n - 1)
  }

  hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          rudisha tupu
      }
      
      hesabu(n - 1)
      andika(n)
  }

  hesabu(5)
---
Nini kimetokea? Kwa nini imehesabu KWENDA JUU badala ya chini?

Hii inatambulisha **Msururu wa Wito** (Call Stack). Kitendakazi kinapoita kitendakazi kingine, kitendakazi cha kwanza **hupumzika** na kusubiri cha pili kimalize.

### Kwa nini mpangilio ni muhimu:
Ikiwa tutaita `hesabu(n-1)` *kabla* ya kuandika, kompyuta itaendelea kupumzika na "kupanga" vitendakazi juu ya vingine hadi ifike `0`.

Mara tu kitendakazi cha `0` kinapomaliza, kompyuta inaendelea pale ilipoishia kwenye kitendakazi cha `1`, kisha cha `2`, na kuendelea.

### Mpangilio wa Msururu:
- `hesabu(5)` (Imepumzika)
- `hesabu(4)` (Imepumzika)
- `hesabu(3)` (Imepumzika)
- `hesabu(2)` (Imepumzika)
- `hesabu(1)` (Inafanya kazi) -> Inaandika 1
- `hesabu(2)` (Inaendelea) -> Inaandika 2
- ... na kuendelea.

**Kazi Yako:** Ongeza +++andika(n)+++ chini ya +++hesabu(n - 1)+++ ili uone "ufunguzi" huu ukifanyika. Itaandika namba kwa mpangilio wa kinyume (1, 2, 3, 4, 5)!

```nuru
fanya hesabu = unda(n) {
    kama (n <= 0) {
        rudisha tupu
    }
    
    hesabu(n - 1)
    +++andika(n)+++
}

hesabu(5)
```