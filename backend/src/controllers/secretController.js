const { Router } = require('express');
const Secret = require('../models/secret');
const crypto = require('crypto');

const router = Router();

router.get('/:hash', async (req, res, next) => {
  try {
    const secret = await Secret.findOne({ hash: req.params.hash }).exec();

    if (!secret) {
      res.status(404);
      throw new Error('Secret not found');
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

    console.log(secret);
    res.json(secret);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;

    const secret = new Secret({
      secretText: payload.secret,
      hash: crypto.createHash('sha256').update(payload.secret).digest('hex'),
      expiresAt: Date.now() + payload.expireAfter * 60 * 1000,
      remainingViews: payload.expireAfterViews,
    });

    const createdSecret = await secret.save();
    res.json(createdSecret);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400);
    }

    next(error);
  }
});

module.exports = router;
