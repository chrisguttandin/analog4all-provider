class Browser {

    constructor (isSupported, userMediaService) {
        this.isSupported = isSupported && userMediaService.isSupported;
    }

}

module.exports = Browser;
