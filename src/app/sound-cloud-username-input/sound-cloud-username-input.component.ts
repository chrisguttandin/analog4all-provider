import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'anp-sound-cloud-username-input',
    styleUrls: ['./sound-cloud-username-input.component.css'],
    templateUrl: './sound-cloud-username-input.component.html'
})
export class SoundCloudUsernameInputComponent {
    @Input() public readonly soundCloudUsername!: string | undefined;

    @Output() public readonly soundCloudUsernameChange: EventEmitter<Event>;

    constructor() {
        this.soundCloudUsernameChange = new EventEmitter();
    }

    public onChange(value: Event): void {
        this.soundCloudUsernameChange.emit(value);
    }
}
