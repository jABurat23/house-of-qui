import { Command } from "commander"
import { registerStatusCommand } from "./commands/status"
import { registerProjectsCommand } from "./commands/projects"
import { registerInitCommand } from "./commands/init"
import { registerDeployCommand } from "./commands/deploy"
import { registerInstallCommand } from "./commands/install"
import { registerSealCommand } from "./commands/seal"
import { registerArchiveCommand } from "./commands/archive"
import { registerEmitCommand } from "./commands/emit"

const program = new Command()

program
  .name("qui")
  .description("House of Qui CLI")
  .version("0.1.0")

registerStatusCommand(program)
registerProjectsCommand(program)
registerInitCommand(program)
registerDeployCommand(program)
registerInstallCommand(program)
registerSealCommand(program)
registerArchiveCommand(program)
registerEmitCommand(program)

program.parse(process.argv)