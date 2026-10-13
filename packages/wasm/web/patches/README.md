# Patches to the Nuru interpreter

`core/Nuru` is the upstream submodule and stays byte-for-byte untouched. The
browser build needs a few changes to it, so `scripts/build-wasm.sh`:

1. copies `core/Nuru` to `.build/nuru` (gitignored),
2. applies every `*.patch` in this folder, in name order, with `patch -p1`,
3. builds `web/` against that copy (`web/go.mod` replaces
   `github.com/NuruProgramming/Nuru` with `../.build/nuru`).

Paths in a patch are relative to the root of the Nuru repository
(`a/evaluator/...`, `b/evaluator/...`). Make one with:

```sh
cp -r core/Nuru /tmp/nuru-a && cp -r core/Nuru /tmp/nuru-b
# edit /tmp/nuru-b, then
cd /tmp && diff -ru nuru-a nuru-b | sed 's#nuru-a/#a/#; s#nuru-b/#b/#' > 0002-name.patch
```

If an upstream update makes a patch fail, the build stops with patch's error.
Refresh the patch against the new upstream, or drop it once upstream has the fix.

| Patch | Why |
|---|---|
| `0001-jaza-empty-answer.patch` | `jaza()` treated an empty answer or the typed word `null` as a failure in the browser, while the stdin replay path accepted them. Only a JS `null`/`undefined` from `prompt()` (no input available, or the run was stopped) is a failure now. |
