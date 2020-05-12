// Importar Modelos
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    };

    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            res.status(401).json({msg: 'Proyecto no encontrado'});
        };

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({msg: 'No autorizado'});
        };

        // Almacenar tarea y devolver respuesta
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.status(200).json({tarea});

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error'});        
    };  
};

// Obtiene todas las tareas asociadas a un id de proyecto
exports.obtenerTareas = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    };

    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            res.status(401).json({msg: 'Proyecto no encontrado'});
        };

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({msg: 'No autorizado'});
        };

        // Obtener tareas y enviarlas al cliente
        const tareas = await Tarea.find({proyecto});
        res.status(200).json({tareas});
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error'});        
    };
};

// Actualiza la información de una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        // Validar que la tarea exista
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            res.status(401).json({msg: 'Tarea no encontrada'});
        };

        // Revisar si el proyecto actual pertenece al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto);
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({msg: 'No autorizado'});
        };

        // Crear objeto de la nueva tarea
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        
        // Guardar Tarea y devolver respuesta
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, {$set: nuevaTarea}, {new: true});
        res.status(200).json({tarea});        
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error'});        
    };
};

// Elimina una tarea dado un id
exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        // Validar que la tarea exista
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            res.status(401).json({msg: 'Tarea no encontrada'});
        };

        // Revisar si el proyecto actual pertenece al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto);
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({msg: 'No autorizado'});
        };

        // Eliminar tarea y enviar respuesta
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.status(200).json({msg: 'Tarea Eliminada'});
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error'});        
    };
};