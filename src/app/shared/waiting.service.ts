import { Injectable } from '@angular/core';
import { IMaskableSubject, TStringifyableJsonValue } from 'rxjs-broker';
import { first } from 'rxjs/operators';

/**
 * This service sends a waiting message to the data channel. It waits for the data channel to emit a
 * waiting message and then sends a ready event an resolves the promise.
 */
@Injectable()
export class WaitingService {

    public wait (dataChannelSubject: IMaskableSubject<TStringifyableJsonValue>): Promise<void> {
        return new Promise((resolve, reject) => {
            const waitingChannelSubject = dataChannelSubject.mask({ type: 'waiting' });

            const waitingChannelSubscription = waitingChannelSubject
                .pipe(
                    first<any>()
                )
                .subscribe({
                    complete (): void {
                        reject(new Error('The underlying channel was closed before any value could be received.'));
                    },
                    error (err: any): void {
                        reject(err);
                    },
                    next (): void {
                        waitingChannelSubscription.unsubscribe();
                        dataChannelSubject.next({ type: 'ready' });

                        resolve();
                    }
                });

            waitingChannelSubject.next(undefined);
        });
    }

}
