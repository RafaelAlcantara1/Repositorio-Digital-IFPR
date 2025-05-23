const express = require('express');
const router = express.Router();
const artigoController = require('../controllers/artigoController');

// Rotas para artigos
router.get('/', artigoController.getAll);
router.get('/:id', artigoController.getById);
router.post('/', artigoController.create);
router.put('/:id', artigoController.update);
router.delete('/:id', artigoController.delete);

module.exports = router; 