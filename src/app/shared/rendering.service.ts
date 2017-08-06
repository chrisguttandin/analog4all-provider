import { Injectable } from '@angular/core';
import { parseArrayBuffer } from 'midi-json-parser';
import { IMidiFile } from 'midi-json-parser-worker';
import { midiPlayerFactory } from 'midi-player';
import { IMaskableSubject, IStringifyableJsonObject } from 'rxjs-broker';
import { FileReceivingService } from './file-receiving.service';
import { FileSendingService } from './file-sending.service';
import { RecordingService } from './recording.service';
import { WaitingService } from './waiting.service';

@Injectable()
export class RenderingService {

    constructor (
        private _fileReceivingService: FileReceivingService,
        private _fileSendingService: FileSendingService,
        private _recordingService: RecordingService,
        private _waitingService: WaitingService
    ) { }

    public render (dataChannelSubject: IMaskableSubject<IStringifyableJsonObject>, midiOutput: WebMidi.MIDIOutput, sourceId: string) {
        return this._waitingService
            .wait(dataChannelSubject)
            .then(() => {
                // @todo console.log('receive');

                return this._fileReceivingService.receive(dataChannelSubject);
            })
            .then((arrayBuffer: ArrayBuffer) => {
                // @todo console.log('parse');

                return parseArrayBuffer(arrayBuffer);
            })
            .then((midiJson: IMidiFile) => {
                midiJson.tracks = midiJson.tracks
                    .map((events) => {
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

                return this._recordingService
                    .start(sourceId)
                    .then(() => midiJson);
            })
            .then((midiJson) => midiPlayerFactory
                .create({ json: midiJson, midiOutput })
                .play())
            .then(() => {
                // @todo console.log('stop');

                return this._recordingService.stop();
            })
            .then((arrayBuffer) => {
                // @todo console.log('send');

                return this._fileSendingService.send(dataChannelSubject, new Blob([ arrayBuffer ]));
            })
            .then(() => {
                // @todo console.log('done');

                dataChannelSubject.close();
            });
    }

}
