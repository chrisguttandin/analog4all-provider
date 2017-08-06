import { Injectable } from '@angular/core';
import { IDataChannel } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { IInstrument } from '../interfaces';
import { InstrumentsService } from './instruments.service';
import { UserMediaService } from './user-media.service';

@Injectable()
export class RegisteringService {

    constructor (
        private _instrumentsService: InstrumentsService,
        private _userMediaService: UserMediaService
    ) { }

    public deregister (instrument: IInstrument) {
        return this._instrumentsService.delete(instrument);
    }

    public register (name: string, sourceId: string): Promise<{ connection: Observable<IDataChannel>, instrument: IInstrument }> {
        // Get the mediaStream first to make sure the user granted access.
        return this._userMediaService
            .getAudioOnlyMediaStream(sourceId)
            .then(() => new Promise((resolve) => this._instrumentsService
                .create({ name })
                .subscribe((instrument) => resolve(instrument))))
            .then((instrument: { id: any }) => {
                const connection = this._instrumentsService.connect(instrument);

                return { connection, instrument };
            });
    }

}
