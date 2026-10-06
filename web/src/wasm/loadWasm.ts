import init, * as wasm from "wasm-image-editor";

let initPromise: Promise<typeof wasm> | null = null;

// Runs init() only the first time; later calls reuse the same promise
export function loadWasm() {
  if (!initPromise) {
    initPromise = init().then(() => wasm);
  }
  return initPromise;
}