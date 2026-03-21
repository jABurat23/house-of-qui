import { Command } from "commander"
import axios from "axios"
import * as fs from "fs"
import * as path from "path"

export function registerEmitCommand(program: Command) {
    program
        .command("emit <type>")
        .description("Emit an event to the Imperial Bus")
        .option("-p, --payload <json>", "JSON payload for the event")
        .action(async (type, opts) => {
            try {
                let projectId = "nexus-a06" // fallback

                const CONFIG_PATH = path.join(process.cwd(), ".qui/config.json")
                if (fs.existsSync(CONFIG_PATH)) {
                    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"))
                    projectId = config.projectId
                }

                let payload = {}
                if (opts.payload) {
                    try {
                        payload = JSON.parse(opts.payload)
                    } catch (e) {
                        console.error("❌ Invalid JSON payload")
                        return
                    }
                }

                console.log(`📡 Emitting signal '${type}' from project ${projectId}...`)

                const res = await axios.post("http://localhost:4000/communication/emit", {
                    type,
                    payload
                }, {
                    headers: {
                        'x-project-id': projectId
                    }
                })

                console.log(`\n✅ Signal broadcasted to the Imperial Bus!`)
                console.log(`   Event ID: ${res.data.id}`)
                console.log(`\nView the live feed on the Imperial Dashboard.`)

            } catch (err: any) {
                console.error("❌ Emission failed:", err.response?.data?.message || err.message)
            }
        })
}
