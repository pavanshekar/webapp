const { User, Assignment, UserAssignment, Submission } = require('../utilities/connection');
const { extractBasicAuthCredentials, authenticateUserByToken } = require('../utilities/auth');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');

dotenv.config();

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
    try {
        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        return assignment;
    }
    catch (error) {
        throw error;
    }
};

controller.deleteAssignmentById = async (assignmentId, token) => {
    try {
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignment) {
            throw new Error('Assignment not found');
        }

        await authenticateUserByToken(token, assignmentId);

        const userAssignment = await UserAssignment.findOne({ where: { assignmentId: assignmentId } });

        if (!userAssignment) {
            throw new Error('Assignment not found');
        }

        await userAssignment.destroy();

        await assignment.destroy();
    }
    catch (error) {
        throw error;
    }
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

controller.handleSubmission = async (assignmentId, token, submission_url) => {
    try {
        const userId = await authenticateUserByToken(token, assignmentId);

        if (!userId) {
            throw new Error('Invalid Credentials');
        }

        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
            throw new Error('Assignment not found');
        }

        const now = new Date();
        const deadline = new Date(assignment.deadline);
        if (now > deadline) {
            throw new Error('Bad Request');
        }

        const userAssignment = await UserAssignment.findOne({
            where: {
                userId: userId, 
                assignmentId: assignmentId
            }
        });

        if (!userAssignment) {
            throw new Error('Assignment not found');
        }

        if (userAssignment.submissionCount >= assignment.num_of_attempts) {
            throw new Error('Bad Request');
        }

        userAssignment.submissionCount += 1;
        await userAssignment.save();

        const submission = await Submission.create({
            assignment_id: assignmentId,
            submission_url: submission_url
        });

        const user = await User.findByPk(userId);

        AWS.config.update({ region: process.env.AWS_REGION });

        const sns = new AWS.SNS();
        const message = {
            submissionUrl: submission.submission_url,
            userEmail: user.email
        };

        const params = {
            Message: JSON.stringify(message),
            TopicArn: process.env.SNS_TOPIC_ARN
        };

        await sns.publish(params).promise();

        return {
            id: submission.id,
            assignment_id: assignmentId,
            submission_url: submission.submission_url,
            submission_date: submission.submission_date.toISOString(),
            submission_updated: submission.submission_updated.toISOString()
        };
    } catch (error) {
        throw error;
    }
};


module.exports = controller;
