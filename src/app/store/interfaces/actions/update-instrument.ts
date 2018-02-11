import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IUpdateInstrumentAction extends Action {

    payload: { id: string } & Partial<IInstrument>;

    type: 'UPDATE_INSTRUMENT';

}
