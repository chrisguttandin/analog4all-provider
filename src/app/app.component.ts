import { Component } from '@angular/core';
import { InstrumentsService, MidiAccessService, PeerConnectingService, UserMediaService } from './shared';

@Component({
    selector: 'anp-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html'
})
export class AppComponent {
    public isSupported: boolean;

    constructor(
        private _instrumentsService: InstrumentsService,
        private _midiAccessService: MidiAccessService,
        private _peerConnectingService: PeerConnectingService,
        private _userMediaService: UserMediaService
    ) {
        this.isSupported =
            this._instrumentsService.isSupported &&
            this._midiAccessService.isSupported &&
            this._peerConnectingService.isSupported &&
            this._userMediaService.isSupported;
    }
}
