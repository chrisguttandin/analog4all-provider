var fs = require('fs');

module.exports = {
    controller: 'LocalRegistryController as vm',
    resolve: {
        devices: [ 'devicesService', (devicesService) => devicesService.fetch() ]
    },
    template: fs.readFileSync(__dirname + '/../views/local-registry.html', 'utf8')
};
