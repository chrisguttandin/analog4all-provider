import { IInstrument } from '../../interfaces';
import { IAddInstrumentAction, IDeleteInstrumentAction, IUpdateInstrumentAction } from '../interfaces';
import { TInstrumentAction } from '../types';

export const ADD_INSTRUMENT: IAddInstrumentAction['type'] = 'ADD_INSTRUMENT';
export const DELETE_INSTRUMENT: IDeleteInstrumentAction['type'] = 'DELETE_INSTRUMENT';
export const UPDATE_INSTRUMENT: IUpdateInstrumentAction['type'] = 'UPDATE_INSTRUMENT';

const deleteInstrument = (instruments: IInstrument[], instrument: IInstrument) => {
    const index = instruments.findIndex(({ id }) => id === instrument.id);

    if (index === -1) {
        return instruments;
    }

    return [ ...instruments.slice(0, index), ...instruments.slice(index + 1) ];
};

const updateInstrument = (instruments: IInstrument[], instrument: IInstrument) => {
    const index = instruments.findIndex(({ id }) => id === instrument.id);

    if (index === -1) {
        return instruments;
    }

    return [
        ...instruments.slice(0, index),
        { ...instruments[index], instrument },
        ...instruments.slice(index + 1)
    ];
};

// @todo Defining this as a function was necessary to enable AoT with TypeScript 2.0.X.
export function instrumentsReducer (state: IInstrument[] = [], action: TInstrumentAction): IInstrument[] {
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
}
