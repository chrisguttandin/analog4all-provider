import { Injectable } from '@angular/core';
import { IMaskableSubject, IStringifyableJsonObject, TStringifyableJsonValue } from 'rxjs-broker';
import { filter } from 'rxjs/operators';

@Injectable()
export class FileReceivingService {

    public receive (dataChannelSubject: IMaskableSubject<TStringifyableJsonValue>): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            let buffer: ArrayBuffer;

            let byteIndex = 0;

            const dataChannelSubscription = dataChannelSubject
                .pipe(
                    filter<TStringifyableJsonValue, IStringifyableJsonObject>((value): value is IStringifyableJsonObject => {
                        return (typeof value === 'object' && !Array.isArray(value));
                    })
                )
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
