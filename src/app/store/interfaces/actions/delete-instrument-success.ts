import { Action } from '@ngrx/store';
import { TInstrument } from '../../types';

export interface IDeleteInstrumentSuccessAction extends Action {
    readonly payload: TInstrument;

    type: 'DELETE_INSTRUMENT_SUCCESS';
}
