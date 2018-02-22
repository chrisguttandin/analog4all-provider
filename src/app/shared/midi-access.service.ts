import { Injectable } from '@angular/core';
import { WindowService } from './window.service';

@Injectable()
export class MidiAccessService {

    private _midiAccess: null | WebMidi.MIDIAccess;

    private _window: null | Window;

    constructor (windowService: WindowService) {
        this._midiAccess = null;
        this._window = windowService.nativeWindow;
    }

    /**
     * This property is true if the browser supports all the required APIs to use the
     * MidiAccessService.
     */
    get isSupported () {
        return (this._window !== null && 'requestMIDIAccess' in this._window.navigator);
    }

    public request (): Promise<WebMidi.MIDIAccess> {
        if (this._midiAccess !== null) {
            return Promise.resolve(this._midiAccess);
        }

        if (this.isSupported) {
            return (<Window> this._window).navigator
                .requestMIDIAccess()
                .then((midiAccess) => this._midiAccess = midiAccess);
        }

        return Promise.reject(new Error('The Web MIDI API is not supported by the current browser.'));
    }

}
