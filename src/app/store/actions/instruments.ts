import { createAction } from '@ngrx/store';
import { TIdentifiable, TInstrument } from '../types';

export const addInstrument = createAction('ADD_INSTRUMENT', (instrument: TInstrument) => ({ payload: instrument }));

export const deleteInstrument = createAction('DELETE_INSTRUMENT', (instrument: TInstrument) => ({ payload: instrument }));

export const deleteInstrumentFail = createAction('DELETE_INSTRUMENT_FAIL', (instrument: TInstrument) => ({ payload: instrument }));

export const deleteInstrumentSuccess = createAction('DELETE_INSTRUMENT_SUCCESS', (instrument: TInstrument) => ({ payload: instrument }));

export const patchInstrument = createAction('PATCH_INSTRUMENT', (instrument: TIdentifiable<TInstrument, 'id'>) => ({
    payload: instrument
}));

export const patchInstrumentFail = createAction('PATCH_INSTRUMENT_FAIL', (id: TInstrument['id']) => ({ payload: id }));

export const patchInstrumentSuccess = createAction('PATCH_INSTRUMENT_SUCCESS', (instrument: TIdentifiable<TInstrument, 'id'>) => ({
    payload: instrument
}));

export const removeInstrument = createAction('REMOVE_INSTRUMENT', (instrument: TInstrument) => ({ payload: instrument }));

export const updateInstrument = createAction('UPDATE_INSTRUMENT', (instrument: TIdentifiable<TInstrument, 'id'>) => ({
    payload: instrument
}));
