import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IRemoveInstrumentAction extends Action {

    payload: IInstrument;

    type: 'REMOVE_INSTRUMENT';

}
