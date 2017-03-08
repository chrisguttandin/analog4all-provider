import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InstrumentsService } from './instruments.service';
import { UserMediaService } from './user-media.service';

@Injectable()
export class RegisteringService {

    constructor (
        private _instrumentsService: InstrumentsService,
        private _userMediaService: UserMediaService
    ) { }

    public deregister (instrument) {
        return this._instrumentsService.delete(instrument);
    }

    public register (name, sourceId) {
        // Get the mediaStream first to make sure the user granted access.
        return this._userMediaService
            .getAudioOnlyMediaStream(sourceId)
            .then(() => new Promise((resolve, reject) => this._instrumentsService
                .create({ name })
                .subscribe((instrument) => resolve(instrument))))
            .then((instrument: { id: any }) => {
                const connection = this._instrumentsService.connect(instrument);

                return { connection, instrument };
            });
    }

}
