import { Component, OnInit } from '@angular/core';
import { InstrumentsService, MidiAccessService, PeerConnectingService, UserMediaService } from './shared';

@Component({
    selector: 'anp-root',
    styleUrls: [ './app.component.css' ],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    public isSupported: boolean;

    constructor (
        private _instrumentsService: InstrumentsService,
        private _midiAccessService: MidiAccessService,
        private _peerConnectingService: PeerConnectingService,
        private _userMediaService: UserMediaService
    ) { }

    public ngOnInit () {
        this.isSupported = this._instrumentsService.isSupported &&
            this._midiAccessService.isSupported &&
            this._peerConnectingService.isSupported &&
            this._userMediaService.isSupported;
    }

}
