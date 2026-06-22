# @nuru/wasm

A high-performance WebAssembly (Wasm) interpreter for [Nuru](https://github.com/NuruProgramming/Nuru) — a Swahili-based programming language. This package enables Nuru code to run directly in the browser, powering the [Nuru Playground](https://github.com/Heracraft/nuru-playground) and other web-based Nuru tools.

## Overview

This project compiles the core Go-based Nuru interpreter into WebAssembly, allowing it to interface with JavaScript. It bridges the gap between Nuru's backend logic and frontend applications, providing a  execution environment on the web.

## Features

- **In-Browser Execution**: Run Nuru code client-side without a backend server.
- **JavaScript Interop**: Simple API to send code to the interpreter and receive output.
- **Custom Builtins**: Modified built-in functions optimized for the browser environment (e.g., handling input/output).

## Prerequisites

To build and develop this package, you need:

- **Go**: version 1.19.0 or higher
- **Node.js**: version 18.13 or higher
- **pnpm**: Package manager

```shell
# Install pnpm if not already installed
npm install -g pnpm
```

## Installation & Setup

> **Note:** This project is part of a monorepo managed by [Turborepo](https://turbo.build/). Use `turbo run <process>` from the root directory to execute tasks (e.g., `turbo run build:wasm`, `turbo run test`). This ensures proper caching and dependency management.

1. **Navigate to the package directory:**
   ```bash
   cd packages/wasm
   ```

2. **Initialize Submodules:**
   The core Nuru codebase is included as a git submodule in `core/Nuru`. Make sure it is initialized and up to date:
   ```bash
   npm run update-core
   ```

## Building the WASM Binary

We build the WebAssembly binary using [TinyGo](https://tinygo.org/) for optimized production builds and standard Go for development.

To compile the core code into a `.wasm` binary using TinyGo (as configured in our package script):

```bash
cd core/Nuru && GOOS=js GOARCH=wasm tinygo build -o ../../main.wasm
```

Alternatively, run the build script from the package directory:

```bash
npm run build:wasm
```

## Usage

This package provides a TypeScript wrapper to initialize and run the Nuru interpreter WebAssembly binary in a browser environment.

### Installation

Add the package to your `package.json` dependencies:

```json
{
  "dependencies": {
    "@nuru/wasm": "workspace:*"
  }
}
```

### JavaScript API

#### `init(config)`

Initializes the Nuru interpreter and returns a promise that resolves to a `NuruInstance`.

- **Parameters**:
  - `config` (`InterpreterConfig`):
    - `outputReceiver` (`(text: string, isError: boolean) => void`): Required callback for handling interpreter prints and errors.
    - `xssProtection` (`boolean`, optional): Sanitizes the output before sending it to `outputReceiver`. Default is `true`.
    - `version` (`string`, optional): The version of the WASM binary to load from the CDN. Default is `"latest"`.
    - `wasmURL` (`string`, optional): A custom URL to load the WASM binary from (e.g. for self-hosting).

- **Returns**: `Promise<NuruInstance>`

#### `NuruInstance`

- `initialized`: `boolean` indicating if the WASM binary is loaded and initialized.
- `execute(code: string, stdinBuffer?: string[])`: Executes the provided Nuru code.
  - `code` (`string`): The Nuru source code to run.
  - `stdinBuffer` (`string[]`, optional): An array of strings containing preloaded inputs. Each call to Nuru's `jaza()` built-in will shift an item from this array. If empty or undefined, `jaza()` falls back to the browser's native `prompt()` dialog.

#### JavaScript Example

```javascript
import init from '@nuru/wasm';

// 1. Initialize the interpreter
const nuru = await init({
  outputReceiver: (text, isError) => {
    if (isError) {
      console.error("Nuru Error:", text);
    } else {
      console.log("Nuru Output:", text);
    }
  }
});

// 2. Execute code with predefined inputs
const code = `
mambo = jaza("Mambo vipi?")
andika("Umesema:", mambo)
`;

nuru.execute(code, ["Safi sana!"]);
```

### React Integration

The package exports a React hook `useNuru` to simplify state and lifecycle management.

#### Import Path

```typescript
import { useNuru } from "@nuru/wasm/react";
```

#### `useNuru(outputReceiver, interpreterConfig?)`

- **Parameters**:
  - `outputReceiver` (`(text: string, isError: boolean) => void`): Callback for output and errors.
  - `interpreterConfig` (`Omit<InterpreterConfig, "outputReceiver">`, optional): Config options to pass to the underlying `init` call.

- **Returns**: `NuruInstance` (either the active instance, or a stub instance if still initializing).

#### React Example

```tsx
import React, { useState } from "react";
import { useNuru } from "@nuru/wasm/react";

export function NuruPlayground() {
  const [code, setCode] = useState('andika("Mambo!")');
  const [output, setOutput] = useState<string[]>([]);

  const nuru = useNuru((text, isError) => {
    setOutput((prev) => [...prev, `${isError ? "Error: " : ""}${text}`]);
  });

  const handleRun = () => {
    if (nuru.initialized) {
      nuru.execute(code);
    }
  };

  return (
    <div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={handleRun} disabled={!nuru.initialized}>
        {nuru.initialized ? "Run Code" : "Loading Interpreter..."}
      </button>
      <pre>
        {output.join("\n")}
      </pre>
    </div>
  );
}
```

## Scripts

This project is part of a monorepo managed by **Turborepo**. You should run scripts from the **root of the monorepo** using specific filters or let turbo handle dependencies automatically.

### Common Commands

- **Test**:
  ```bash
  turbo run test --filter=@nuru/wasm
  ```

- **Build WASM Binary**:
  ```bash
  turbo run build --filter=@nuru/wasm
  ```

> Note: The underlying npm scripts (e.g. running `npm run build:wasm` from this package directory) will also work, but they bypass Turborepo's caching. For consistent monorepo workflows, prefer running these commands via `turbo` from the repository root.

## Contributing

Contributions are welcome! If you make modifications to the core interpreter, make sure to test changes across both dev (`go`) and production (`tinygo`) compilation paths before submitting a pull request.