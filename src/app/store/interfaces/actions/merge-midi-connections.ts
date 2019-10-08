import { Action } from '@ngrx/store';
import { TMidiConnection } from '../../types';

export interface IMergeMidiConnectionsAction extends Action {

    readonly payload: readonly TMidiConnection[];

    type: 'MERGE_MIDI_CONNECTIONS';

}
