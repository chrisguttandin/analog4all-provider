import { Action } from '@ngrx/store';
import { TInstrument } from '../../types';

export interface IPatchInstrumentFailAction extends Action {
    readonly payload: TInstrument['id'];

    type: 'PATCH_INSTRUMENT_FAIL';
}
