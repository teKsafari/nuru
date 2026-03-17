---
title: "Fibonacci in Nuru"
task: "Try changing `andika(fibo(10))` to `andika(fibo(15))` to see different results."
initialCode: |
  fanya fibo = unda(x) {
      kama (x == 0) {
          rudisha 0;
      } au kama (x == 1) {
          rudisha 1;
      } sivyo {
          rudisha fibo(x - 1) + fibo(x - 2);
      }
  }

  andika(fibo(10));
solution: |
  fanya fibo = unda(x) {
      kama (x == 0) {
          rudisha 0;
      } au kama (x == 1) {
          rudisha 1;
      } sivyo {
          rudisha fibo(x - 1) + fibo(x - 2);
      }
  }

  andika(fibo(15));
---
The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones.

In Nuru, we can use **recursion** (a function that calls itself) to solve this problem.
