export class BrowserService {

    constructor (instrumentsService, userMediaService) {
        this.isSupported = instrumentsService.isSupported && userMediaService.isSupported;
    }

}
