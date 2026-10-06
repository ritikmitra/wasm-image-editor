import { useEffect, useState } from "react";
import init, { add } from "wasm-image-editor";

function WasmTest() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function loadWasm() {
            await init();
            setReady(true);
        }

        loadWasm();
    }, []);

    if (!ready) {
        return <p>Loading WASM...</p>;
    }

    const result = add(3n, 3n);

    console.log("Rust says:", result);

    return <p>Rust says: {result}</p>;
}

export default WasmTest;
