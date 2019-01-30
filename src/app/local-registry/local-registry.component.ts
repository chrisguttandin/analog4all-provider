import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMidiConnection } from '../interfaces';
import { IAppState } from '../store/interfaces';
import { createMidiConnectionsSelector } from '../store/selectors';

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

    public identifyMidiConnection (_: number, { midiOutputId }: IMidiConnection): string {
        return midiOutputId;
    }

    public ngOnInit (): void {
        this.connectedMidiConnections$ = createMidiConnectionsSelector(this._store)
            .pipe(
                map((midiConnections) => midiConnections.filter(({ isConnected }) => isConnected))
            );

        this.hasConnectedMidiConnections$ = this.connectedMidiConnections$
            .pipe(
                map((connectedMidiConnections) => (connectedMidiConnections.length > 0))
            );
    }

}
