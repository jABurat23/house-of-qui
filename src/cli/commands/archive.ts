import { Command } from "commander"
import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import FormData from "form-data"

export function registerArchiveCommand(program: Command) {
    program
        .command("archive <file>")
        .description("Upload a build artifact to the Imperial Archive")
        .option("-v, --version <version>", "Build version")
        .action(async (file, opts) => {
            try {
                const filePath = path.resolve(file)
                if (!fs.existsSync(filePath)) {
                    console.error(`❌ File not found: ${file}`)
                    return
                }

                // Get project info from .qui config
                let projectId = "nexus-a06" // fallback
                let version = opts.version || "1.0.0"

                const CONFIG_PATH = path.join(process.cwd(), ".qui/config.json")
                if (fs.existsSync(CONFIG_PATH)) {
                    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"))
                    projectId = config.projectId
                    if (!opts.version && config.version) version = config.version
                }

                console.log(`📦 Archiving ${path.basename(filePath)} for project ${projectId} (v${version})...`)

                const form = new FormData()
                form.append('file', fs.createReadStream(filePath))
                form.append('projectId', projectId)
                form.append('version', version)

                const res = await axios.post("http://localhost:4000/monarch/archive/upload", form, {
                    headers: form.getHeaders()
                })

                console.log(`\n✅ Artifact archived successfully!`)
                console.log(`   ID: ${res.data.id}`)
                console.log(`   Version: ${res.data.version}`)
                console.log(`   Size: ${(res.data.size / 1024).toFixed(2)} KB`)
                console.log(`\nView all archives on the Imperial Dashboard under Project Details.`)

            } catch (err: any) {
                console.error("❌ Archiving failed:", err.response?.data?.message || err.message)
            }
        })
}
