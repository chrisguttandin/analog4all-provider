import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IMidiFile } from 'midi-json-parser-worker';
import { midiPlayerFactory } from 'midi-player';
import { IDataChannel, wrap } from 'rxjs-broker';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { concatMap, filter, first, map, switchMap } from 'rxjs/operators';
import { IInstrument, IMidiConnection } from '../interfaces';
import {
    DownloadingService,
    MiddleCMidiJsonService,
    RecordingService,
    RegisteringService,
    RenderingService,
    SamplesService,
    ScaleMidiJsonService
} from '../shared';
import { addMidiConnection, patchInstrument, updateMidiConnection } from '../store/actions';
import { IAppState } from '../store/interfaces';
import { createInstrumentByIdSelector, createMidiConnectionByMidiOutputIdSelector } from '../store/selectors';

@Component({
    selector: 'anp-midi-connection',
    styleUrls: [ './midi-connection.component.css' ],
    templateUrl: './midi-connection.component.html'
})
export class MidiConnectionComponent implements OnInit {

    public audioInputs$: Observable<MediaDeviceInfo[]>;

    public description$: Observable<string>;

    public gearogsSlug$: Observable<string>;

    public instrument$: Observable<null | IInstrument>;

    public instrumentName$: Observable<string>;

    public isRegistered$: Observable<boolean>;

    public midiConnection$: Observable<null | IMidiConnection>;

    public soundCloudUsername$: Observable<string>;

    @Input() public midiOutput: WebMidi.MIDIOutput;

    public sourceId$: Observable<string>;

    public virtualInstrumentName$: Observable<string>;

    private _descriptionChanges$: BehaviorSubject<string>;

    private _gearogsSlugChanges$: BehaviorSubject<string>;

    private _instrumentNameChanges$: BehaviorSubject<string>;

    private _middleCMidiJson: IMidiFile;

    private _scaleMidiJson: IMidiFile;

    private _soundCloudUsernameChanges$: BehaviorSubject<string>;

    constructor (
        private _downloadingService: DownloadingService,
        middleCMidiJsonService: MiddleCMidiJsonService,
        private _registeringService: RegisteringService,
        private _renderingService: RenderingService,
        private _recordingService: RecordingService,
        private _samplesService: SamplesService,
        scaleMidiJsonService: ScaleMidiJsonService,
        private _store: Store<IAppState>
    ) {
        this._descriptionChanges$ = new BehaviorSubject('');
        this._gearogsSlugChanges$ = new BehaviorSubject('');
        this._instrumentNameChanges$ = new BehaviorSubject('');
        this._middleCMidiJson = middleCMidiJsonService.midiJson;
        this._scaleMidiJson = scaleMidiJsonService.midiJson;
        this._soundCloudUsernameChanges$ = new BehaviorSubject('');
    }

    public deregister () {
        this.instrument$
            .pipe(
                first(),
                filter<null | IInstrument, IInstrument>((instrument): instrument is IInstrument => (instrument !== null)),
                switchMap((instrument) => this._registeringService.deregister(instrument)),
                switchMap(() => this.midiConnection$),
                first(),
                filter<null | IMidiConnection, IMidiConnection>((midiConnection): midiConnection is IMidiConnection => {
                    return (midiConnection !== null);
                })
            )
            .subscribe(({ midiOutputId }) => { // tslint:disable-line:no-empty
                this._store.dispatch(updateMidiConnection({ instrumentId: undefined, midiOutputId }));
            });
    }

    public ngOnInit () {
        this.description$ = this._descriptionChanges$.asObservable();

        this.gearogsSlug$ = this._gearogsSlugChanges$.asObservable();

        this.midiConnection$ = this._store
            .pipe(
                select(createMidiConnectionByMidiOutputIdSelector(this.midiOutput.id))
            );

        this.instrument$ = this.midiConnection$
            .pipe(
                switchMap<null | IMidiConnection, null | IInstrument>((midiConnection) => {
                    if (midiConnection === null || midiConnection.instrumentId === undefined) {
                        return of(null);
                    }

                    return this._store
                        .pipe(
                            select(createInstrumentByIdSelector(midiConnection.instrumentId))
                        );
                })
            );

        this.isRegistered$ = this.instrument$
            .pipe(
                map((instrument) => instrument !== null)
            );

        this.instrumentName$ = this._instrumentNameChanges$.asObservable();

        this.soundCloudUsername$ = this._soundCloudUsernameChanges$.asObservable();

        this.sourceId$ = this.midiConnection$
            .pipe(
                map<null | IMidiConnection, null | string>((midiConnection) => (midiConnection === null) ? null : midiConnection.sourceId),
                filter<null | string, string>((sourceId): sourceId is string => sourceId !== null)
            );

        this.virtualInstrumentName$ = this.instrumentName$
            .pipe(
                map((instrumentName) => (instrumentName !== '') ?
                    instrumentName :
                    (this.midiOutput.name === undefined) ?
                        '' :
                        this.midiOutput.name)
            );

        this.instrument$
            .pipe(
                first()
            )
            .subscribe((instrument) => {
                if (instrument === null) {
                    this._instrumentNameChanges$.next('');
                } else {
                    this._instrumentNameChanges$.next(instrument.name);
                }
            });

        this.midiConnection$
            .pipe(
                first(),
                filter((midiConnection) => midiConnection === null),
                map(() => {
                    const midiConnection = { midiOutputId: this.midiOutput.id, sourceId: 'default' };

                    this._store.dispatch(addMidiConnection(midiConnection));
                })
            )
            .subscribe(() => { // tslint:disable-line:no-empty
                // @todo Catch and handle errors.
            });
    }

