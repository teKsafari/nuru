---
title: "Fibonacci with a Loop"
task: "Finish `fibo_kitanzi(n)` with a loop: start with `a = 0` and `b = 1`, and on each round `a` takes the value of `b`, and `b` takes `a + b`. At the end, return `a`."
---
Memoization saved us. But there is an even simpler way: walk forward step by step, remembering only the **last two** numbers.

```text
a  b
0  1
1  1
1  2
2  3
3  5
```

Each round: the new `a` is the old `b`, and the new `b` is the sum of both.

Watch the order! If you write `a = b` first, you lose the old `a` before using it. Store the sum in a temporary variable first:

```nuru
fanya +++ijayo = a + b+++
a = b
b = ijayo
```

Congratulations on finishing this module! You have seen three big ideas: double recursion, the cost of repeated work, and how a better method makes a program thousands of times faster.
