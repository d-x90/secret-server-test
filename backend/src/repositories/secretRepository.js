const Secret = require('../models/secret');
const { createHash, encryptSecret } = require('../services/cryptoService');

module.exports = {
  async createSecret(secret) {
    const newSecret = new Secret({
      secretText: encryptSecret(secret.secret),
      hash: createHash(secret.secret),
      expiresAt:
        secret.expireAfter !== 0
          ? Date.now() + secret.expireAfter * 60 * 1000
          : null,
      remainingViews: secret.expireAfterViews,
    });

    const createdSecret = await newSecret.save();

    return createdSecret;
  },
  async getSecretByHash(hash) {
    const secret = await Secret.findOne({ hash }).exec();

    return secret;
  },
  async deleteById(id) {
    return await Secret.deleteOne({ _id: id });
  },
  async updateRemainingViewsById({ id, remainingViews }) {
    return await Secret.updateOne(
      { _id: id },
      { remainingViews: remainingViews }
    );
  },
};
