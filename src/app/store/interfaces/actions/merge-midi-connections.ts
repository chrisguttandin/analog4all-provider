import { Action } from '@ngrx/store';
import { IMidiConnection } from '../../../interfaces';

export interface IMergeMidiConnectionsAction extends Action {

    payload: IMidiConnection[];

    type: 'MERGE_MIDI_CONNECTIONS';

}
