import { MidiPlayer } from 'midi-player';
import { parseArrayBuffer } from 'midi-json-parser';

export class RenderingService {

    constructor (fileReceivingService, fileSendingService, recordingService, waitingService) {
        this._fileReceivingService = fileReceivingService;
        this._fileSendingService = fileSendingService;
        this._recordingService = recordingService;
        this._waitingService = waitingService;
    }

    async render (dataChannelSubject, device) {
        var arrayBuffer,
            json;

        await this._waitingService.wait(dataChannelSubject);

        arrayBuffer = await this._fileReceivingService.receive(dataChannelSubject);
        json = await parseArrayBuffer(arrayBuffer);

        json.tracks = json.tracks.map((events) => {
            var allowedEvents = [],
                delta = 0;

            for (let i = 0, length = events.length; i < length; i += 1) {
                let event = events[i];

                if (event.endOfTrack || event.noteOff || event.noteOn || event.setTempo || event.timeSignature || event.trackName) {
                    event.delta = event.delta + delta;
                    allowedEvents.push(event);
                    delta = 0;
                } else {
                    delta += event.delta;
                }
            }

            return allowedEvents;
        });


        await this._recordingService.start();

        return new Promise((resolve) => {
            /* eslint-disable indent */
            var midiPlayer = new MidiPlayer({
                    json,
                    midiOutput: device
                });
            /* eslint-enable indent */

            midiPlayer.play();

            midiPlayer.on('ended', () => resolve(this._recordingService
                .stop()
                .then((waveFile) => this._fileSendingService.send(dataChannelSubject, new Blob([waveFile])))));
        });
    }

}
