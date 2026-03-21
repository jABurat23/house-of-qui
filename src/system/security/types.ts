export interface SecurityMandate {
  id: string; // Mandate ID
  issuer: string; // IsaCore, ProjectName
  payload: any; // Data being signed
  signature: string; // RSA signature
  timestamp: string; // ISO timestamp
  level: 'standard' | 'high' | 'sovereign';
}
