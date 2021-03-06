import { Injectable } from '@angular/core';
import { IRemoteSubject, IStringifyableJsonObject, mask } from 'rxjs-broker';
import { first } from 'rxjs/operators';

/**
 * This service sends a waiting message to the data channel. It waits for the data channel to emit a
 * waiting message and then sends a ready event an resolves the promise.
 */
@Injectable({
    providedIn: 'root'
})
export class WaitingService {
    public wait(dataChannelSubject: IRemoteSubject<IStringifyableJsonObject>): Promise<void> {
        // tslint:disable-line:max-line-length no-null-undefined-union
        return new Promise((resolve, reject) => {
            const waitingChannelSubject = mask({ type: 'waiting' }, dataChannelSubject); // tslint:disable-line:no-null-undefined-union

            const waitingChannelSubscription = waitingChannelSubject.pipe(first<any>()).subscribe({
                complete(): void {
                    reject(new Error('The underlying channel was closed before any value could be received.'));
                },
                error(err: any): void {
                    reject(err);
                },
                next(): void {
                    waitingChannelSubscription.unsubscribe();
                    dataChannelSubject.next({ type: 'ready' });

                    resolve();
                }
            });

            waitingChannelSubject.next(undefined);
        });
    }
}
