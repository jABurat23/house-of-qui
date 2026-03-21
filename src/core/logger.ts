const ANSI = {
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
  GOLD: "\x1b[38;5;220m",
  RED: "\x1b[31m",
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  GREY: "\x1b[90m"
};

const realmColors: Record<string, string> = {
  MONARCH: ANSI.GOLD,
  SECURITY: ANSI.RED,
  TREASURY: ANSI.CYAN,
  SYSTEM: ANSI.GREEN,
  INTEL: ANSI.MAGENTA,
  LOGISTICS: ANSI.BLUE,
  AUDIT: ANSI.GREY
};

const realmIcons: Record<string, string> = {
  MONARCH: "👑",
  SECURITY: "🛡️ ",
  TREASURY: "💎",
  SYSTEM: "⚙️ ",
  INTEL: "👁️ ",
  LOGISTICS: "🚛",
  AUDIT: "📜"
};

class ImperialLogger {
  private formatHeader(realm: string) {
    const color = realmColors[realm] || ANSI.GOLD;
    const icon = realmIcons[realm] || "🏛️ ";
    const timestamp = new Date().toLocaleTimeString();
    
    return `${ANSI.GREY}[${timestamp}]${ANSI.RESET} ${color}${ANSI.BOLD}${icon} [${realm}]${ANSI.RESET}`;
  }

  monarch(msg: string) {
    console.log(`${this.formatHeader("MONARCH")} ${msg}`);
  }

  security(msg: string) {
    console.log(`${this.formatHeader("SECURITY")} ${ANSI.RED}${msg}${ANSI.RESET}`);
  }

  treasury(msg: string) {
    console.log(`${this.formatHeader("TREASURY")} ${msg}`);
  }

  system(msg: string) {
    console.log(`${this.formatHeader("SYSTEM")} ${msg}`);
  }

  intel(msg: string) {
    console.log(`${this.formatHeader("INTEL")} ${msg}`);
  }

  logistics(msg: string) {
    console.log(`${this.formatHeader("LOGISTICS")} ${msg}`);
  }

  audit(msg: string) {
    console.log(`${this.formatHeader("AUDIT")} ${msg}`);
  }

  info(msg: string) {
    this.system(msg);
  }

  warn(msg: string) {
    console.log(`${this.formatHeader("SYSTEM")} ${ANSI.GOLD}WARN: ${msg}${ANSI.RESET}`);
  }

  error(msg: string, err?: any) {
    console.error(`${this.formatHeader("SECURITY")} ${ANSI.RED}${ANSI.BOLD}ERROR: ${msg}${ANSI.RESET}`, err || "");
  }
}

export const logger = new ImperialLogger();

export function logSystemStart() {
  console.log(`
${ANSI.GOLD}${ANSI.BOLD}  🏛️  HOUSE OF QUI — Imperial Sovereign OS${ANSI.RESET}
${ANSI.GREY}  ——————————————————————————————————————————————————————————————${ANSI.RESET}
  `);
  logger.monarch("The Throne has been established.");
  logger.system("Imperial Core and Subsystems are normalizing...");
}