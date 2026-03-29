const ANSI = {
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
  DIM: "\x1b[2m",
  ITALIC: "\x1b[3m",
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

class ImperialLogger {
  private formatHeader(realm: string) {
    const color = realmColors[realm] || ANSI.GOLD;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    const paddedRealm = realm.padEnd(9, ' ');
    
    return `${ANSI.GREY}[${timestamp}]${ANSI.RESET} ${color}█${ANSI.RESET} ${color}${ANSI.BOLD}${paddedRealm}${ANSI.RESET} ${ANSI.DIM}::${ANSI.RESET}`;
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
    console.log(`${this.formatHeader("AUDIT")} ${ANSI.GREY}${msg}${ANSI.RESET}`);
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
  console.clear();
  console.log(`
${ANSI.GOLD}${ANSI.BOLD}   ██╗  ██╗ ██████╗ ██╗   ██╗███████╗███████╗ 
   ██║  ██║██╔═══██╗██║   ██║██╔════╝██╔════╝ 
   ███████║██║   ██║██║   ██║███████╗█████╗   
   ██╔══██║██║   ██║██║   ██║╚════██║██╔══╝   
   ██║  ██║╚██████╔╝╚██████╔╝███████║███████╗ 
   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝ 
                  ██████╗ ██╗   ██╗██╗        
                 ██╔═══██╗██║   ██║██║        
                 ██║   ██║██║   ██║██║        
                 ██║▄▄ ██║██║   ██║██║        
                 ╚██████╔╝╚██████╔╝██║        
                  ╚══▀▀═╝  ╚═════╝ ╚═╝        

         S O V E R E I G N   O S   V 2 . 0  ${ANSI.RESET}
${ANSI.GREY}────────────────────────────────────────────────────────${ANSI.RESET}
  `);
  
  const protocols = [
    "NEURAL_LINK", "QUANTUM_REGISTRY", "IMPERIAL_GATE", "SCRIBE_CHRONICLE"
  ];

  protocols.forEach(p => {
    console.log(`${ANSI.GREY}[ INITIALIZING ]${ANSI.RESET} ${ANSI.CYAN}${p.padEnd(20)}${ANSI.RESET} [ ${ANSI.GREEN}READY${ANSI.RESET} ]`);
  });

  console.log(`${ANSI.GREY}────────────────────────────────────────────────────────${ANSI.RESET}`);
  logger.monarch("System boot sequence completed. Imperial core online.");
  logger.system("Allocating core memory architectures...");
}