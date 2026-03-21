import { Command } from "commander"
import axios from "axios"

export function registerDeployCommand(program: Command) {
    program
        .command("deploy <id>")
        .description("Deploy a project by ID")
        .option("--pversion <version>", "Version to deploy", "latest")
        .action(async (id: string, opts: any) => {
            try {
                console.log(`🚀 Initiating deployment for project ${id} (version ${opts.pversion})...`);
                const res = await axios.post(`http://localhost:4000/monarch/projects/${id}/deploy`, {
                    version: opts.pversion
                })

                console.log("✅ Deployment started:")
                console.log("Deployment ID:", res.data.id)
                console.log("Status:", res.data.status)
                console.log("Version:", res.data.version)
            } catch (err: any) {
                console.error("❌ Deployment failed:", err?.response?.data || err.message)
            }
        })
}
