import { ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator } from '@ngrx/store';
import { OperatorFunction } from 'rxjs';
import { pluck } from 'rxjs/operators';

export const pluckPayloadOfType = <T extends ActionCreator<string, Creator>, U = ReturnType<T>>(
    action: T
): OperatorFunction<Action, U extends { payload: any } ? U['payload'] : never> => {
    return (source) => source
        .pipe(
            ofType(action),
            pluck('payload')
        );
};
