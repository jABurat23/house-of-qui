import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SealService } from './sealService';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class IsaService implements OnModuleInit {
  private readonly rootSealDir = path.join(process.cwd(), '.qui', 'seal', 'root');
  private privateKey: string = '';
  private publicKey: string = '';

  constructor(private auditService: AuditService) {}

  async onModuleInit() {
    this.ensureRootSeal();
  }

  private ensureRootSeal() {
    if (!fs.existsSync(this.rootSealDir)) {
      fs.mkdirSync(this.rootSealDir, { recursive: true });
    }

    const privPath = path.join(this.rootSealDir, 'private.pem');
    const pubPath = path.join(this.rootSealDir, 'public.pem');

    if (fs.existsSync(privPath) && fs.existsSync(pubPath)) {
      this.privateKey = fs.readFileSync(privPath, 'utf8');
      this.publicKey = fs.readFileSync(pubPath, 'utf8');
      console.log('🏛️  Imperial Root Seal loaded.');
    } else {
      console.log('⚒️  Forging the Imperial Root Seal...');
      const { publicKey, privateKey } = SealService.generateKeyPair();
      
      fs.writeFileSync(privPath, privateKey);
      fs.writeFileSync(pubPath, publicKey);
      
      this.privateKey = privateKey;
      this.publicKey = publicKey;

      this.auditService.recordAction({
        action: 'ROOT_SEAL_FORGED',
        actor: 'ISA_CORE',
        targetId: 'GLOBAL',
        level: 'critical',
        metadata: { timestamp: new Date() }
      });

      console.log('✅ Imperial Root Seal forged.');
    }
  }

  signMandate(payload: any): string {
    const canonical = SealService.canonicalize(payload);
    return SealService.sign(canonical, this.privateKey);
  }

  verifyMandate(payload: any, signature: string): boolean {
    const canonical = SealService.canonicalize(payload);
    return SealService.verify(canonical, signature, this.publicKey);
  }

  getPublicSeal(): string {
    return this.publicKey;
  }
}
