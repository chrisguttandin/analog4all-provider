import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IAddInstrumentAction extends Action {

    payload: IInstrument;

    type: 'ADD_INSTRUMENT';

}
