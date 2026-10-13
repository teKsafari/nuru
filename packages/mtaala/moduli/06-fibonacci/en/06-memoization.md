---
title: "Remembering Answers (Memoization)"
task: "Inside `kama (kumbukumbu[n] != tupu)`, return the stored answer: `rudisha kumbukumbu[n]`. The number of calls will drop from 8361 to 35."
---
Imagine your teacher asks you `347 x 29` ten times in a row. Would you work it out again each time? No! You would write the answer on the side and just read it.

That is **memoization**: each time we find an answer, we store it in a dictionary. When asked again, we check the dictionary first.

```nuru
fanya kumbukumbu = {}

kumbukumbu[5] = 5
andika(kumbukumbu[5])         // 5
andika(kumbukumbu[7])         // null: not stored yet
andika(kumbukumbu[7] == +++tupu+++) // kweli
```

A dictionary returns `tupu` (null) for a key it does not contain. So `kumbukumbu[n] != tupu` means: "we already know this answer".
