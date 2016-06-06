class LocalRegistryController {

    constructor (devices, devicesService, $scope) {
        this.devices = devices;
        this._devicesService = devicesService;
        this._$scope = $scope;
    }

    refresh () {
        this._devicesService
            .fetch()
            .then((devices) => {
                this.devices = devices;

                this._$scope.$evalAsync();
            });
    }

}

module.exports = LocalRegistryController;
