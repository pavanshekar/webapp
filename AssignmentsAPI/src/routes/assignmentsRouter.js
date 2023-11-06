const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const statsdClient = require('../utilities/statsClient');
const {
    extractBasicAuthCredentials,
    authenticateUser,
    generateAuthToken,
} = require('../utilities/auth');

router.get('/', async (req, res, next) => {
    statsdClient.increment('assignment.get_all.call_count');
    try {
        if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
            throw new Error('Bad Request');
        }
        const response = await controller.getAllAssignments();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    statsdClient.increment('assignment.create.call_count');

    const authorizationHeader = req.headers.authorization;

    try {
        const { email, password } = extractBasicAuthCredentials(authorizationHeader);

        const user = await authenticateUser(email, password);

        if (!user) {
            return res.status(401).end();
        }

        const expectedFields = ["name", "points", "num_of_attempts", "deadline"];
        const requestBodyKeys = Object.keys(req.body);

        const extraFields = requestBodyKeys.filter(field => !expectedFields.includes(field));

        if (extraFields.length > 0) {
            return res.status(400).end();
        }

        const assignmentData = {
            name: req.body.name,
            points: req.body.points,
            num_of_attempts: req.body.num_of_attempts,
            deadline: req.body.deadline,
        };

        const response = await controller.createAssignment(assignmentData);

        const authToken = generateAuthToken(user.userId);
        await controller.storeAuthToken(user.userId, response.id, authToken);

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    statsdClient.increment('assignment.get_by_id.call_count');

    const assignmentId = req.params.id;
    try {
        if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
            throw new Error('Bad Request');
        }

        const assignment = await controller.getAssignmentById(assignmentId);

        if (!assignment) {
            throw new Error('Assignment not found');
        }

        const response = {
            id: assignment.id,
            name: assignment.name,
            points: assignment.points,
            num_of_attempts: assignment.num_of_attempts,
            deadline: assignment.deadline,
            assignment_created: assignment.createdAt,
            assignment_updated: assignment.updatedAt,
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    statsdClient.increment('assignment.delete.call_count');

    const assignmentId = req.params.id;
    const token = req.headers.authorization;

    try {
        await controller.deleteAssignmentById(assignmentId, token);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    statsdClient.increment('assignment.update.call_count');

    const assignmentId = req.params.id;
    const assignmentData = req.body;
    const token = req.headers.authorization;

    try {
        const expectedFields = ["name", "points", "num_of_attempts", "deadline"];
        const requestBodyKeys = Object.keys(req.body);

        const extraFields = requestBodyKeys.filter(field => !expectedFields.includes(field));

        if (extraFields.length > 0) {
            return res.status(400).end();
        }

        const assignment = await controller.updateAssignment(assignmentId, assignmentData, token);

        if (!assignment) {
            throw new Error('Assignment not found');
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', (req, res) => {
    statsdClient.increment('assignment.patch.call_count');

    throw new Error('Method Not Allowed');
});

module.exports = router;
