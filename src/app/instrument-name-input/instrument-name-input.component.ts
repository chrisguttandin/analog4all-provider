import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'anp-instrument-name-input',
    styleUrls: [ './instrument-name-input.component.css' ],
    templateUrl: './instrument-name-input.component.html'
})
export class InstrumentNameInputComponent {

    @Input() public readonly defaultName!: string;

    @Input() public readonly name!: null | string;

    @Output() public readonly nameChange: EventEmitter<Event>;

    constructor () {
        this.nameChange = new EventEmitter();
    }

    public onChange (value: Event): void {
        this.nameChange.emit(value);
    }

}
