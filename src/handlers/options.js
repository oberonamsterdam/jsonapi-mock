export const options = (req, res, next, route) => {
    res.header('Allow', 'OPTIONS, GET, POST, DELETE, PATCH');
    res.status(200).send();
};