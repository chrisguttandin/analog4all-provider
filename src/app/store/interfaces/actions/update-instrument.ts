import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IUpdateInstrumentAction extends Action {

    payload: IInstrument;

    type: 'UPDATE_INSTRUMENT';

}
