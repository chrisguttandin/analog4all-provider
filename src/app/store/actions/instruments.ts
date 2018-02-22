import { IInstrument } from '../../interfaces';
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

export const ADD_INSTRUMENT: IAddInstrumentAction['type'] = 'ADD_INSTRUMENT';
export const DELETE_INSTRUMENT: IDeleteInstrumentAction['type'] = 'DELETE_INSTRUMENT';
export const DELETE_INSTRUMENT_FAIL: IDeleteInstrumentFailAction['type'] = 'DELETE_INSTRUMENT_FAIL';
export const DELETE_INSTRUMENT_SUCCESS: IDeleteInstrumentSuccessAction['type'] = 'DELETE_INSTRUMENT_SUCCESS';
export const PATCH_INSTRUMENT: IPatchInstrumentAction['type'] = 'PATCH_INSTRUMENT';
export const PATCH_INSTRUMENT_FAIL: IPatchInstrumentFailAction['type'] = 'PATCH_INSTRUMENT_FAIL';
export const PATCH_INSTRUMENT_SUCCESS: IPatchInstrumentSuccessAction['type'] = 'PATCH_INSTRUMENT_SUCCESS';
export const REMOVE_INSTRUMENT: IRemoveInstrumentAction['type'] = 'REMOVE_INSTRUMENT';
export const UPDATE_INSTRUMENT: IUpdateInstrumentAction['type'] = 'UPDATE_INSTRUMENT';

export const addInstrument = (instrument: IInstrument): IAddInstrumentAction => ({
    payload: instrument,
    type: ADD_INSTRUMENT
});

export const deleteInstrument = (instrument: IInstrument): IDeleteInstrumentAction => ({
    payload: instrument,
    type: DELETE_INSTRUMENT
});

export const deleteInstrumentFail = (instrument: IInstrument): IDeleteInstrumentFailAction => ({
    payload: instrument,
    type: DELETE_INSTRUMENT_FAIL
});

export const deleteInstrumentSuccess = (instrument: IInstrument): IDeleteInstrumentSuccessAction => ({
    payload: instrument,
    type: DELETE_INSTRUMENT_SUCCESS
});

export const patchInstrument = (instrument: { id: IInstrument['id'] } & Partial<IInstrument>): IPatchInstrumentAction => ({
    payload: instrument,
    type: PATCH_INSTRUMENT
});

export const patchInstrumentFail = (id: IInstrument['id']): IPatchInstrumentFailAction => ({
    payload: id,
    type: PATCH_INSTRUMENT_FAIL
});

export const patchInstrumentSuccess = (instrument: { id: IInstrument['id'] } & Partial<IInstrument>): IPatchInstrumentSuccessAction => ({
    payload: instrument,
    type: PATCH_INSTRUMENT_SUCCESS
});

export const removeInstrument = (instrument: IInstrument): IRemoveInstrumentAction => ({
    payload: instrument,
    type: REMOVE_INSTRUMENT
});

export const updateInstrument = (instrument: { id: IInstrument['id'] } & Partial<IInstrument>): IUpdateInstrumentAction => ({
    payload: instrument,
    type: UPDATE_INSTRUMENT
});
