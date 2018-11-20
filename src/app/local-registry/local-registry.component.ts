import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMidiConnection } from '../interfaces';
import { IAppState } from '../store/interfaces';
import { selectMidiConnections } from '../store/selectors';

@Component({
    selector: 'anp-local-registry',
    styleUrls: [ './local-registry.component.css' ],
    templateUrl: './local-registry.component.html'
})
export class LocalRegistryComponent implements OnInit {

    public connectedMidiConnections$!: Observable<IMidiConnection[]>;

    public hasConnectedMidiConnections$!: Observable<boolean>;

    constructor (
        private _store: Store<IAppState>
    ) { }

    public identifyMidiConnection (_: number, { midiOutputId }: IMidiConnection) {
        return midiOutputId;
    }

    public ngOnInit () {
        this.connectedMidiConnections$ = this._store
            .pipe(
                select(selectMidiConnections),
                map((midiConnections) => midiConnections.filter(({ isConnected }) => isConnected))
            );

        this.hasConnectedMidiConnections$ = this.connectedMidiConnections$
            .pipe(
                map((connectedMidiConnections) => (connectedMidiConnections.length > 0))
            );
    }

}
