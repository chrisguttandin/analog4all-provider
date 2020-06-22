import { Action } from '@ngrx/store';
import { TInstrument } from '../../types';

export interface IRemoveInstrumentAction extends Action {
    readonly payload: TInstrument;

    type: 'REMOVE_INSTRUMENT';
}
