import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'anp-gearogs-slug-input',
    styleUrls: [ './gearogs-slug-input.component.css' ],
    templateUrl: './gearogs-slug-input.component.html'
})
export class GearogsSlugInputComponent {

    @Input() public readonly gearogsSlug!: string | undefined;

    @Output() public readonly gearogsSlugChange: EventEmitter<Event>;

    constructor () {
        this.gearogsSlugChange = new EventEmitter();
    }

    public onChange (value: Event): void {
        this.gearogsSlugChange.emit(value);
    }

}
