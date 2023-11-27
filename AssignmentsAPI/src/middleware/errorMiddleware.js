module.exports = (err, req, res, next) => {
    if (err.message === 'Bad Request') {
        res.status(400).send();
    } else if (err.message === 'Invalid Token') {
        res.status(401).send();
    } else if (err.message === 'Invalid Credentials') {
        res.status(401).send();
    } else if (err.message === 'Forbidden') {
        res.status(403).send();
    } else if (err.message === 'Assignment not found' || err.message === 'Not Found') {
        res.status(404).send();
    } else if (err.message === 'Method Not Allowed') {
        res.status(405).send();
    } else {
        console.log(err);
        res.status(500).send();
    }
};
