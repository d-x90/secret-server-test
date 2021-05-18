const { Router } = require('express');
const secretController = require('../controllers/secretController');

const secretRoutes = Router();

secretRoutes.get('/:hash', secretController.getOneSecret);
secretRoutes.post('/', secretController.createSecret);

module.exports = secretRoutes;
