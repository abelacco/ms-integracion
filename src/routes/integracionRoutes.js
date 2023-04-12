const express = require('express');
const router = express.Router();
const documentoController = require('../Controllers/documentoControllers');

router.post('/crear',documentoController.crearIntegracion)


module.exports = router;
