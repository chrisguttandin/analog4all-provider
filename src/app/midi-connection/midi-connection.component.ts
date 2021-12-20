import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMidiFile } from 'midi-json-parser-worker';
import { create as createMidiPlayer } from 'midi-player';
import { Observable, concatMap, filter, first, map } from 'rxjs';
import { wrap } from 'rxjs-broker';
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
import { TAppState, TInstrument, TMidiConnection, createInstrumentByIdSelector, patchInstrument, updateMidiConnection } from '../store';

@Component({
    selector: 'anp-midi-connection',
    styleUrls: ['./midi-connection.component.css'],
    templateUrl: './midi-connection.component.html'
})
export class MidiConnectionComponent implements OnChanges {
    @Input() public midiConnection!: TMidiConnection;

    public audioInputs$!: Observable<MediaDeviceInfo[]>;

    public instrumentName$!: Observable<string>;

    public isRegistered: boolean;

    public virtualInstrumentName: string;

    private _middleCMidiJson: IMidiFile;

    private _scaleMidiJson: IMidiFile;

    constructor(
        private _downloadingService: DownloadingService,
        middleCMidiJsonService: MiddleCMidiJsonService,
        private _midiOutputsService: MidiOutputsService,
        private _registeringService: RegisteringService,
        private _renderingService: RenderingService,
        private _recordingService: RecordingService,
        private _samplesService: SamplesService,
        scaleMidiJsonService: ScaleMidiJsonService,
        private _store: Store<TAppState>
    ) {
        this.isRegistered = false;
        this._middleCMidiJson = middleCMidiJsonService.midiJson;
        this._scaleMidiJson = scaleMidiJsonService.midiJson;
        this.virtualInstrumentName = '';
    }

    public deregister(): void {
        this._store.dispatch(updateMidiConnection({ instrumentId: undefined, midiOutputId: this.midiConnection.midiOutputId }));
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.midiConnection !== undefined) {
            const midiConnection = this.midiConnection;

            this.isRegistered = midiConnection.instrumentId !== undefined;
            this.virtualInstrumentName = midiConnection.name === null ? midiConnection.midiOutputName : midiConnection.name;
        }
    }

    public register(): void {
        this._registeringService.register(this.midiConnection, this.virtualInstrumentName).then(({ connection, instrument }) => {
            this._store.dispatch(updateMidiConnection({ instrumentId: instrument.id, midiOutputId: this.midiConnection.midiOutputId }));

            connection
                .pipe(
                    concatMap((dataChannel) =>
                        this._renderingService.render(
                            wrap(dataChannel),
                            this._midiOutputsService.get(this.midiConnection.midiOutputId),
                            this.midiConnection.sourceId
                        )
                    )
                )
                // eslint-disable-next-line rxjs-angular/prefer-async-pipe
                .subscribe(() => {
                    // @todo
                });
        });
    }

    public sample(): void {
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
            .then(
                (blob) =>
                    new Promise<{ id: string }>((resolve) => {
                        // eslint-disable-next-line rxjs-angular/prefer-async-pipe
                        this._samplesService.create({ file: blob }).subscribe((sample) => resolve(sample));
                    })
            )
            .then(
                (sample) =>
                    new Promise<void>((resolve) => {
                        const instrumentId = this.midiConnection.instrumentId;

                        if (instrumentId === undefined) {
                            resolve();

                            return;
                        }

                        createInstrumentByIdSelector(this._store, instrumentId)
                            .pipe(
                                filter((instrument): instrument is TInstrument => instrument !== null),
                                first(),
                                map(() => {
                                    this._store.dispatch(patchInstrument({ id: instrumentId, sample: { id: sample.id } }));
                                })
                            )
                            // eslint-disable-next-line rxjs-angular/prefer-async-pipe
                            .subscribe(() => resolve());
                    })
            );
    }

    public test(): void {
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

    public updateDescription(event: Event): void {
        if (event.target === null) {
            return;
        }

        const description = (<HTMLInputElement>event.target).value.trim();

        this._store.dispatch(
            updateMidiConnection({
                description: description === '' ? undefined : description,
                midiOutputId: this.midiConnection.midiOutputId
            })
        );
    }

    public updateGearogsSlug(event: Event): void {
        if (event.target === null) {
            return;
        }

        const description = (<HTMLInputElement>event.target).value.trim();

        this._store.dispatch(
            updateMidiConnection({
                gearogsSlug: description === '' ? undefined : description,
                midiOutputId: this.midiConnection.midiOutputId
            })
        );
    }

    public updateInstrumentName(event: Event): void {
        if (event.target === null) {
            return;
        }

        const name = (<HTMLInputElement>event.target).value.trim();

        this._store.dispatch(
            updateMidiConnection({
                midiOutputId: this.midiConnection.midiOutputId,
                name: name === '' ? null : name
            })
        );
    }

    public updateSoundCloudUsername(event: Event): void {
        if (event.target === null) {
            return;
        }

        const soundCloudUsername = (<HTMLInputElement>event.target).value.trim();

        this._store.dispatch(
            updateMidiConnection({
                midiOutputId: this.midiConnection.midiOutputId,
                soundCloudUsername: soundCloudUsername === '' ? undefined : soundCloudUsername
            })
        );
    }

    public updateSourceId(event: Event): void {
        if (event.target === null) {
            return;
        }

        const sourceId = (<HTMLInputElement>event.target).value;

        this._store.dispatch(updateMidiConnection({ midiOutputId: this.midiConnection.midiOutputId, sourceId }));
    }
}
