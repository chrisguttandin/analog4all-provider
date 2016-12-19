import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AudioInputMediaDevicesService } from '../shared';

@Component({
    selector: 'anp-source-id-select',
    styleUrls: [ './source-id-select.component.css' ],
    templateUrl: './source-id-select.component.html'
})
export class SourceIdSelectComponent implements OnInit {

    public audioInputs$: Observable<MediaDeviceInfo[]>;

    @Input() public sourceId: string;

    @Output() public sourceIdChange: EventEmitter<{}>;

    constructor (
        private _audioInputMediaDevicesService: AudioInputMediaDevicesService
    ) {
        this.sourceIdChange = new EventEmitter();
    }

    public ngOnInit () {
        this.audioInputs$ = this._audioInputMediaDevicesService.watch();
    }

    public onChange (value) {
        this.sourceIdChange.emit(value);
    }

}
