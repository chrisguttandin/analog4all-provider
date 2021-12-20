import { Injectable } from '@angular/core';
import { first } from 'rxjs';
import { IRemoteSubject, IStringifyableJsonObject, mask } from 'rxjs-broker';

/**
 * This service sends a waiting message to the data channel. It waits for the data channel to emit a
 * waiting message and then sends a ready event an resolves the promise.
 */
@Injectable({
    providedIn: 'root'
})
export class WaitingService {
    // eslint-disable-next-line class-methods-use-this
    public wait(dataChannelSubject: IRemoteSubject<IStringifyableJsonObject>): Promise<void> {
        return new Promise((resolve, reject) => {
            const waitingChannelSubject = mask({ type: 'waiting' }, dataChannelSubject);
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
