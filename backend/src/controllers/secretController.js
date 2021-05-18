const secretRepository = require('../repositories/secretRepository');
const cryptoService = require('../services/cryptoService');

const secretController = {};

secretController.getOneSecret = async (req, res, next) => {
  try {
    const secret = await secretRepository.getSecretByHash(req.params.hash);

    if (!secret) {
      res.status(404);
      throw new Error('Secret not found');
    }

    if (secret.expiresAt.getTime() < Date.now()) {
      await secretRepository.deleteById(secret._id);
      res.status(404);
      throw new Error('Secret already expired');
    }

    secret.remainingViews -= 1;
    if (secret.remainingViews === 0) {
      await secretRepository.deleteById(secret._id);
    } else {
      await secretRepository.updateRemainingViewsById({
        id: secret._id,
        remainingViews: secret.remainingViews,
      });
    }

    const secretDto = {
      hash: secret.hash,
      secretText: cryptoService.decryptSecret(secret.secretText),
      createdAt: secret.createdAt,
      expiresAt: secret.expiresAt,
      remainingViews: secret.remainingViews,
    };

    res.json(secretDto);
  } catch (error) {
    next(error);
  }
};

secretController.createSecret = async (req, res, next) => {
  try {
    const { secret, expireAfterViews, expireAfter } = req.body;

    const payload = {
      secret,
      expireAfterViews,
      expireAfter,
    };

    const secretPlainText = payload.secret;

    const createdSecret = await secretRepository.createSecret(payload);

    const secretDto = {
      hash: createdSecret.hash,
      secretText: secretPlainText,
      createdAt: createdSecret.createdAt,
      expiresAt: createdSecret.expiresAt,
      remainingViews: createdSecret.remainingViews,
    };

    res.json(secretDto);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400);
    } else if (error.name === 'MongoError') {
      res.status(409);
    }

    next(error);
  }
};

module.exports = secretController;
