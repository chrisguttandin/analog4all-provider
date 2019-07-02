import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDataChannel } from 'rxjs-broker';
import { TInstrument, TMidiConnection } from '../store';
import { InstrumentsService } from './instruments.service';
import { UserMediaService } from './user-media.service';

@Injectable({
    providedIn: 'root'
})
export class RegisteringService {

    constructor (
        private _instrumentsService: InstrumentsService,
        private _userMediaService: UserMediaService
    ) { }

    public register (
        midiConnection: TMidiConnection,
        name: string
    ): Promise<{ connection: Observable<IDataChannel>; instrument: TInstrument }> {
        // Get the mediaStream first to make sure the user granted access.
        return this._userMediaService
            .getAudioOnlyMediaStream(midiConnection.sourceId)
            .then(() => {
                return new Promise<TInstrument>((resolve) => {
                    const data: { description?: string; gearogsSlug?: string; name: string; soundCloudUsername?: string } = { name };

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
