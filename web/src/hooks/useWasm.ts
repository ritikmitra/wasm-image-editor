import { useEffect, useState } from "react";
import { loadWasm } from "@/wasm/loadWasm";

export function useWasm() {
    const [mod, setMod] = useState<Awaited<ReturnType<typeof loadWasm>> | null>(null);

    useEffect(() => {
        loadWasm().then(setMod);
    }, []);

    return mod; // null until ready
}