// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Iniciar Sesión
router.post('/',
    // Agregar validaciones usando express-validator
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 })
    ],
    authController.autenticarUsuario
);

// Obtener usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

// Exportar rutas
module.exports = router;
