import { IInstrument } from '../../interfaces';
import { ADD_INSTRUMENT, DELETE_INSTRUMENT, UPDATE_INSTRUMENT } from '../actions';
import { TInstrumentAction } from '../types';

const addInstrument = (instruments: IInstrument[], instrument: IInstrument) => {
    const index = instruments.findIndex(({ id }) => id === instrument.id);

    if (index > -1) {
        throw new Error('An instrument with the same id does already exist.');
    }

    return [ ...instruments, instrument ];
};

const deleteInstrument = (instruments: IInstrument[], instrument: IInstrument) => {
    const index = instruments.indexOf(instrument);

    if (index === -1) {
        throw new Error('The instrument to be deleted is not stored.');
    }

    return [ ...instruments.slice(0, index), ...instruments.slice(index + 1) ];
};

const updateInstrument = (instruments: IInstrument[], instrument: { id: string } & Partial<IInstrument>) => {
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
export function instrumentsReducer (state: IInstrument[] = [], action: TInstrumentAction): IInstrument[] {
    switch (action.type) {
        case ADD_INSTRUMENT:
            return addInstrument(state, action.payload);
        case DELETE_INSTRUMENT:
            return deleteInstrument(state, action.payload);
        case UPDATE_INSTRUMENT:
            return updateInstrument(state, action.payload);
        default:
            return state;
    }
}
