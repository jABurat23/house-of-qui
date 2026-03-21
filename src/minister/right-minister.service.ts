import { Injectable } from '@nestjs/common';

@Injectable()
export class RightMinisterService {
  getSecurityStatus() {
    return {
      minister: "Right Minister",
      system: "House of Qui",
      authority: "RBAC",
      status: "Active"
    };
  }
}