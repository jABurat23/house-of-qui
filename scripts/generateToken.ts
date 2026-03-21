import { generateServiceToken } from "../src/security/tokenService";

const token = generateServiceToken("nexus-a06");

console.log("Service Token:");
console.log(token);