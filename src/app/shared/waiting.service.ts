import { Injectable } from '@angular/core';

/**
 * This service sends a waiting message to the data channel. It waits for the data channel to emit a
 * waiting message and then sends a ready event an resolves the promise.
 */
@Injectable()
export class WaitingService {

    public wait (dataChannelSubject) {
        return new Promise((resolve, reject) => {
            const waitingChannel = dataChannelSubject.mask({ type: 'waiting' });

            const waitingChannelSubscription = waitingChannel
                .first()
                .subscribe({
                    complete () {
                        reject(new Error('The underlying channel was closed before any value could be received.'));
                    },
                    error (err) {
                        reject(err);
                    },
                    next () {
                        waitingChannelSubscription.unsubscribe();
                        dataChannelSubject.next({ type: 'ready' });

                        resolve();
                    }
                });

            waitingChannel.next();
        });
    }

}
