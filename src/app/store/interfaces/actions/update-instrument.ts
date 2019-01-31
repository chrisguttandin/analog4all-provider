import { Action } from '@ngrx/store';
import { TIdentifiable, TInstrument } from '../../types';

export interface IUpdateInstrumentAction extends Action {

    readonly payload: TIdentifiable<TInstrument, 'id'>;

    type: 'UPDATE_INSTRUMENT';

}
