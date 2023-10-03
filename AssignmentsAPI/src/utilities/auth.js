const { User, UserAssignment } = require('../utilities/connection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.SECRET_KEY;

const extractBasicAuthCredentials = (authorizationHeader) => {
    const credentials = Buffer.from(authorizationHeader.split(' ')[1], 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');
    return { email, password };
};

const authenticateUser = async (email, password) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Invalid Credentials');
        }
        return { userId: user.id };
    } catch (error) {
        throw error;
    }
};

const generateAuthToken = (userId) => {
    const data = `${userId}|${Date.now()}`;
    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(data);
    return `${data}|${hmac.digest('hex')}`;
};

const authenticateUserByToken = async (token, assignmentId) => {
    try {
        const { email, password } = extractBasicAuthCredentials(token);

        const user = await User.findOne({ where: { email } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Invalid Credentials');
        }

        const userAssignment = await UserAssignment.findOne({ where: { assignmentId: assignmentId } });

        if (!userAssignment) {
            throw new Error('Not Found');
        }

        const [userIdFromToken] = userAssignment.authToken.split('|');

        if (userIdFromToken !== user.id.toString()) {
            throw new Error('Forbidden');
        }

        return user.id;
    } catch (error) {
        throw error;
    }
};

const storeAuthToken = async (userId, assignmentId, authToken) => {
    try {
        await UserAssignment.create({
            userId,
            assignmentId,
            authToken,
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    extractBasicAuthCredentials,
    authenticateUser,
    generateAuthToken,
    authenticateUserByToken,
    storeAuthToken,
};
