import { Injectable } from '@angular/core';
import { IDataChannel } from 'rxjs-broker';
import { Observable } from 'rxjs/Observable';
import { IInstrument, IMidiConnection } from '../interfaces';
import { InstrumentsService } from './instruments.service';
import { UserMediaService } from './user-media.service';

@Injectable()
export class RegisteringService {

    constructor (
        private _instrumentsService: InstrumentsService,
        private _userMediaService: UserMediaService
    ) { }

    public register (
        midiConnection: IMidiConnection,
        name: string
    ): Promise<{ connection: Observable<IDataChannel>, instrument: IInstrument }> {
        // Get the mediaStream first to make sure the user granted access.
        return this._userMediaService
            .getAudioOnlyMediaStream(midiConnection.sourceId)
            .then(() => {
                return new Promise<IInstrument>((resolve) => {
                    const data: { description?: string; name: string; gearogsSlug?: string; soundCloudUsername?: string; }  = { name };

                    if (midiConnection.description !== undefined) {
                        const description = midiConnection.description.trim();

                        if (description !== '') {
                            data.description = description;
                        }
                    }

                    if (midiConnection.gearogsSlug !== undefined) {
                        const gearogsSlug = midiConnection.gearogsSlug.trim();

                        if (gearogsSlug !== '') {
                            data.gearogsSlug = gearogsSlug;
                        }
                    }

                    if (midiConnection.soundCloudUsername !== undefined) {
                        const soundCloudUsername = midiConnection.soundCloudUsername.trim();

                        if (soundCloudUsername !== '') {
                            data.soundCloudUsername = soundCloudUsername;
                        }
                    }

                    this._instrumentsService
                        .create(data)
                        .subscribe((instrument) => resolve(instrument));
                });
            })
            .then((instrument) => {
                const connection = this._instrumentsService.connect(instrument);

                return { connection, instrument };
            });
    }

}
