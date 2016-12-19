import { Action, ActionReducer } from '@ngrx/store';

export const UPDATE_MIDI_OUTPUTS = 'UPDATE_MIDI_OUTPUTS';

const midiOutputsReducer: ActionReducer<WebMidi.MIDIOutput[]> = (state = [], action: Action) => {
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
};

// @todo This separate export was necessary to enable AoT with TypeScript 2.0.X.
export { midiOutputsReducer };
