import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MidiOutputsService } from '../shared';

@Component({
    selector: 'anp-local-registry',
    styleUrls: [ './local-registry.component.css' ],
    templateUrl: './local-registry.component.html'
})
export class LocalRegistryComponent implements OnInit {

    public midiOutputs$: Observable<WebMidi.MIDIOutput[]>;

    public midiOutputsLength$: Observable<number>;

    constructor (private _midiOutputsService: MidiOutputsService) { }

    public ngOnInit () {
        this.midiOutputs$ = this._midiOutputsService
            .watch();

        this.midiOutputsLength$ = this.midiOutputs$
            .map((midiOutputs) => midiOutputs.length);
    }

}
