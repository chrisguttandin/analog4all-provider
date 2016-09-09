export class FileReceivingService {

    receive (dataChannelSubject) { // eslint-disable-line class-methods-use-this
        return new Promise((resolve, reject) => {
            var buffer,
                byteIndex,
                dataChannelSubscription;

            byteIndex = 0;

            dataChannelSubscription = dataChannelSubject
                .subscribe({
                    complete () {
                        reject();
                    },
                    error (err) {
                        reject(err);
                    },
                    next (message) {
                        if (message.type === 'bof') {
                            buffer = new ArrayBuffer(message.byteLength);
                        } else if (message.type === 'eof') {
                            dataChannelSubscription.unsubscribe();

                            resolve(buffer);
                        } else {
                            let destination = new Uint8Array(buffer),
                                source = atob(message);

                            for (let i = byteIndex, length = byteIndex + source.length; i < length; i += 1) {
                                destination[i] = source.charCodeAt(i - byteIndex);
                            }

                            byteIndex += source.length;
                        }
                    }
                });
        });
    }

}
