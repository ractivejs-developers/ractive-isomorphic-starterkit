module.exports = () => (err, req, res, next) => {
	res.status(500);
	(req.accepts(['html', 'json']) === 'json') ?
		res.json({ errors: { [err.name]: [err.message] } }) : 
		res.render('error', { err });
};