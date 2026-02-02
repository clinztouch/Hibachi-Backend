import crypto from 'crypto';

export function generateVerificationToken(userId) {
  return crypto.randomBytes(32).toString('hex');
}