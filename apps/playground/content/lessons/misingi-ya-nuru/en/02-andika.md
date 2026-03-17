---
title: "2. Outputting Results (andika)"
task: "Use `andika()` to print your name and the city you live in on two different lines using `/n`."
initialCode: |
  andika("Jina langu ni ... /n Naishi ...")
solution: "andika(\"Jina langu ni Amani /n Naishi Dar es Salaam\")"
---
The `andika()` function is used to display information or results on the screen. It is our main way of talking to the user.

### Features of andika():
1. It takes anything (numbers, text, etc.) and prints it.
2. You can print multiple things at once by separating them with a comma (`,`).
3. For text (strings), you must place them inside double quotes (`" "`).

### Example:
```s
andika("Hello", "World") // Prints: Hello World
andika(2024)             // Prints: 2024
```

You can also use special characters like `/n` to start a new line:
```s
andika("First line /n Second line")
```

