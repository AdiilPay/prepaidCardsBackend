import {Mutex} from 'async-mutex';

export default class SnowflakeGenerator {
    private static instance: SnowflakeGenerator | null = null;
    private static instanceMutex = new Mutex();

    private readonly epoch: number;
    private readonly workerId: number;

    private readonly workerIdBits: number = 10;
    private readonly sequenceBits: number = 12;

    private readonly workerIdShift: number;
    private readonly timestampLeftShift: number;

    private readonly maxSequence: number;

    private lastTimestamp: number = -1;
    private sequence: number = 0;

    private mutex = new Mutex(); // Mutex pour protéger nextId

    // Constructeur privé : empêche la création directe
    private constructor(workerId: number, epoch: number) {
        if (workerId < 0 || workerId > 1023) {
            throw new Error("workerId doit être entre 0 et 1023");
        }

        this.workerId = workerId;
        this.epoch = epoch;

        this.maxSequence = (1 << this.sequenceBits) - 1; // 4095
        this.workerIdShift = this.sequenceBits;
        this.timestampLeftShift = this.workerIdShift + this.workerIdBits;
    }

    /**
     * Méthode statique pour récupérer l'instance unique du générateur.
     * Thread-safe : si plusieurs appels concurrents arrivent, le mutex garantit qu'une seule instance sera créée.
     */
    public static async getInstance(workerId: number, epoch: number): Promise<SnowflakeGenerator> {
        return await this.instanceMutex.runExclusive(async () => {
            if (this.instance === null) {
                this.instance = new SnowflakeGenerator(workerId, epoch);
            }
            return this.instance;
        });
    }

    private currentTime(): number {
        return Date.now();
    }

    private waitNextMillis(lastTimestamp: number): Promise<number> {
        return new Promise((resolve) => {
            const check = () => {
                const now = this.currentTime();
                if (now > lastTimestamp) {
                    resolve(now);
                } else {
                    setImmediate(check);
                }
            };
            check();
        });
    }

    public async nextId(): Promise<bigint> {
        return this.mutex.runExclusive(async () => {
            let timestamp = this.currentTime();

            if (timestamp < this.lastTimestamp) {
                // Si l'horloge recule, on soulève une exception
                throw new Error("L'horloge système a reculé, impossible de générer un ID.");
            }

            if (timestamp === this.lastTimestamp) {
                this.sequence = (this.sequence + 1) & this.maxSequence;
                if (this.sequence === 0) {
                    // La séquence est pleine, on attend la prochaine milliseconde
                    timestamp = await this.waitNextMillis(timestamp);
                }
            } else {
                this.sequence = 0;
            }

            this.lastTimestamp = timestamp;

            const relativeTimestamp = BigInt(timestamp - this.epoch);
            const workerId = BigInt(this.workerId);
            const sequence = BigInt(this.sequence);

            return (relativeTimestamp << BigInt(this.timestampLeftShift))
                | (workerId << BigInt(this.workerIdShift))
                | sequence;
        });
    }
}