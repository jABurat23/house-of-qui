// Sovereign project type — mirrors the backend Project entity
export interface Project {
  id: string;
  name: string;
  version?: string;
  description?: string;
  status?: string;
  isShadow: boolean;
  requiredRole?: string;
  publicKey?: string;
  signature?: string;
  repository?: string;
  createdAt?: string;
}

// Audit log entry type — mirrors the backend AuditLog entity
export interface AuditLog {
  id: string;
  action: string;
  actor?: string;
  targetId?: string;
  metadata?: Record<string, any>;
  level: "info" | "warning" | "error" | "critical";
  ipAddress?: string;
  timestamp: string;
}

// Imperial session after login
export interface ImperialSession {
  token: string;
  imperialName: string;
  role: string;
  clearanceLevel?: number;
}
