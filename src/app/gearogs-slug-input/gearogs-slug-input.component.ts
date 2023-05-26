import { Component, EventEmitter, Input, Output } from '@angular/core';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: 'anp-gearogs-slug-input',
    styleUrls: ['./gearogs-slug-input.component.scss'],
    templateUrl: './gearogs-slug-input.component.html'
})
export class GearogsSlugInputComponent {
    @Input() public gearogsSlug!: string | undefined;

    @Output() public readonly gearogsSlugChange: EventEmitter<Event>;

    constructor() {
        this.gearogsSlugChange = new EventEmitter();
    }

    public onChange(value: Event): void {
        this.gearogsSlugChange.emit(value);
    }
}
