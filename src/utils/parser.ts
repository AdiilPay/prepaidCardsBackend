export function toBigInt(value: string): null | bigint {
    try {
        return BigInt(value);
    } catch {
        return null;
    }
}