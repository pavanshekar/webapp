const { extractBasicAuthCredentials, authenticateUser } = require('../utilities/auth');

const tokenMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).end();
    }

    try {
        const { email, password } = await extractBasicAuthCredentials(token);
        const userId = await authenticateUser(email, password);

        if (!userId) {
            return res.status(401).end();
        }

        next();
    } catch (error) {
        if (error.message === 'Invalid Credentials') {
            return res.status(401).end();
        }

        console.error(error);

        return res.status(500).end();
    }
}

module.exports = tokenMiddleware;
