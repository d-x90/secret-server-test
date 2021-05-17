const crypto = require('crypto');
const { SIGN_KEY } = require('../config');

const SYMMETRIC_ENCRYPTION_ALGORYTHM = 'aes-256-cbc';
const ivString = crypto.randomBytes(8).toString('hex');

module.exports = {
  encryptSecret(plainTextSecret) {
    const cipher = crypto.createCipheriv(
      SYMMETRIC_ENCRYPTION_ALGORYTHM,
      SIGN_KEY,
      ivString
    );
    let encrypted = cipher.update(plainTextSecret, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  },
  decryptSecret(encryptedSecret) {
    const decipher = crypto.createDecipheriv(
      SYMMETRIC_ENCRYPTION_ALGORYTHM,
      SIGN_KEY,
      ivString
    );
    let decrypted = decipher.update(encryptedSecret, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  },
  createHash(secret) {
    return crypto.createHash('sha256').update(secret).digest('hex');
  },
};
