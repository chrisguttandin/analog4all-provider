var fs = require('fs');

export const localRegistry = {
    controller: 'LocalRegistryController as vm',
    resolve: {
        devices: [ 'devicesService', (devicesService) => devicesService.fetch() ]
    },
    template: fs.readFileSync(__dirname + '/../views/local-registry.html', 'utf8')
};
