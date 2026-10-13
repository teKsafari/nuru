---
title: "The Speed Limit"
task: "Change `fibo(10)` to `fibo(18)` on the `jibu` line. Run it and watch the number of calls explode. You may wait a second or two!"
---
The number of calls grows at a frightening pace:

- `fibo(5)`: 15 calls
- `fibo(10)`: 177 calls
- `fibo(18)`: 8,361 calls
- `fibo(30)`: 2,692,537 calls
- `fibo(40)`: more than 300 million calls

Each time `n` goes up by 1, the work grows by about 1.6 times. For `fibo(40)`, even a fast computer would sit calculating for many minutes.

The problem is not the computer. It is the **method**. The function computes `fibo(2)` thousands of times, starting from scratch every time. The next lesson fixes that.
