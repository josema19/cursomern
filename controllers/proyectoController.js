// Importar Modelos
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea un proyecto nuevo
exports.crearProyecto = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    };

    try {
        // Crear nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Agregar id del usuario
        proyecto.creador = req.usuario.id;

        // Guardar proyecto
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send({msg: 'Hubo un error'});
    };
};

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        // Obtener proyectos
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({creado: -1});
        res.status(200).json({proyectos});        
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Hubo un error' });
    };
};

// Actualiza el nombre del un proyecto
exports.actualizarProyecto = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    };

    // Extraer la información del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    };

    try {
        // Revisar el Id
        let proyecto = await Proyecto.findById(req.params.id);

        // Validar que exista el Proyecto
        if (!proyecto) {
            res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Validar creador del Proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({msg: 'No autorizado'});
        };

        // Actualizar información
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto},
            {new: true});

        // Devolver respuesta
        res.status(200).json({proyecto});

        
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Error en el servidor' });
    };
};

// Elimina un Proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
    try {
        // Revisar el Id
        let proyecto = await Proyecto.findById(req.params.id);

        // Validar que exista el Proyecto
        if (!proyecto) {
            res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Validar creador del Proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({msg: 'No autorizado'});
        };

        // Eliminar proyecto y devolver mensaje de éxito
        await Proyecto.findOneAndRemove({_id: req.params.id});
        res.status(200).json({msg:'Proyecto eliminado'});
    } catch (error) {
        res.status(500).json({msg: 'Hubo un error en el servidor'})
    };
};