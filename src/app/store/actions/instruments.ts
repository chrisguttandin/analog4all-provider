import { createAction } from '@ngrx/store';
import {
    IAddInstrumentAction,
    IDeleteInstrumentAction,
    IDeleteInstrumentFailAction,
    IDeleteInstrumentSuccessAction,
    IPatchInstrumentAction,
    IPatchInstrumentFailAction,
    IPatchInstrumentSuccessAction,
    IRemoveInstrumentAction,
    IUpdateInstrumentAction
} from '../interfaces';
import { TIdentifiable, TInstrument } from '../types';

export const ADD_INSTRUMENT: IAddInstrumentAction['type'] = 'ADD_INSTRUMENT';
export const DELETE_INSTRUMENT: IDeleteInstrumentAction['type'] = 'DELETE_INSTRUMENT';
export const DELETE_INSTRUMENT_FAIL: IDeleteInstrumentFailAction['type'] = 'DELETE_INSTRUMENT_FAIL';
export const DELETE_INSTRUMENT_SUCCESS: IDeleteInstrumentSuccessAction['type'] = 'DELETE_INSTRUMENT_SUCCESS';
export const PATCH_INSTRUMENT: IPatchInstrumentAction['type'] = 'PATCH_INSTRUMENT';
export const PATCH_INSTRUMENT_FAIL: IPatchInstrumentFailAction['type'] = 'PATCH_INSTRUMENT_FAIL';
export const PATCH_INSTRUMENT_SUCCESS: IPatchInstrumentSuccessAction['type'] = 'PATCH_INSTRUMENT_SUCCESS';
export const REMOVE_INSTRUMENT: IRemoveInstrumentAction['type'] = 'REMOVE_INSTRUMENT';
export const UPDATE_INSTRUMENT: IUpdateInstrumentAction['type'] = 'UPDATE_INSTRUMENT';

export const addInstrument = createAction(ADD_INSTRUMENT, (instrument: TInstrument) => ({ payload: instrument }));

export const deleteInstrument = createAction(DELETE_INSTRUMENT, (instrument: TInstrument) => ({ payload: instrument }));

export const deleteInstrumentFail = createAction(DELETE_INSTRUMENT_FAIL, (instrument: TInstrument) => ({ payload: instrument }));

export const deleteInstrumentSuccess = createAction(DELETE_INSTRUMENT_SUCCESS, (instrument: TInstrument) => ({ payload: instrument }));

export const patchInstrument = createAction(PATCH_INSTRUMENT, (instrument: TIdentifiable<TInstrument, 'id'>) => ({ payload: instrument }));

export const patchInstrumentFail = createAction(PATCH_INSTRUMENT_FAIL, (id: TInstrument['id']) => ({ payload: id }));

export const patchInstrumentSuccess = createAction(PATCH_INSTRUMENT_SUCCESS, (instrument: TIdentifiable<TInstrument, 'id'>) => ({
    payload: instrument
}));

export const removeInstrument = createAction(REMOVE_INSTRUMENT, (instrument: TInstrument) => ({ payload: instrument }));

export const updateInstrument = createAction(UPDATE_INSTRUMENT, (instrument: TIdentifiable<TInstrument, 'id'>) => ({
    payload: instrument
}));
