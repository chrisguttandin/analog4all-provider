import { IInstrument } from '../../interfaces';
import { IAddInstrumentAction, IDeleteInstrumentAction, IUpdateInstrumentAction } from '../interfaces';

export const ADD_INSTRUMENT: IAddInstrumentAction['type'] = 'ADD_INSTRUMENT';
export const DELETE_INSTRUMENT: IDeleteInstrumentAction['type'] = 'DELETE_INSTRUMENT';
export const UPDATE_INSTRUMENT: IUpdateInstrumentAction['type'] = 'UPDATE_INSTRUMENT';

export const addInstrument = (instrument: IInstrument): IAddInstrumentAction => ({
    payload: instrument,
    type: ADD_INSTRUMENT
});

export const deleteInstrument = (instrument: IInstrument): IDeleteInstrumentAction => ({
    payload: instrument,
    type: DELETE_INSTRUMENT
});

export const updateInstrument = (instrument: Partial<IInstrument>): IUpdateInstrumentAction => ({
    payload: instrument,
    type: UPDATE_INSTRUMENT
});
