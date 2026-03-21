import * as crypto from 'crypto';

export class SealService {
    /**
     * Generates a new RSA key pair for signing
     */
    static generateKeyPair() {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });
    }

    /**
     * Signs data with a private key
     */
    static sign(data: string, privateKey: string): string {
        const signer = crypto.createSign('sha256');
        signer.update(data);
        signer.end();
        return signer.sign(privateKey, 'base64');
    }

    /**
     * Verifies data against a signature and public key
     */
    static verify(data: string, signature: string, publicKey: string): boolean {
        try {
            const verifier = crypto.createVerify('sha256');
            verifier.update(data);
            verifier.end();
            return verifier.verify(publicKey, signature, 'base64');
        } catch (e) {
            return false;
        }
    }

    /**
     * Creates a canonical string from an object for signing
     */
    static canonicalize(obj: any): string {
        // Basic canonicalization by sorting keys
        const keys = Object.keys(obj).sort();
        const result: any = {};
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null) {
                result[key] = obj[key];
            }
        }
        return JSON.stringify(result);
    }
}
