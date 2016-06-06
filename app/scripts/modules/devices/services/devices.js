class DevicesService {

    constructor () {
        this._midiAccess = null;
    }

    async fetch () {
        await this._requestMIDIAccess();

        if (this._midiAccess !== null) {
            let devices = [];

            for (let device of this._midiAccess.outputs.values()) {
                devices.push(device);
            }

            return devices;

            // @todo Handle midiAccess.onstatechange events.
        }

        throw new Error();
    }

    async get (id) {
        await this._requestMIDIAccess();

        if (this._midiAccess !== null) {
            for (let device of this._midiAccess.outputs.values()) {
                if (device.id === id) {
                    return device;
                }
            }

            // @todo Handle midiAccess.onstatechange events.
        }

        throw new Error();
    }

    async _requestMIDIAccess () {
        if (this._midiAccess === null &&
                'navigator' in window &&
                'requestMIDIAccess' in window.navigator) {
            this._midiAccess = await window.navigator.requestMIDIAccess();
        }
    }

}

module.exports = DevicesService;
