import { useWasm } from "@/hooks/useWasm";

export default function wasmDemo() {
    const wasm = useWasm();
    return (
        <button disabled={!wasm} onClick={() => console.log(wasm!.add(2n, 3n))}>
            Run in Rust
        </button>
    )
}
