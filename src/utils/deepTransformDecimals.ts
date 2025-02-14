import { Prisma } from '@prisma/client'

type Transformed<T> = T extends Prisma.Decimal
    ? number
    : T extends object
        ? { [K in keyof T]: Transformed<T[K]> }
        : T;

function deepTransformDecimals<T>(obj: T): Transformed<T> {
    if (obj instanceof Prisma.Decimal) {
        return obj.toNumber() as Transformed<T>;

    } else if (obj instanceof Date) {
        return obj as unknown as Transformed<T>;

    } else if (Array.isArray(obj)) {
        return obj.map(item => deepTransformDecimals(item)) as unknown as Transformed<T>;

    } else if (obj !== null && typeof obj === 'object') {

        return Object.keys(obj).reduce((acc, key) => {
            acc[key] = deepTransformDecimals((obj as { [key: string]: any })[key]);
            return acc;
        }, {} as { [key: string]: any }) as Transformed<T>;
    }
    // Retourner l'objet inchangé s'il n'est ni Decimal, ni tableau, ni objet
    return obj as Transformed<T>;
}

export default deepTransformDecimals;
