const run = require('../src/app');

module.exports = () => (req, res, next) => {

	const app = run(),
		route = app.$page.show(req.url, null, true, false);

	app.ready((error, data) => {

		const meta = route.state.meta,
			content = app.toHTML(),
			styles = app.toCSS();

		app.teardown();
		
		data = JSON.stringify(data || {});
		error = error && error.message ? error.message : error;
		
		res.render('index', { meta, content, styles, data, error });
    });
};