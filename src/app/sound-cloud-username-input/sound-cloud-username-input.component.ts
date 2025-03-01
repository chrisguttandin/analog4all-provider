import { Component, EventEmitter, Input, Output } from '@angular/core';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: 'anp-sound-cloud-username-input',
    standalone: false,
    styleUrls: ['./sound-cloud-username-input.component.scss'],
    templateUrl: './sound-cloud-username-input.component.html'
})
export class SoundCloudUsernameInputComponent {
    @Input() public soundCloudUsername!: string | undefined;

    @Output() public readonly soundCloudUsernameChange: EventEmitter<Event>;

    constructor() {
        this.soundCloudUsernameChange = new EventEmitter();
    }

    public onChange(value: Event): void {
        this.soundCloudUsernameChange.emit(value);
    }
}
