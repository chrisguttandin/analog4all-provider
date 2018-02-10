import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IUpdateInstrumentAction extends Action {

    payload: Partial<IInstrument>;

    type: 'UPDATE_INSTRUMENT';

}
