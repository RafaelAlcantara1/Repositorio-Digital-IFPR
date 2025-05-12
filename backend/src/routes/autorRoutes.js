const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autorController');

// Rotas para autores
router.get('/', autorController.getAll);
router.get('/:id', autorController.getById);
router.post('/', autorController.create);
router.put('/:id', autorController.update);
router.delete('/:id', autorController.delete);

module.exports = router; 