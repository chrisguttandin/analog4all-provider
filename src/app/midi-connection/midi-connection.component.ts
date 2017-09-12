import { Component, Input, OnInit } from '@angular/core';
import { IMidiFile } from 'midi-json-parser-worker';
import { midiPlayerFactory } from 'midi-player';
import { wrap } from 'rxjs-broker';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { IInstrument, IMidiConnection } from '../interfaces';
import {
    DownloadingService,
    InstrumentsService,
    MiddleCMidiJsonService,
    MidiConnectionsService,
    RecordingService,
    RegisteringService,
    RenderingService,
    SamplesService,
    ScaleMidiJsonService
} from '../shared';

@Component({
    selector: 'anp-midi-connection',
    styleUrls: [ './midi-connection.component.css' ],
    templateUrl: './midi-connection.component.html'
})
export class MidiConnectionComponent implements OnInit {

    public audioInputs$: Observable<MediaDeviceInfo[]>;

    public instrument$: Observable<IInstrument>;

    public instrumentName$: Observable<string>;

    public isRegistered$: Observable<boolean>;

    public midiConnection$: Observable<IMidiConnection>;

    @Input() public midiOutput: WebMidi.MIDIOutput;

    public sourceId$: Observable<string>;

    public virtualInstrumentName$: Observable<string>;

    private _instrumentChanges$: BehaviorSubject<null | IInstrument>;

    private _instrumentNameChanges$: BehaviorSubject<string>;

    private _middleCMidiJson: IMidiFile;

    private _scaleMidiJson: IMidiFile;

    constructor (
        private _downloadingService: DownloadingService,
        private _instrumentsService: InstrumentsService,
        middleCMidiJsonService: MiddleCMidiJsonService,
        private _midiConnectionsService: MidiConnectionsService,
        private _registeringService: RegisteringService,
        private _renderingService: RenderingService,
        private _recordingService: RecordingService,
        private _samplesService: SamplesService,
        scaleMidiJsonService: ScaleMidiJsonService
    ) {
        this._instrumentChanges$ = new BehaviorSubject(null);
        this._middleCMidiJson = middleCMidiJsonService.midiJson;
        this._scaleMidiJson = scaleMidiJsonService.midiJson;
        this._instrumentNameChanges$ = new BehaviorSubject('');
    }

    public deregister () {
        this.instrument$
            .take(1)
            .switchMap((instrument) => this._registeringService.deregister(instrument))
            .switchMap(() => this.midiConnection$)
            .take(1)
            .mergeMap((midiConnection) => this._midiConnectionsService.update(midiConnection.midiOutputId, { instrumentId: undefined }))
            .subscribe(() => { // tslint:disable-line:no-empty
                // @todo
            });
    }

    public ngOnInit () {
        this.midiConnection$ = this._midiConnectionsService
            .select(this.midiOutput.id);

        this.instrument$ = this.midiConnection$
            .switchMap((midiConnection) => {
                if (midiConnection === null || midiConnection.instrumentId === undefined) {
                    return Observable.of(null);
                }

                return this._instrumentsService.select(midiConnection.instrumentId);
            });

        this.isRegistered$ = this.instrument$
            .map((instrument) => instrument !== null);

        this.instrumentName$ = this._instrumentNameChanges$.asObservable();

        this.sourceId$ = this.midiConnection$
            .map((midiConnection) => (midiConnection === null) ? null : midiConnection.sourceId);

        this.virtualInstrumentName$ = this.instrumentName$
            .map((instrumentName) => (instrumentName === '') ? this.midiOutput.name : instrumentName);

        this.instrument$
            .take(1)
            .subscribe((instrument) => {
                if (instrument === null) {
                    this._instrumentNameChanges$.next('');
                } else {
                    this._instrumentNameChanges$.next(instrument.name);
                }
            });

        this.midiConnection$
            .take(1)
            .filter((midiConnection) => midiConnection === null)
            .mergeMap(() => this._midiConnectionsService.create({ midiOutputId: this.midiOutput.id }))
            .subscribe(() => { // tslint:disable-line:no-empty
                // @todo Catch and handle errors.
            });
    }

    public register () {
        Observable
            .combineLatest(this.sourceId$, this.virtualInstrumentName$)
            .take(1)
            .subscribe(([ sourceId, instrumentName ]) => {
                this._registeringService
                    .register(instrumentName, sourceId)
                    .then(({ connection, instrument }) => {
                        this.midiConnection$
                            .take(1)
                            .mergeMap((midiConnection) => this._midiConnectionsService
                                .update(midiConnection.midiOutputId, { instrumentId: instrument.id }))
                            .subscribe(() => { // tslint:disable-line:no-empty
                                // @todo
                            });

                        connection
                            .concatMap((dataChannel) => this._renderingService.render(wrap(dataChannel), this.midiOutput, sourceId))
                            .subscribe(() => { // tslint:disable-line:no-empty
                                // @todo
                            });
                    });
            });
    }

    public sample () {
        this.sourceId$
            .take(1)
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
                    .then((arrayBuffer: ArrayBuffer) => this._samplesService
                        .create({ file: new Blob([ arrayBuffer ]) })
                        .toPromise())
                    .then((sample: { id: string }) => this.instrument$
                        .take(1)
                        .mergeMap((instrument) => this._instrumentsService
                            .update(instrument.id, {
                                sample: {
                                    id: sample.id
                                }
                            }))
                        .toPromise());
            });
    }

    public test () {
        this.sourceId$
            .take(1)
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
                    .then((arrayBuffer: ArrayBuffer) => this._downloadingService.download('sample.wav', arrayBuffer));
            });
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
            .take(1)
            .filter((instrument) => (instrument !== null))
            .mergeMap(({ id }) => this._instrumentsService.update(id, { name: sanitizedName }))
            .subscribe(() => { // tslint:disable-line:no-empty
                // @todo
            });
    }

    public updateSourceId (sourceId: string) {
        this.midiConnection$
            .take(1)
            .filter((midiConnection) => (midiConnection !== null))
            .mergeMap(({ midiOutputId }) => this._midiConnectionsService.update(midiOutputId, { sourceId }))
            .subscribe(() => { // tslint:disable-line:no-empty
                // @todo
            });
    }

}
