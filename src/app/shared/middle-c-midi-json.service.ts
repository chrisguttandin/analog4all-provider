import { Injectable } from '@angular/core';
import { IMidiFile } from 'midi-json-parser-worker';

@Injectable({
    providedIn: 'root'
})
export class MiddleCMidiJsonService {
    // eslint-disable-next-line class-methods-use-this
    public get midiJson(): IMidiFile {
        return {
            division: 480,
            format: 1,
            tracks: [
                [
                    {
                        delta: 0,
                        trackName: 'middle-c'
                    },
                    {
                        delta: 0,
                        setTempo: {
                            microsecondsPerQuarter: 500000
                        }
                    },
                    {
                        delta: 0,
                        timeSignature: {
                            denominator: 4,
                            metronome: 24,
                            numerator: 4,
                            thirtyseconds: 8
                        }
                    },
                    {
                        delta: 0,
                        endOfTrack: true
                    }
                ],
                [
                    {
                        delta: 0,
                        trackName: 'middle-c'
                    },
                    {
                        channel: 0,
                        delta: 0,
                        noteOn: {
                            noteNumber: 60,
                            velocity: 100
                        }
                    },
                    {
                        channel: 0,
                        delta: 960,
                        noteOff: {
                            noteNumber: 60,
                            velocity: 100
                        }
                    },
                    {
                        delta: 0,
                        endOfTrack: true
                    }
                ]
            ]
        };
    }
}
