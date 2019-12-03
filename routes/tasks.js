const express = require('express');

const router = express.Router();

const tasksController = require('../controllers/tasks');



// GET /tasks
router.get('/', tasksController.getTasks);

// GET /tasks/:id
router.get('/:id', tasksController.getTask);

// POST /tasks
router.post('/', tasksController.createTask);

// PATCH /tasks/:id
router.patch('/:id', tasksController.editTask);

// DELETE /tasks/:id
router.delete('/:id', tasksController.deleteTask);


module.exports = router;
