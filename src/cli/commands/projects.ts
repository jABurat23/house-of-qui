import { Command } from "commander"
import axios from "axios"

export function registerProjectsCommand(program: Command) {

  program
    .command("projects")
    .description("List registered projects")
    .action(async () => {

      try {
        const res = await axios.get("http://localhost:4000/monarch/projects")
        console.log("\n📋 Registered Projects:\n")
        console.table(res.data)
      } catch (err: any) {
        console.error("Failed to fetch projects:", err?.response?.data || err.message)
      }

    })

}