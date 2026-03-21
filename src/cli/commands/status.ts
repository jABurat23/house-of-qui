import { Command } from "commander"
import axios from "axios"

export function registerStatusCommand(program: Command) {

  program
    .command("status")
    .description("Check House of Qui system status")
    .action(async () => {

      try {
        const res = await axios.get("http://localhost:4000/monarch/projects")
        console.log("\n🏛️  House of Qui Status:")
        console.log("  API Server: ✅ Running on port 4000")
        console.log("  Projects Registered:", res.data.length)
        console.log("  System: ✅ Active\n")
      } catch (err: any) {
        console.error("❌ System status check failed:", err.message)
      }

    })

}