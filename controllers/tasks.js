const shortid = require('shortid');
const {validate} = require('jsonschema');
const db = require('../db/db');

const getTasks = (req, res, next) => {
    let tasks = [];
    try {
        tasks = db.get('tasks');
    } catch (error) {
        throw new Error(error);
    }
    res.json({status: 'OK', data: tasks});
};

const getTask = (req, res, next) => {
    const {id} = req.params;

    const task = db
        .get('tasks')
        .find({id})
        .value();

    if (!task) {
        throw new Error('TASK_NOT_FOUND');
    }

    res.json({status: 'OK', data: task});
};

const createTask = (req, res, next) => {
    const taskSchema = {
        type: 'object',
        properties: {
            title: {type: 'string'},
            description: {type: 'string'}
        },
        required: ['title', 'description'],
        additionalProperties: false
    };

    const validationResult = validate(req.body, taskSchema);
    if (!validationResult.valid) {
        throw new Error('INVALID_JSON_OR_API_FORMAT');
    }

    const {title, description} = req.body;
    const task = {
        id: shortid.generate(),
        title,
        description,
        completed: false
    };

    try {
        db.get('tasks')
            .push(task)
            .write();
    } catch (error) {
        throw new Error(error);
    }

    res.json({
        status: 'OK',
        data: task
    });
};

const editTask = (req, res, next) => {
    const {id} = req.params;

    const editedTask = db
        .get('tasks')
        .find({id})
        .assign(req.body)
        .value();

    db.write();

    res.json({status: 'OK', data: editedTask});
};

const deleteTask = (req, res, next) => {
    db.get('tasks')
        .remove({id: req.params.id})
        .write();

    res.json({status: 'OK'});
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    editTask,
    deleteTask
};
