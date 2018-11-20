import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'anp-description-input',
    styleUrls: [ './description-input.component.css' ],
    templateUrl: './description-input.component.html'
})
export class DescriptionInputComponent {

    @Input() public description!: string;

    @Output() public descriptionChange: EventEmitter<Event>;

    constructor () {
        this.descriptionChange = new EventEmitter();
    }

    public onChange (value: Event) {
        this.descriptionChange.emit(value);
    }

}
