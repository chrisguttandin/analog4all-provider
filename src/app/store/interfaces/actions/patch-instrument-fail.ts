import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IPatchInstrumentFailAction extends Action {

    payload: IInstrument['id'];

    type: 'PATCH_INSTRUMENT_FAIL';

}
