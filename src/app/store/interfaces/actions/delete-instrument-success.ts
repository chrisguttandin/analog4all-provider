import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IDeleteInstrumentSuccessAction extends Action {

    payload: IInstrument;

    type: 'DELETE_INSTRUMENT_SUCCESS';

}
