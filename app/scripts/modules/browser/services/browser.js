class Browser {

    constructor (instrumentsService, userMediaService) {
        this.isSupported = instrumentsService.isSupported && userMediaService.isSupported;
    }

}

module.exports = Browser;
