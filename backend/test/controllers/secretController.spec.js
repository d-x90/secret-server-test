const sinon = require('sinon');
const secretController = require('../../src/controllers/secretController');
const secretRepository = require('../../src/repositories/secretRepository');
const cryptoService = require('../../src/services/cryptoService');

describe('Create secret', () => {
  let res;
  const req = {
    body: {
      secret: '[This text will be saved as a secret]',
      expireAfterViews: 10,
      expireAfter: 10,
    },
  };
  let next;

  beforeEach(function () {
    res = {
      json: sinon.spy(),
      status: sinon.stub(),
    };
    next = sinon.spy();
    secretRepository.createSecret.restore &&
      secretRepository.createSecret.restore();
  });
  it('should return created secret', async () => {
    const expectedSecretObject = {
      hash: 'randomhash',
      secretText: '[This text will be saved as a secret]',
      remainingViews: 10,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    sinon
      .stub(secretRepository, 'createSecret')
      .returns(Promise.resolve(expectedSecretObject));

    await secretController.createSecret(req, res, next);

    sinon.assert.calledWith(res.json, sinon.match(expectedSecretObject));
  });

  it('should return status 400 on invalid request payload', async () => {
    sinon
      .stub(secretRepository, 'createSecret')
      .throws({ name: 'ValidationError' });

    await secretController.createSecret(req, res, next);

    sinon.assert.calledWith(res.status, sinon.match(400));
  });

  it('should return status 409 on duplaicate secret', async () => {
    sinon.stub(secretRepository, 'createSecret').throws({ name: 'MongoError' });

    await secretController.createSecret(req, res, next);

    sinon.assert.calledWith(res.status, sinon.match(409));
  });
});

describe('Get secret', () => {
  let res;
  const req = {
    params: { hash: 'randomhash' },
  };
  let next;

  beforeEach(function () {
    res = {
      json: sinon.spy(),
      status: sinon.stub(),
    };
    next = sinon.spy();
    secretRepository.getSecretByHash.restore &&
      secretRepository.getSecretByHash.restore();
    secretRepository.deleteById.restore &&
      secretRepository.deleteById.restore();
    secretRepository.updateRemainingViewsById.restore &&
      secretRepository.updateRemainingViewsById.restore();
  });

  it('should return existing secret', async () => {
    const expectedSecretObject = {
      hash: req.params.hash,
      secretText: '[This text will be saved as a secret]',
      remainingViews: 10,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    sinon
      .stub(secretRepository, 'getSecretByHash')
      .returns(Promise.resolve(expectedSecretObject));
    sinon
      .stub(secretRepository, 'updateRemainingViewsById')
      .returns(Promise.resolve());
    sinon
      .stub(cryptoService, 'decryptSecret')
      .returns(expectedSecretObject.secretText);

    await secretController.getOneSecret(req, res, next);

    sinon.assert.calledWith(
      res.json,
      sinon.match({
        ...expectedSecretObject,
        remainingViews: 9,
      })
    );
    sinon.assert.calledOnce(secretRepository.updateRemainingViewsById);
  });

  it('should return status 404 on unmatched hash', async () => {
    sinon
      .stub(secretRepository, 'getSecretByHash')
      .returns(Promise.resolve(null));
    sinon
      .stub(secretRepository, 'updateRemainingViewsById')
      .returns(Promise.resolve());

    await secretController.getOneSecret(req, res, next);

    sinon.assert.calledWith(res.status, sinon.match(404));
  });

  it('should return status 404 on expired request', async () => {
    const expectedSecretObject = {
      hash: req.params.hash,
      secretText: '[This text will be saved as a secret]',
      remainingViews: 10,
      createdAt: new Date(Date.now() - 20 * 60 * 1000),
      expiresAt: new Date(Date.now() - 10 * 60 * 1000),
    };

    sinon
      .stub(secretRepository, 'getSecretByHash')
      .returns(Promise.resolve(expectedSecretObject));
    sinon.stub(secretRepository, 'deleteById').returns(Promise.resolve());
    sinon
      .stub(secretRepository, 'updateRemainingViewsById')
      .returns(Promise.resolve());

    await secretController.getOneSecret(req, res, next);

    sinon.assert.calledWith(res.status, sinon.match(404));
    sinon.assert.calledOnce(secretRepository.deleteById);
  });
});
