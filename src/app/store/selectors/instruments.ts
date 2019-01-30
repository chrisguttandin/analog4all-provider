import { createSelector, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IInstrument } from '../../interfaces';
import { IAppState } from '../interfaces';

const findInstrumentByIdSelector = (instruments: IAppState['instruments'], id: IInstrument['id']) => {
    return instruments.find((instrument) => (instrument.id === id));
};

const instrumentByIdSelector = (instruments: IAppState['instruments'], { id }: { id: IInstrument['id'] }) => {
    const instrument = findInstrumentByIdSelector(instruments, id);

    if (instrument === undefined) {
        return null;
    }

    return instrument;
};

const instrumentsSelector = (state: IAppState) => state.instruments;

export const createInstrumentByIdSelector = (store: Observable<IAppState>, id: IInstrument['id']) => store
    .pipe(
        select(createSelector(instrumentsSelector, instrumentByIdSelector), { id })
    );
