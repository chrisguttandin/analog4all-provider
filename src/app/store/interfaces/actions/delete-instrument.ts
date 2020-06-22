import { Action } from '@ngrx/store';
import { TInstrument } from '../../types';

export interface IDeleteInstrumentAction extends Action {
    readonly payload: TInstrument;

    type: 'DELETE_INSTRUMENT';
}
