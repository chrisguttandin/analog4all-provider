var fs = require('fs');

module.exports = {
    controller: 'SlotController as vm',
    resolve: {
        device: [ 'devicesService', '$route', (devicesService, $route) => devicesService
            .get($route.current.params.deviceId) ]
    },
    template: fs.readFileSync(__dirname + '/../views/slot.html', 'utf8')
};
