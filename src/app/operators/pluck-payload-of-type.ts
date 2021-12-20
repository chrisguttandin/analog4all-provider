import { ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator } from '@ngrx/store';
import { OperatorFunction, pluck } from 'rxjs';

export const pluckPayloadOfType =
    <T extends ActionCreator<string, Creator<any[], { payload: any }>>, U = ReturnType<T>>(
        action: T
    ): OperatorFunction<Action, U extends { payload: any } ? U['payload'] : never> =>
    (source) =>
        source.pipe(ofType(action), pluck('payload'));
