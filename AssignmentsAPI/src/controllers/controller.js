const { Assignment, UserAssignment } = require('../utilities/connection');
const { authenticateUserByToken } = require('../utilities/auth');

let controller = {};

controller.getAllAssignments = async () => {
    const assignments = await Assignment.findAll();
    return assignments;
};

controller.authenticateUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (user && await user.verifyCredentials(password)) {
        return { userId: user.id };
    }

    return null;
};

controller.createAssignment = async (assignmentData) => {
    try {
        const assignment = await Assignment.create({
            name: assignmentData.name,
            points: assignmentData.points,
            num_of_attempts: assignmentData.num_of_attempts,
            deadline: assignmentData.deadline,
        });

        const response = {
            id: assignment.id,
            name: assignment.name,
            points: assignment.points,
            num_of_attempts: assignment.num_of_attempts,
            deadline: assignment.deadline,
            assignment_created: assignment.createdAt,
            assignment_updated: assignment.updatedAt,
        };

        return response;
    } catch (error) {
        error.message = 'Bad Request';
        throw error;
    }
};

controller.getAssignmentById = async (assignmentId) => {
    const assignment = await Assignment.findByPk(assignmentId);
    return assignment;
};

controller.deleteAssignmentById = async (assignmentId, token) => {
    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
        return null;
    }

    await authenticateUserByToken(token, assignmentId);

    const userAssignment = await UserAssignment.findOne({ where: { assignmentId: assignmentId } });

    if (!userAssignment) {
        return null;
    }

    await userAssignment.destroy();

    await assignment.destroy();
};

controller.updateAssignment = async (assignmentId, assignmentData, token) => {
    try {

        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignment) {
            return null;
        }

        await authenticateUserByToken(token, assignmentId);

        assignment.name = assignmentData.name;
        assignment.points = assignmentData.points;
        assignment.num_of_attempts = assignmentData.num_of_attempts;
        assignment.deadline = assignmentData.deadline;

        await assignment.save();

        return assignment;
    } catch (error) {
        if (error.message === 'Forbidden') {
            throw error
        } else {
            error.message = 'Bad Request';
            throw error;
        }
    }
};

controller.storeAuthToken = async (userId, assignmentId, authToken) => {
    await UserAssignment.create({
        userId,
        assignmentId,
        authToken,
    });
};

module.exports = controller;
