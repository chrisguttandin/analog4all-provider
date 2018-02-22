import { Action } from '@ngrx/store';
import { IInstrument } from '../../../interfaces';

export interface IPatchInstrumentAction extends Action {

    payload: { id: IInstrument['id'] } & Partial<IInstrument>;

    type: 'PATCH_INSTRUMENT';

}
