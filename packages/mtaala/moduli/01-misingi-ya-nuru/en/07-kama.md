---
title: "Decisions (kama, au kama, sivyo)"
task: "Finish the results program: for 80 or more print `Daraja A`, for 50 or more print `Umefaulu`, otherwise print `Jaribu tena`. Use `kama`, `au kama` and `sivyo`."
---
A good program makes decisions. With `kama` (if), you tell the computer: "if this is true, do this".

```nuru
fanya mvua = kweli

kama (mvua) {
    andika("Beba mwavuli")
} sivyo {
    andika("Vaa kofia")
}
```

When you need more than two paths, add `au kama` (else if). The computer checks the conditions from the top. It runs the first one that is true and skips all the others. `sivyo` (else) runs when none are true.

```nuru
fanya saa = 15

kama (saa < 12) {
    andika("Habari za asubuhi")
} +++au kama (saa < 16) {
    andika("Habari za mchana")
}+++ sivyo {
    andika("Habari za jioni")
}
```

Once you finish, try changing `alama` to 90 or 30 and watch the output change.
