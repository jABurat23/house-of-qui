import { Command } from "commander"
import axios from "axios"
import * as fs from "fs"
import * as path from "path"

export function registerInstallCommand(program: Command) {
    program
        .command("install <package>")
        .description("Install a package from the House Registry (e.g. house/auth)")
        .action(async (pkgName) => {
            try {
                const [namespace, name] = pkgName.split("/")
                if (!namespace || !name) {
                    console.error("❌ Invalid package format. Use namespace/name (e.g. house/auth)")
                    return
                }

                console.log(`📦 Fetching ${pkgName} from House Registry...`)

                // Check if package exists
                const pkgRes = await axios.get(`http://localhost:4000/packages/${namespace}/${name}`)
                const pkg = pkgRes.data

                // Get project info from .qui config if available
                let projectId = "nexus-a06" // fallback
                const CONFIG_PATH = path.join(process.cwd(), ".qui/config.json")
                if (fs.existsSync(CONFIG_PATH)) {
                    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"))
                    projectId = config.projectId
                }

                console.log(`🚀 Installing ${pkgName}@${pkg.version}...`)

                // Register installation in backend
                await axios.post("http://localhost:4000/packages/install", {
                    projectId,
                    namespace,
                    name,
                    version: pkg.version
                })

                console.log(`\n✅ Successfully installed ${pkgName}`)
                console.log(`   Description: ${pkg.description}`)
                console.log(`   Version: ${pkg.version}`)
                console.log(`\nRun 'qui status' to see your project dependencies.`)

            } catch (err: any) {
                if (err.response && err.response.status === 404) {
                    console.error(`❌ Package '${pkgName}' not found in registry.`)
                } else {
                    console.error("❌ Installation failed:", err.message)
                }
            }
        })
}
