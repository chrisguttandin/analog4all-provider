var angular = require('angular'),
    browser = require('../browser/module.js'),
    localRegistry = require('../local-registry/module.js'),
    provider = require('./components/provider.js'),
    ProviderController = require('./controllers/provider.js'),
    slot = require('../slot/module.js');

module.exports = angular
    .module('provider', [
        browser.name,
        localRegistry.name,
        slot.name
    ])

    .component('provider', provider)

    .controller('ProviderController', [ 'browserService', ProviderController ]);
