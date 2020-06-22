import { createReducer, on } from '@ngrx/store';
import { addInstrument, removeInstrument, updateInstrument } from '../actions';
import { TIdentifiable, TInstrument, TStoreAction } from '../types';

const addInstrumentFunction = (instruments: readonly TInstrument[], instrument: TInstrument) => {
    const index = instruments.findIndex(({ id }) => id === instrument.id);

    if (index > -1) {
        throw new Error('An instrument with the same id does already exist.');
    }

    return [...instruments, instrument];
};

const removeInstrumentFunction = (instruments: readonly TInstrument[], instrument: TInstrument) => {
    const index = instruments.indexOf(instrument);

    if (index === -1) {
        throw new Error('The instrument to be removed is not stored.');
    }

    return [...instruments.slice(0, index), ...instruments.slice(index + 1)];
};

const updateInstrumentFunction = (instruments: readonly TInstrument[], instrument: TIdentifiable<TInstrument, 'id'>) => {
    const index = instruments.findIndex(({ id }) => id === instrument.id);

    if (index === -1) {
        throw new Error('An instrument with the same id is not stored.');
    }

    return [...instruments.slice(0, index), { ...instruments[index], ...instrument }, ...instruments.slice(index + 1)];
};

const reducer = createReducer<readonly TInstrument[]>(
    [],
    on(addInstrument, (state, { payload }) => addInstrumentFunction(state, payload)),
    on(removeInstrument, (state, { payload }) => removeInstrumentFunction(state, payload)),
    on(updateInstrument, (state, { payload }) => updateInstrumentFunction(state, payload))
);

// @todo Defining this as a function was necessary to enable AoT with TypeScript 2.0.X.
export function instrumentsReducer(state: readonly TInstrument[] = [], action: TStoreAction): readonly TInstrument[] {
    return reducer(state, action);
}
