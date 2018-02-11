import { createSelector } from '@ngrx/store';
import { IAppState } from '../interfaces';

export const selectInstruments = (state: IAppState) => state.instruments;

export const createInstrumentByIdSelector = (id: string) => createSelector(
    selectInstruments,
    (instruments) => {
        const instrument = instruments.find(({ id: d }) => id === d);

        if (instrument === undefined) {
            return null;
        }

        return instrument;
    }
);
