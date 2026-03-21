import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImperialUser, ImperialRole } from './entities/user.entity';
import { SealChallengeService } from './challenge.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { logger } from '../../core/logger';

@Injectable()
export class AuthService {
  private readonly SECRET = process.env.IMPERIAL_SECRET || 'HOUSE_OF_QUI_ROOT_KEY_2026';

  constructor(
    @InjectRepository(ImperialUser)
    private userRepository: Repository<ImperialUser>,
    private challengeService: SealChallengeService
  ) { }

  async requestAudience(imperialName: string, houseKey: string) {
    logger.monarch(`An audience with the Throne has been requested by ${imperialName}.`);
    
    // Layer 1: Identity (Argon2 Hashed)
    const user = await this.userRepository.findOneBy({ imperialName });
    
    if (!user) {
      logger.security(`Identity REJECTED for ${imperialName}: Name not found in archives.`);
      throw new UnauthorizedException('The Throne Rejects Your Identity');
    }

    const isValidKey = await argon2.verify(user.houseKey, houseKey);
    if (!isValidKey) {
      logger.security(`Identity REJECTED for ${imperialName}: House Key mismatch detected.`);
      throw new UnauthorizedException('The Throne Rejects Your Identity');
    }

    // Layer 2 ritual: Generate Challenge
    const challenge = await this.challengeService.generateChallenge(user.id);
    logger.monarch(`Challenge ${challenge.token.substring(0, 8)} issued for ${imperialName}.`);
    
    return {
      ritualId: challenge.token,
      challengeText: challenge.phrase,
      message: 'Initial identity confirmed. Complete the ceremonial challenge to pass.'
    };
  }

  async completeRitual(ritualId: string, phrase: string, meta: { ip: string, userAgent: string }) {
    const challenge = this.challengeService.getChallenge(ritualId);
    if (!challenge) throw new UnauthorizedException('Ritual session not found.');

    // Challenge Verification
    const isValid = this.challengeService.verifyChallenge(ritualId, phrase);
    if (!isValid) {
      logger.security(`Ritual FAILED: Invalid seal phrase challenge ${ritualId}.`);
      throw new UnauthorizedException('The Ritual was Desecrated. Audience Denied.');
    }

    const user = await this.userRepository.findOneBy({ id: challenge.userId });
    if (!user) {
      throw new UnauthorizedException('The identity was erased from archives during the ritual.');
    }

    // Token Ritual (Layer 3: Signed Session)
    const token = jwt.sign({
      sub: user.id,
      name: user.imperialName,
      role: user.role,
      clearance: user.clearanceLevel,
      fingerprint: Buffer.from(`${meta.ip}:${meta.userAgent}`).toString('base64'),
      issuedBy: 'House of Qui'
    }, this.SECRET, { expiresIn: '1h' });

    logger.monarch(`Ritual COMPLETE for ${user.imperialName}. Access granted to the Inner Court.`);
    return {
        accessToken: token,
        role: user.role,
        imperialName: user.imperialName,
        grantedAt: new Date(),
        message: 'Audience Granted. Enter the Inner Court.'
    };
  }

  // Helper for seeding initial Monarch
  async grantThrone(name: string, key: string) {
    const hashedKey = await argon2.hash(key);
    const user = this.userRepository.create({
      imperialName: name,
      houseKey: hashedKey,
      role: ImperialRole.MONARCH,
      clearanceLevel: 10
    });
    return this.userRepository.save(user);
  }
}
