import { add } from "@/wasm";

export default function wasmDemo() {
    return (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => console.log(add(2n, 3n))}>
            Run in Rust
        </button>
    )
}
