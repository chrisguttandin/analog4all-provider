import { Action, ActionReducer } from '@ngrx/store';
import { IInstrument } from '../../interfaces';

export const ADD_INSTRUMENT = 'ADD_INSTRUMENT';
export const DELETE_INSTRUMENT = 'DELETE_INSTRUMENT';
export const UPDATE_INSTRUMENT = 'UPDATE_INSTRUMENT';

const deleteInstrument = (instruments, instrument) => {
    const index = instruments.findIndex(({ id }) => id === instrument);

    if (index === -1) {
        return instruments;
    }

    return [ ...instruments.slice(0, index), ...instruments.slice(index + 1) ];
};

const updateInstrument = (instruments, instrument) => {
    const index = instruments.findIndex(({ id }) => id === instrument.id);

    if (index === -1) {
        return instruments;
    }

    return [
        ...instruments.slice(0, index),
        Object.assign({}, instruments[index], instrument),
        ...instruments.slice(index + 1)
    ];
};

const instrumentsReducer: ActionReducer<IInstrument[]> = (state = [], action: Action) => {
    switch (action.type) {
        case ADD_INSTRUMENT:
            return [ ...state, action.payload ];
        case DELETE_INSTRUMENT:
            return deleteInstrument(state, action.payload);
        case UPDATE_INSTRUMENT:
            return updateInstrument(state, action.payload);
        default:
            return state;
    }
};

// @todo This separate export was necessary to enable AoT with TypeScript 2.0.X.
export { instrumentsReducer };
