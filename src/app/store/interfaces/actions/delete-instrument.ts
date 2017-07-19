import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IDeleteInstrumentAction extends Action {

    payload: IInstrument;

    type: 'DELETE_INSTRUMENT';

}
