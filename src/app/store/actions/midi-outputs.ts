import { createAction } from '@ngrx/store';
import { IWatchMidiOutputsAction } from '../interfaces';

export const WATCH_MIDI_OUTPUTS: IWatchMidiOutputsAction['type'] = 'WATCH_MIDI_OUTPUTS';

export const watchMidiOutputs = createAction(WATCH_MIDI_OUTPUTS);
