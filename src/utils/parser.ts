export function toBigInt(value: any): null | bigint {
    try {
        return BigInt(value);
    } catch {
        return null;
    }
}