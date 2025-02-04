import { Component } from '@angular/core';
import { InstrumentsService, MidiAccessService, PeerConnectingService, UserMediaService } from './shared';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: 'anp-app',
    standalone: false,
    styleUrls: ['./app.component.scss'],
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
