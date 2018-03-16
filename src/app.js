const Ractive = require('ractive');

Ractive.DEBUG = (process.env.NODE_ENV === 'development');
Ractive.DEBUG_PROMISES = Ractive.DEBUG;

Ractive.defaults.enhance = true;
Ractive.defaults.lazy = true;
Ractive.defaults.sanitize = true;

Ractive.use(require('ractive-ready')());
Ractive.use(require('ractive-page')({
    meta: require('../config/meta.json')
}));

const options = {
    el: '#app',
    template: require('./templates/parsed/app'),
    partials: {
        navbar: require('./templates/parsed/navbar')
    },
    transitions: {
        fade: require('ractive-transitions-fade')
    },
    data: {
        message: 'Hello world'
    }
};

module.exports = () => new Ractive(options);