import { randomUUID } from 'crypto'
export function generateTrialId(): string {
  return randomUUID()
}