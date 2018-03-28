const Ractive = require('ractive');

Ractive.DEBUG = (process.env.NODE_ENV === 'development');
Ractive.DEBUG_PROMISES = Ractive.DEBUG;

Ractive.use(require('ractive-ready')());
Ractive.use(require('ractive-page')({
    meta: require('../config/meta.json')
}));

Ractive.defaults.enhance = true;
Ractive.defaults.lazy = true;
Ractive.defaults.sanitize = true;
Ractive.defaults.template = function() {
    const name = this.component && this.component.name;
    try { return require(`./templates/parsed/${name}`) }
    catch(e) { return 'Template unspecified' }
};
Ractive.defaults.snapshot = function(key = '') {
    return `@global.__DATA__${this.keychain()}.${key}`;
};

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