    public register () {
        combineLatest(this.description$, this.gearogsSlug$, this.soundCloudUsername$, this.sourceId$, this.virtualInstrumentName$)
            .pipe(
                first()
            )
            .subscribe(([ description, gearogsSlug, soundCloudUsername, sourceId, instrumentName ]) => {
                this._registeringService
                .register(description, gearogsSlug, instrumentName, soundCloudUsername, sourceId)
                    .then(({ connection, instrument }: { connection: Observable<IDataChannel>, instrument: IInstrument }) => {
                        this.midiConnection$
                            .pipe(
                                filter<null | IMidiConnection, IMidiConnection>((midiConnection): midiConnection is IMidiConnection => {
                                    return (midiConnection !== null);
                                }),
                                first()
                            )
                            .subscribe(({ midiOutputId }) => { // tslint:disable-line:no-empty
                                this._store.dispatch(updateMidiConnection({ instrumentId: instrument.id, midiOutputId }));
                            });

                        connection
                            .pipe(
                                concatMap<IDataChannel, any>
                                    ((dataChannel) => this._renderingService.render(wrap(dataChannel), this.midiOutput, sourceId))
                            )
                            .subscribe(() => { // tslint:disable-line:no-empty
                                // @todo
                            });
                    });
            });
    }

    public sample () {
        this.sourceId$
            .pipe(
                first()
            )
            .subscribe((sourceId) => {
                this._recordingService
                    .start(sourceId)
                    .then(() => midiPlayerFactory
                        .create({
                            json: this._middleCMidiJson,
                            midiOutput: this.midiOutput
                        })
                        .play())
                    .then(() => this._recordingService.stop())
                    .then((arrayBuffer: ArrayBuffer) => new Promise<{ id: string }>((resolve) => this._samplesService
                        .create({ file: new Blob([ arrayBuffer ]) })
                        .subscribe((sample) => resolve(sample))))
                    .then((sample: { id: string }) => new Promise((resolve) => this.instrument$
                        .pipe(
                            filter<null | IInstrument, IInstrument>((instrument): instrument is IInstrument => (instrument !== null)),
                            first(),
                            map(({ id }) => {
                                this._store.dispatch(patchInstrument({ id, sample: { id: sample.id } }));
                            })
                        )
                        .subscribe(() => resolve())));
            });
    }

    public test () {
        this.sourceId$
            .pipe(
                first()
            )
            .subscribe((sourceId) => {
                this._recordingService
                    .start(sourceId)
                    .then(() => midiPlayerFactory
                        .create({
                            json: this._scaleMidiJson,
                            midiOutput: this.midiOutput
                        })
                        .play())
                    .then(() => this._recordingService.stop())
                    .then((arrayBuffer) => this._downloadingService.download('sample.wav', arrayBuffer));
            });
    }

    public updateDescription (description: string) {
        this._descriptionChanges$.next(description);

        if (description.trim() !== '') {
            this.instrument$
                .pipe(
                    first(),
                    filter<null | IInstrument, IInstrument>((instrument): instrument is IInstrument => (instrument !== null))
                )
                .subscribe(({ id }) => { // tslint:disable-line:no-empty
                    this._store.dispatch(patchInstrument({ description, id }));
                });
        }
    }

    public updateGearogsSlug (gearogsSlug: string) {
        this._gearogsSlugChanges$.next(gearogsSlug);

        if (gearogsSlug.trim() !== '') {
            this.instrument$
                .pipe(
                    first(),
                    filter<null | IInstrument, IInstrument>((instrument): instrument is IInstrument => (instrument !== null))
                )
                .subscribe(({ id }) => { // tslint:disable-line:no-empty
                    this._store.dispatch(patchInstrument({ gearogsSlug, id }));
                });
        }
    }

    public updateInstrumentName (name: string) {
        let sanitizedName: string;

        if (name.trim() === '') {
            sanitizedName = (this.midiOutput.name === undefined) ? '' : this.midiOutput.name;
            this._instrumentNameChanges$.next('');
        } else {
            sanitizedName = name;
            this._instrumentNameChanges$.next(name);
        }

        this.instrument$
            .pipe(
                first(),
                filter<null | IInstrument, IInstrument>((instrument): instrument is IInstrument => (instrument !== null))
            )
            .subscribe(({ id }) => { // tslint:disable-line:no-empty
                this._store.dispatch(patchInstrument({ id, name: sanitizedName }));
            });
    }

    public updateSoundCloudUsername (soundCloudUsername: string) {
        this._soundCloudUsernameChanges$.next(soundCloudUsername);

        if (soundCloudUsername.trim() !== '') {
            this.instrument$
                .pipe(
                    first(),
                    filter<null | IInstrument, IInstrument>((instrument): instrument is IInstrument => (instrument !== null))
                )
                .subscribe(({ id }) => { // tslint:disable-line:no-empty
                    this._store.dispatch(patchInstrument({ id, soundCloudUsername }));
                });
        }
    }

    public updateSourceId (sourceId: string) {
        this.midiConnection$
            .pipe(
                first(),
                filter<null | IMidiConnection, IMidiConnection>((midiConnection): midiConnection is IMidiConnection => {
                    return (midiConnection !== null);
                })
            )
            .subscribe(({ midiOutputId }) => { // tslint:disable-line:no-empty
                this._store.dispatch(updateMidiConnection({ midiOutputId, sourceId }));
            });
    }

}
