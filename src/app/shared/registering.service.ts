import { Injectable } from '@angular/core';
import { IDataChannel } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { IInstrument } from '../interfaces';
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

    public register (
        description: string | undefined,
        gearogsSlug: string | undefined,
        name: string,
        soundCloudUsername: string | undefined,
        sourceId: string
    ): Promise<{ connection: Observable<IDataChannel>, instrument: IInstrument }> {
        // Get the mediaStream first to make sure the user granted access.
        return this._userMediaService
            .getAudioOnlyMediaStream(sourceId)
            .then(() => new Promise<IInstrument>((resolve) => this._instrumentsService
                .create({ description, gearogsSlug, name, soundCloudUsername })
                .subscribe((instrument) => resolve(instrument))))
            .then((instrument) => {
                const connection = this._instrumentsService.connect(instrument);

                return { connection, instrument };
            });
    }

}
