import { IInstrument } from '../../interfaces';
import { ADD_INSTRUMENT, REMOVE_INSTRUMENT, UPDATE_INSTRUMENT } from '../actions';
import { TStoreAction } from '../types';

const addInstrument = (instruments: IInstrument[], instrument: IInstrument) => {
    const index = instruments.findIndex(({ id }) => id === instrument.id);

    if (index > -1) {
        throw new Error('An instrument with the same id does already exist.');
    }

    return [ ...instruments, instrument ];
};

const removeInstrument = (instruments: IInstrument[], instrument: IInstrument) => {
    const index = instruments.indexOf(instrument);

    if (index === -1) {
        throw new Error('The instrument to be removed is not stored.');
    }

    return [ ...instruments.slice(0, index), ...instruments.slice(index + 1) ];
};

const updateInstrument = (instruments: IInstrument[], instrument: { id: IInstrument['id'] } & Partial<IInstrument>) => {
    const index = instruments.findIndex(({ id }) => id === instrument.id);

    if (index === -1) {
        throw new Error('An instrument with the same id is not stored.');
    }

    return [
        ...instruments.slice(0, index),
        { ...instruments[index], ...instrument },
        ...instruments.slice(index + 1)
    ];
};

// @todo Defining this as a function was necessary to enable AoT with TypeScript 2.0.X.
export function instrumentsReducer (state: IInstrument[] = [], action: TStoreAction): IInstrument[] {
    switch (action.type) {
        case ADD_INSTRUMENT:
            return addInstrument(state, action.payload);
        case REMOVE_INSTRUMENT:
            return removeInstrument(state, action.payload);
        case UPDATE_INSTRUMENT:
            return updateInstrument(state, action.payload);
        default:
            return state;
    }
}
