#!/usr/bin/env bash
# Builds worker/nuru.wasm from web/ (Nuru core + kobe + ubao) with TinyGo.
#
# TinyGo must match the Go release it compiles against. Known-good pair:
#   TinyGo 0.39.0 + Go 1.25.x   (TinyGo 0.41 + Go 1.26 breaks on net/http)
# Override with TINYGO=/path/to/tinygo and GOROOT_125=/path/to/go1.25.
set -euo pipefail
cd "$(dirname "$0")/.."

TINYGO="${TINYGO:-$HOME/.local/tinygo/tinygo/bin/tinygo}"
GOROOT_125="${GOROOT_125:-$(ls -d "$HOME"/go/pkg/mod/golang.org/toolchain@v0.0.1-go1.25.*.linux-amd64 2>/dev/null | tail -1)}"

if [ ! -x "$TINYGO" ]; then
	echo "TinyGo not found at $TINYGO." >&2
	echo "Install: curl -sL https://github.com/tinygo-org/tinygo/releases/download/v0.39.0/tinygo0.39.0.linux-amd64.tar.gz | tar xz -C ~/.local/tinygo" >&2
	exit 1
fi
if [ -z "$GOROOT_125" ]; then
	echo "Go 1.25 toolchain not found. Fetch it with: GOTOOLCHAIN=go1.25.8 go version" >&2
	exit 1
fi

cd web
# Programs run on a goroutine. TinyGo's default 64KB goroutine stack overflows
# after a few levels of Nuru recursion (n * f(n - 1) crashed at depth 3).
# 1MB allows about 200 nested Nuru calls. Bigger stacks cost GC pauses: the
# collector scans the whole stack, and 4MB gave multi-second pauses. Keep -opt=2: with
# -opt=z a runaway recursion corrupts the heap instead of crashing, and every
# later run in that worker fails with "Neno Halifahamiki: andika".
PATH="$GOROOT_125/bin:$PATH" GOTOOLCHAIN=local "$TINYGO" build -target wasm -no-debug -opt=2 -stack-size=1MB -o ../worker/nuru.wasm .
cp "$(dirname "$TINYGO")/../targets/wasm_exec.js" ../worker/wasm_exec.js
ls -la ../worker/nuru.wasm
