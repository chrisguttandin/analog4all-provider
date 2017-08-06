import { Injectable } from '@angular/core';
import { IMaskableSubject, IStringifyableJsonObject } from 'rxjs-broker';

@Injectable()
export class FileReceivingService {

    public receive (dataChannelSubject: IMaskableSubject<IStringifyableJsonObject>): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            let buffer: ArrayBuffer;

            let byteIndex = 0;

            const dataChannelSubscription = dataChannelSubject
                .subscribe({
                    complete () {
                        reject();
                    },
                    error (err) {
                        reject(err);
                    },
                    next (message) {
                        const { type } = message;

                        // @todo Check why messages with a type of "waiting" can still be received here.
                        if (type === 'waiting') {
                            return;
                        }

                        if (type === 'bof') {
                            buffer = new ArrayBuffer(<number> message.byteLength);
                        } else if (type === 'eof') {
                            dataChannelSubscription.unsubscribe();

                            resolve(buffer);
                        } else {
                            const destination = new Uint8Array(buffer);

                            const source = atob(<any> message);

                            const length = byteIndex + source.length;

                            for (let i = byteIndex; i < length; i += 1) {
                                destination[i] = source.charCodeAt(i - byteIndex);
                            }

                            byteIndex += source.length;
                        }
                    }
                });
        });
    }

}
