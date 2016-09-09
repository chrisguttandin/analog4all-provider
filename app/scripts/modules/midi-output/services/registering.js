export class RegisteringService {

    constructor (instrumentsService, userMediaService) {
        this._instrumentsService = instrumentsService;
        this._userMediaService = userMediaService;
    }

    deregister (instrument) {
        return this._instrumentsService.delete(instrument.id);
    }

    register (name) {
        var context = {};

        // Get the mediaStream first to make sure the user granted access.
        return this._userMediaService
            .getAudioOnlyMediaStream()
            .then(() => this._instrumentsService.create({
                name
            }))
            .then((instrument) => {
                context.instrument = instrument;

                return this._instrumentsService.connect(instrument);
            })
            .then((connection) => {
                context.connection = connection;

                return context;
            })
            .catch((err) => {
                if (context.instrument) {
                    this._instrumentsService.delete(context.instrument.id);
                }

                throw err;
            });
    }

}
