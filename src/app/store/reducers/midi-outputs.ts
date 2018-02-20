import { UPDATE_MIDI_OUTPUTS } from '../actions';
import { TStoreAction } from '../types';

// @todo Defining this as a function was necessary to enable AoT with TypeScript 2.0.X.
export function midiOutputsReducer (state: WebMidi.MIDIOutput[] = [], action: TStoreAction): WebMidi.MIDIOutput[] {
    switch (action.type) {
        case UPDATE_MIDI_OUTPUTS:
            const remainingOutputs = state
                .filter(({ id }) => action.payload.some(({ id: d }) => id === d));

            const newOutputs = action.payload
                .filter(({ id }) => !(remainingOutputs.some(({ id: d }) => id === d)));

            return [ ...remainingOutputs, ...newOutputs ];
        default:
            return state;
    }
}
