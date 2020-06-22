import { Action } from '@ngrx/store';
import { TIdentifiable, TInstrument } from '../../types';

export interface IPatchInstrumentAction extends Action {
    readonly payload: TIdentifiable<TInstrument, 'id'>;

    type: 'PATCH_INSTRUMENT';
}
