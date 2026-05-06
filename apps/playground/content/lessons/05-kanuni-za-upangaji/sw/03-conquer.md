---
title: "3. Lini wa Kusimama (Kesi ya Msingi)"
task: "Ongeza sentensi ya `kama` ili kurudisha `orodha` ikiwa urefu wake ni 1 au chini ya hapo."
initialCode: |
  fanya panga = unda(orodha) {
      // Kesi ya Msingi: Ikiwa orodha ina kitu 1 tu, tayari imepangwa!
      // kama (orodha.idadi() <= 1) { ? }
      
      rudisha orodha
  }

  andika(panga([10])) // Inapaswa kurudisha [10]
solution: |
  fanya panga = unda(orodha) {
      kama (orodha.idadi() <= 1) {
          rudisha orodha
      }
      rudisha orodha
  }

  andika(panga([10]))
---
Je, tunaweza kuigawanya orodha hadi wapi?

Hatimaye, tutakuwa na orodha yenye **kitu kimoja** tu.

### Ugunduzi:
Orodha yenye namba moja tu **tayari imepangwa**!
- Je, `[5]` imepangwa? Ndiyo!
- Je, `[1]` imepangwa? Ndiyo!

Hii ndiyo **Kesi yetu ya Msingi**. Tukishafika kwenye orodha ya ukubwa wa 1, tunaacha kugawanya na kuanza kuziunganisha tena pamoja kwa mpangilio.

**Kazi Yako:** Ongeza Kesi ya Msingi. Ikiwa `orodha.idadi()` ni 1 au chini ya hapo, rudisha orodha hiyo mara moja.

```nuru
kama (orodha.idadi() <= 1) {
    +++rudisha orodha+++
}
```