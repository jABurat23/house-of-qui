export interface Project {
  id: string
  name: string
  version: string
  status: string
  publicKey?: string
  signature?: string
  health?: { status: string; score: number }
} 