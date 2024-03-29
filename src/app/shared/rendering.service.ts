import { Injectable } from '@angular/core';
import { parseArrayBuffer } from 'midi-json-parser';
import { create as createMidiPlayer } from 'midi-player';
import { IRemoteSubject, IStringifyableJsonObject } from 'rxjs-broker';
import { FileReceivingService } from './file-receiving.service';
import { FileSendingService } from './file-sending.service';
import { RecordingService } from './recording.service';
import { WaitingService } from './waiting.service';

@Injectable({
    providedIn: 'root'
})
export class RenderingService {
    constructor(
        private _fileReceivingService: FileReceivingService,
        private _fileSendingService: FileSendingService,
        private _recordingService: RecordingService,
        private _waitingService: WaitingService
    ) {}

    public render(
        dataChannelSubject: IRemoteSubject<IStringifyableJsonObject>,
        midiOutput: WebMidi.MIDIOutput, // eslint-disable-line no-undef
        sourceId: string
    ): Promise<void> {
        return this._waitingService
            .wait(dataChannelSubject)
            .then(() => this._fileReceivingService.receive(dataChannelSubject))
            .then((arrayBuffer: ArrayBuffer) => parseArrayBuffer(arrayBuffer))
            .then((midiJson) => {
                midiJson.tracks = midiJson.tracks.map((events) => {
                    const allowedEvents = [];

                    let delta = 0;

                    const length = events.length;

                    for (let i = 0; i < length; i += 1) {
                        const event = events[i];

                        if (
                            'endOfTrack' in event ||
                            'noteOff' in event ||
                            'noteOn' in event ||
                            'setTempo' in event ||
                            'timeSignature' in event ||
                            'trackName' in event
                        ) {
                            event.delta = event.delta + delta;
                            allowedEvents.push(event);
                            delta = 0;
                        } else {
                            delta += event.delta;
                        }
                    }

                    return allowedEvents;
                });

                return this._recordingService.start(sourceId).then(() => midiJson);
            })
            .then((midiJson) => {
                const midiPlayer = createMidiPlayer({ json: midiJson, midiOutput });

                return midiPlayer.play();
            })
            .then(() => this._recordingService.stop())
            .then((arrayBuffer) => this._fileSendingService.send(dataChannelSubject, new Blob([arrayBuffer])))
            .then(() => dataChannelSubject.close());
    }
}
