import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IDeleteInstrumentFailAction extends Action {

    payload: IInstrument;

    type: 'DELETE_INSTRUMENT_FAIL';

}
