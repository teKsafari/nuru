---
title: "2. Outputting Results (andika)"
task: "Use `andika()` to print your name and the city you live in on two different lines using `\n`."
initialCode: |
  andika()
tests:
  - type: match_output
    pattern: "jina langu ni .+"
    flags: i
    message: "You must include 'Jina langu ni [your name]'"
  - type: match_output
    pattern: "naishi .+"
    flags: i
    message: "You must include 'Naishi [your city]'"
---
The `andika()` function is used to display information or results on the screen. It is our main way of talking to the user.

### Features of andika():
1. It takes anything (numbers, text, etc.) and prints it.
2. You can print multiple things at once by separating them with a comma (`,`).
3. For text (strings), you must place them inside double quotes (`" "`).

### Example:
```nuru
andika(+++"Jina langu ni Amani \n Naishi Dar es Salaam"+++)
```

