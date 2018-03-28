module.exports = () => (err, req, res, next) => {
	res.status(500);
	(req.accepts(['html', 'json']) === 'json') ?
		res.json(err) : 
		res.render('error', { err });
};