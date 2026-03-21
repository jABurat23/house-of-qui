import { Command } from "commander"
import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"

export function registerInitCommand(program: Command) {

  program
    .command("init")
    .description("Initialize a project and register with the House")
    .option("-n, --name <name>", "Project name")
    .option("-d, --description <description>", "Project description")
    .option("-r, --repository <repository>", "Repository URL")
    .option("--pversion <version>", "Project version", "0.0.0")
    .action(async (opts: any) => {

      const name = opts.name || "unnamed-project"
      const description = opts.description || ""
      const version = opts.pversion || "0.0.0"

      try {
        const payload: any = {
          name,
          description,
          repository: opts.repository,
          version
        }

        // Check for The Great Seal
        const SEAL_DIR = path.join(process.cwd(), ".qui/seal")
        const privPath = path.join(SEAL_DIR, "private.pem")
        const pubPath = path.join(SEAL_DIR, "public.pem")

        if (fs.existsSync(privPath) && fs.existsSync(pubPath)) {
          console.log("📜 Signing registration with The Great Seal...")
          const privateKey = fs.readFileSync(privPath, "utf8")
          const publicKey = fs.readFileSync(pubPath, "utf8")

          const dataToSign = {
            name,
            description,
            repository: opts.repository || '',
            version
          }

          // Canonicalize for signing
          const keys = Object.keys(dataToSign).sort() as Array<keyof typeof dataToSign>
          const canonicalData: any = {}
          for (const key of keys) {
            canonicalData[key] = dataToSign[key]
          }
          const dataToSignCanonical = JSON.stringify(canonicalData)

          const signer = crypto.createSign('sha256')
          signer.update(dataToSignCanonical)
          signer.end()
          const signature = signer.sign(privateKey, 'base64')

          payload.publicKey = publicKey
          payload.signature = signature
        }

        const res = await axios.post("http://localhost:4000/monarch/projects/register", payload)

        console.log("\n✅ Project registered:\n")
        console.log("ID:", res.data.project.id)
        console.log("Name:", res.data.project.name)
        console.log("Version:", version)
        console.log("Status:", res.data.project.status)

        // Save to config
        const CONFIG_DIR = path.join(process.cwd(), ".qui")
        if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true })
        const CONFIG_PATH = path.join(CONFIG_DIR, "config.json")
        let config: any = {}
        if (fs.existsSync(CONFIG_PATH)) config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"))

        config.projectId = res.data.project.id
        config.name = res.data.project.name
        config.version = version

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))

        console.log("\n🔐 Service Token (store this securely):\n")
        console.log(res.data.token)
        console.log()

      } catch (err: any) {
        console.error("❌ Registration failed:", err?.response?.data || err.message)
      }

    })

}
