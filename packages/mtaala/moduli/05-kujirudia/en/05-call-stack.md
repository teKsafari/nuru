---
title: "The Call Stack"
task: "Move `andika(n)` so that it comes **after** `hesabu(n - 1)`, and the program prints `1` to `5` going up."
---
When a function calls another function, the first one **waits** until the second one finishes. Then it carries on where it left off.

The computer piles the waiting calls on top of each other, like stacked plates. This is called the **call stack**.

```text
hesabu(5) waits
  hesabu(4) waits
    hesabu(3) waits
      hesabu(2) waits
        hesabu(1) waits
          hesabu(0) stops
        hesabu(1) continues: prints 1
      hesabu(2) continues: prints 2
    ...
```

If you print **before** calling yourself, the numbers come out on the way down the stack. If you print **after**, they come out on the way back up, in reverse order.
