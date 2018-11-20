import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'anp-gearogs-slug-input',
    styleUrls: [ './gearogs-slug-input.component.css' ],
    templateUrl: './gearogs-slug-input.component.html'
})
export class GearogsSlugInputComponent {

    @Input() public gearogsSlug!: string;

    @Output() public gearogsSlugChange: EventEmitter<Event>;

    constructor () {
        this.gearogsSlugChange = new EventEmitter();
    }

    public onChange (value: Event) {
        this.gearogsSlugChange.emit(value);
    }

}
