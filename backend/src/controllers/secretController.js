const { Router } = require('express');
const Secret = require('../models/secret');
const {
  createHash,
  encryptSecret,
  decryptSecret,
} = require('../services/cryptoService');

const router = Router();

router.get('/:hash', async (req, res, next) => {
  try {
    const secret = await Secret.findOne({ hash: req.params.hash }).exec();

    if (!secret) {
      res.status(404);
      throw new Error('Secret not found');
    }

    if (secret.expiresAt.getTime() < Date.now()) {
      await Secret.deleteOne({ _id: secret._id });
      res.status(404);
      throw new Error('Secret already expired');
    }

    secret.remainingViews -= 1;
    if (secret.remainingViews === 0) {
      await Secret.deleteOne({ _id: secret._id });
    } else {
      await Secret.updateOne(
        { _id: secret._id },
        { remainingViews: secret.remainingViews }
      );
    }
    const secretDto = {
      hash: secret.hash,
      secretText: decryptSecret(secret.secretText),
      createdAt: secret.createdAt,
      expiresAt: secret.expiresAt,
      remainingViews: secret.remainingViews,
    };

    res.json(secretDto);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;

    const secretText = payload.secret;

    const secret = new Secret({
      secretText: encryptSecret(payload.secret),
      hash: createHash(payload.secret),
      expiresAt: Date.now() + payload.expireAfter * 60 * 1000,
      remainingViews: payload.expireAfterViews,
    });

    const createdSecret = await secret.save();

    const secretDto = {
      hash: createdSecret.hash,
      secretText: secretText,
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
});

module.exports = router;
