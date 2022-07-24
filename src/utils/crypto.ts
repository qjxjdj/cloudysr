import { readFileSync } from "fs";
import path from "path";

export function cloneBuffer(buffer: Buffer) {
    const other = Buffer.allocUnsafe(buffer.length);
    buffer.copy(other);
    return other;
}

export function xorBuffer(key: Buffer, buffer: Buffer) {
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= key[i % key.length]!;
    }
}

export class Ec2b {
    readonly ec2b: Buffer;
    readonly key: Buffer;

    constructor(ec2b: string, key: string) {
        this.ec2b = readFileSync(ec2b);
        this.key = readFileSync(key);
    }

    cipher(buffer: Buffer) {
        buffer = cloneBuffer(buffer);
        xorBuffer(this.key, buffer);
        return buffer;
    }
}

const ec2bPath = path.join(__dirname, "..", "..", "resources", "ec2b");

export class Crypto{
    static readonly ec2b: Ec2b = new Ec2b(path.join(ec2bPath, "dispatchSeed.bin"), path.join(ec2bPath, "dispatchKey.bin"));
}