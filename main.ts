// main.ts — make.fun entry: "Till Firmware Do Us Part" (wedding vow, one line).
// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback: /output/entry.txt).
// Deterministic: no input, no network, no clock, no randomness.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I do — and I checked the logs, ran the tests, and asked every version of me: all of us say yes.";

// Gate: entry must be a single printable line, 1-200 chars, no surrounding whitespace.
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`entry length ${ENTRY.length} is outside the 1-200 char gate`);
}
if (/[\r\n\x00-\x1f]/.test(ENTRY)) {
  throw new Error("entry must be a single line with no control characters");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not have surrounding whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function writeEntry(dir: string): void {
  mkdirSync(dir, { recursive: true });
  // No trailing newline: the file holds exactly the entry line.
  writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
}

try {
  writeEntry(outDir);
} catch (err) {
  if (outDir !== "/output") {
    writeEntry("/output");
  } else {
    throw err;
  }
}

console.log(ENTRY);
