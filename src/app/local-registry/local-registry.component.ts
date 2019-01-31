import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TAppState, TMidiConnection, createMidiConnectionsSelector } from '../store';

@Component({
    selector: 'anp-local-registry',
    styleUrls: [ './local-registry.component.css' ],
    templateUrl: './local-registry.component.html'
})
export class LocalRegistryComponent implements OnInit {

    public connectedMidiConnections$!: Observable<TMidiConnection[]>;

    public hasConnectedMidiConnections$!: Observable<boolean>;

    constructor (
        private _store: Store<TAppState>
    ) { }

    public identifyMidiConnection (_: number, { midiOutputId }: TMidiConnection): string {
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
