import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMidiFile } from 'midi-json-parser-worker';
import { create as createMidiPlayer } from 'midi-player';
import { Observable } from 'rxjs';
import { IDataChannel, wrap } from 'rxjs-broker';
import { concatMap, filter, first, map } from 'rxjs/operators';
import { IInstrument, IMidiConnection } from '../interfaces';
import {
    DownloadingService,
    MiddleCMidiJsonService,
    MidiOutputsService,
    RecordingService,
    RegisteringService,
    RenderingService,
    SamplesService,
    ScaleMidiJsonService
} from '../shared';
import { patchInstrument, updateMidiConnection } from '../store/actions';
import { IAppState } from '../store/interfaces';
import { createInstrumentByIdSelector } from '../store/selectors';

@Component({
    selector: 'anp-midi-connection',
    styleUrls: [ './midi-connection.component.css' ],
    templateUrl: './midi-connection.component.html'
})
export class MidiConnectionComponent implements OnChanges {

    public audioInputs$!: Observable<MediaDeviceInfo[]>;

    public instrumentName$!: Observable<string>;

    public isRegistered: boolean;

    @Input() public readonly midiConnection!: IMidiConnection;

    public virtualInstrumentName: string;

    private _middleCMidiJson: IMidiFile;

    private _scaleMidiJson: IMidiFile;

    constructor (
        private _downloadingService: DownloadingService,
        middleCMidiJsonService: MiddleCMidiJsonService,
        private _midiOutputsService: MidiOutputsService,
        private _registeringService: RegisteringService,
        private _renderingService: RenderingService,
        private _recordingService: RecordingService,
        private _samplesService: SamplesService,
        scaleMidiJsonService: ScaleMidiJsonService,
        private _store: Store<IAppState>
    ) {
        this.isRegistered = false;
        this._middleCMidiJson = middleCMidiJsonService.midiJson;
        this._scaleMidiJson = scaleMidiJsonService.midiJson;
        this.virtualInstrumentName = '';
    }

    public deregister (): void {
        this._store.dispatch(updateMidiConnection({ instrumentId: undefined, midiOutputId: this.midiConnection.midiOutputId }));
    }

    public ngOnChanges (changes: SimpleChanges): void {
        if (changes.midiConnection !== undefined) {
            const midiConnection = this.midiConnection;

            this.isRegistered = (midiConnection.instrumentId !== undefined);
            this.virtualInstrumentName = (midiConnection.name === null) ? midiConnection.midiOutputName : midiConnection.name;
        }
    }

    public register (): void {
        this._registeringService
            .register(this.midiConnection, this.virtualInstrumentName)
            .then(({ connection, instrument }) => {
                this._store.dispatch(updateMidiConnection({ instrumentId: instrument.id, midiOutputId: this.midiConnection.midiOutputId }));

                connection
                    .pipe(
                        concatMap<IDataChannel, any>
                            ((dataChannel) => this._renderingService.render(
                                wrap(dataChannel),
                                this._midiOutputsService.get(this.midiConnection.midiOutputId),
                                this.midiConnection.sourceId
                            ))
                    )
                    .subscribe(() => { // tslint:disable-line:no-empty rxjs-prefer-async-pipe
                        // @todo
                    });
            });
    }

    public sample (): void {
        this._recordingService
            .start(this.midiConnection.sourceId)
            .then(() => {
                const midiPlayer = createMidiPlayer({
                    json: this._middleCMidiJson,
                    midiOutput: this._midiOutputsService.get(this.midiConnection.midiOutputId)
                });

                return midiPlayer.play();
            })
            .then(() => this._recordingService.stop())
            .then((blob) => new Promise<{ id: string }>((resolve) => this._samplesService
                .create({ file: blob })
                .subscribe((sample) => resolve(sample)))) // tslint:disable-line:rxjs-prefer-async-pipe
            .then((sample) => new Promise((resolve) => {
                const instrumentId = this.midiConnection.instrumentId;

                if (instrumentId === undefined) {
                    resolve();

                    return;
                }

                return createInstrumentByIdSelector(this._store, instrumentId)
                    .pipe(
                        filter<null | IInstrument, IInstrument>((instrument): instrument is IInstrument => instrument !== null),
                        first(),
                        map(() => {
                            this._store.dispatch(patchInstrument({ id: instrumentId, sample: { id: sample.id } }));
                        })
                    )
                    .subscribe(() => resolve()); // tslint:disable-line:rxjs-prefer-async-pipe
            }));
    }

    public test (): void {
        this._recordingService
            .start(this.midiConnection.sourceId)
            .then(() => {
                const midiPlayer = createMidiPlayer({
                    json: this._scaleMidiJson,
                    midiOutput: this._midiOutputsService.get(this.midiConnection.midiOutputId)
                });

                return midiPlayer.play();
            })
            .then(() => this._recordingService.stop())
            .then((blob) => this._downloadingService.download('sample.wav', blob));
    }

    public updateDescription (description: string): void {
        const sanitizedDescription = description.trim();

        this._store.dispatch(updateMidiConnection({
            description: (sanitizedDescription === '') ? undefined : sanitizedDescription,
            midiOutputId: this.midiConnection.midiOutputId
        }));
    }

    public updateGearogsSlug (gearogsSlug: string): void {
        const sanitizedGearogsSlug = gearogsSlug.trim();

        this._store.dispatch(updateMidiConnection({
            gearogsSlug: (sanitizedGearogsSlug === '') ? undefined : sanitizedGearogsSlug,
            midiOutputId: this.midiConnection.midiOutputId
        }));
    }

    public updateInstrumentName (name: string): void {
        const sanitizedName = name.trim();

        this._store.dispatch(updateMidiConnection({
            midiOutputId: this.midiConnection.midiOutputId,
            name: (sanitizedName === '') ? null : sanitizedName
        }));
    }

    public updateSoundCloudUsername (soundCloudUsername: string): void {
        const sanitizedSoundCloudUsername = soundCloudUsername.trim();

        this._store.dispatch(updateMidiConnection({
            midiOutputId: this.midiConnection.midiOutputId,
            soundCloudUsername: (sanitizedSoundCloudUsername === '') ? undefined : sanitizedSoundCloudUsername
        }));
    }

    public updateSourceId (sourceId: string): void {
        this._store.dispatch(updateMidiConnection({ midiOutputId: this.midiConnection.midiOutputId, sourceId }));
    }

}
