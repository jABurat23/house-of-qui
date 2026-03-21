import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SealChallengeService {
  private readonly phrases = [
    "jade dragon rises",
    "crimson sun sets",
    "silver blade falls",
    "golden throne waits",
    "shadow raven whispers",
    "imperial seal glows",
    "mandate is sealed",
    "dynasty stands firm"
  ];

  // Temporary in-memory storage for pending challenges
  private challenges = new Map<string, { phrase: string, userId: string, expires: number }>();

  generateChallenge(userId: string) {
    const phrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    const token = crypto.randomBytes(16).toString('hex');
    
    // Valid for 5 minutes
    this.challenges.set(token, {
      phrase,
      userId,
      expires: Date.now() + (5 * 60 * 1000)
    });

    return { phrase, token };
  }

  getChallenge(token: string) {
    return this.challenges.get(token);
  }

  verifyChallenge(token: string, phrase: string): boolean {
    const challenge = this.challenges.get(token);
    if (!challenge) return false;

    if (Date.now() > challenge.expires) {
      this.challenges.delete(token);
      return false;
    }

    const isValid = challenge.phrase.toLowerCase() === phrase.toLowerCase();
    if (isValid) {
      this.challenges.delete(token); // One-time use
    }
    return isValid;
  }
}
