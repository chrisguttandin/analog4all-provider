import { ActionType, INIT } from '@ngrx/store';
import * as actions from '../actions';

export type TStoreAction = ActionType<typeof actions[keyof typeof actions]> | Readonly<{ readonly type: typeof INIT }>;
