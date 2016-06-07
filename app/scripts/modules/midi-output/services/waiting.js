var first = require('rxjs/operator/first').first;

/**
 * This service sends a waiting message to the data channel. It waits for the data channel to emit a
 * waiting message and then sends a ready event an resolves the promise.
 */
class WaitingService {

    wait (dataChannelSubject) {
        return new Promise((resolve, reject) => {
            var waitingChannel = dataChannelSubject.mask({ type: 'waiting' }),
                waitingChannelSubscription;

            waitingChannelSubscription = waitingChannel
                ::first()
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

module.exports = WaitingService;
