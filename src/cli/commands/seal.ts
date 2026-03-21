import { Command } from "commander"
import * as fs from "fs"
import * as path from "path"
import * as crypto from 'crypto'

export function registerSealCommand(program: Command) {
    program
        .command("seal")
        .description("Generate cryptographic keys for your project (The Great Seal)")
        .action(async () => {
            try {
                const SEAL_DIR = path.join(process.cwd(), ".qui/seal")
                if (!fs.existsSync(SEAL_DIR)) {
                    fs.mkdirSync(SEAL_DIR, { recursive: true })
                }

                const privPath = path.join(SEAL_DIR, "private.pem")
                const pubPath = path.join(SEAL_DIR, "public.pem")

                if (fs.existsSync(privPath)) {
                    console.log("🔒 The Great Seal already exists for this project.")
                    return
                }

                console.log("⚒️  Forging The Great Seal (Generating keys)...")

                const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
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

                fs.writeFileSync(privPath, privateKey)
                fs.writeFileSync(pubPath, publicKey)

                // Also add public key to config
                const CONFIG_PATH = path.join(process.cwd(), ".qui/config.json")
                if (fs.existsSync(CONFIG_PATH)) {
                    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"))
                    config.publicKey = publicKey
                    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
                }

                console.log("\n✅ The Great Seal has been forged!")
                console.log(`   Private Key: .qui/seal/private.pem (KEEP THIS SECRET)`)
                console.log(`   Public Key:  .qui/seal/public.pem`)
                console.log("\nYour project is now ready for signed communication.")

            } catch (err: any) {
                console.error("❌ Failed to forge seal:", err.message)
            }
        })
}
