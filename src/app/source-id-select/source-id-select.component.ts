import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AudioInputMediaDevicesService } from '../shared';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: 'anp-source-id-select',
    styleUrls: ['./source-id-select.component.scss'],
    templateUrl: './source-id-select.component.html'
})
export class SourceIdSelectComponent implements OnInit {
    @Input() public sourceId!: string;

    @Output() public readonly sourceIdChange: EventEmitter<Event>;

    public audioInputs$!: Observable<MediaDeviceInfo[]>;

    constructor(private _audioInputMediaDevicesService: AudioInputMediaDevicesService) {
        this.sourceIdChange = new EventEmitter();
    }

    public ngOnInit(): void {
        this.audioInputs$ = this._audioInputMediaDevicesService.watch();
    }

    public onChange(value: Event): void {
        this.sourceIdChange.emit(value);
    }
}
