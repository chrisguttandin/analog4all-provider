export class ProviderController {

    constructor (browserService) {
        this.isSupported = browserService.isSupported;
    }

}
