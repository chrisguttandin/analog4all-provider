import { ActionReducer } from '@ngrx/store';
import { IInstrument, IMidiConnection } from '../interfaces';
import { instrumentsReducer } from './reducers/instruments';
import { midiConnectionsReducer } from './reducers/midi-connections';
import { midiOutputsReducer } from './reducers/midi-outputs';

export interface IAppState {

    instruments: IInstrument[];

    midiConnections: IMidiConnection[];

    midiOutputs: WebMidi.MIDIOutput[];

};

export const appReducer: { [key: string]: ActionReducer<any> } = {
    instruments: instrumentsReducer,
    midiConnections: midiConnectionsReducer,
    midiOutputs: midiOutputsReducer
};
