import { Component, EventEmitter, Input, Output } from '@angular/core';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: 'anp-description-input',
    styleUrls: ['./description-input.component.scss'],
    templateUrl: './description-input.component.html'
})
export class DescriptionInputComponent {
    @Input() public description!: string | undefined;

    @Output() public readonly descriptionChange: EventEmitter<Event>;

    constructor() {
        this.descriptionChange = new EventEmitter();
    }

    public onChange(value: Event): void {
        this.descriptionChange.emit(value);
    }
}
