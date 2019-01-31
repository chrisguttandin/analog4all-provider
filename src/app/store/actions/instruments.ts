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

export const addInstrument = (instrument: TInstrument): IAddInstrumentAction => ({
    payload: instrument,
    type: ADD_INSTRUMENT
});

export const deleteInstrument = (instrument: TInstrument): IDeleteInstrumentAction => ({
    payload: instrument,
    type: DELETE_INSTRUMENT
});

export const deleteInstrumentFail = (instrument: TInstrument): IDeleteInstrumentFailAction => ({
    payload: instrument,
    type: DELETE_INSTRUMENT_FAIL
});

export const deleteInstrumentSuccess = (instrument: TInstrument): IDeleteInstrumentSuccessAction => ({
    payload: instrument,
    type: DELETE_INSTRUMENT_SUCCESS
});

export const patchInstrument = (instrument: TIdentifiable<TInstrument, 'id'>): IPatchInstrumentAction => ({
    payload: instrument,
    type: PATCH_INSTRUMENT
});

export const patchInstrumentFail = (id: TInstrument['id']): IPatchInstrumentFailAction => ({
    payload: id,
    type: PATCH_INSTRUMENT_FAIL
});

export const patchInstrumentSuccess = (instrument: TIdentifiable<TInstrument, 'id'>): IPatchInstrumentSuccessAction => ({
    payload: instrument,
    type: PATCH_INSTRUMENT_SUCCESS
});

export const removeInstrument = (instrument: TInstrument): IRemoveInstrumentAction => ({
    payload: instrument,
    type: REMOVE_INSTRUMENT
});

export const updateInstrument = (instrument: TIdentifiable<TInstrument, 'id'>): IUpdateInstrumentAction => ({
    payload: instrument,
    type: UPDATE_INSTRUMENT
});
