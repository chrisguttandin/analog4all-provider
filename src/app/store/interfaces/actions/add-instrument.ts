import { Action } from '@ngrx/store';
import { TInstrument } from '../../types';

export interface IAddInstrumentAction extends Action {

    readonly payload: TInstrument;

    type: 'ADD_INSTRUMENT';

}
