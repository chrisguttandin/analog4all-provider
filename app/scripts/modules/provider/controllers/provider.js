class ProviderController {

    constructor (browserService) {
        this.isSupported = browserService.isSupported;
    }

}

module.exports = ProviderController;
