import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStringifyableJsonObject, TStringifyableJsonValue } from 'rxjs-broker';

@Injectable({
    providedIn: 'root'
})
export class FileReceivingService {
    // eslint-disable-next-line class-methods-use-this
    public receive(dataChannelSubject: Observable<TStringifyableJsonValue>): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            let buffer: ArrayBuffer;
            let byteIndex = 0;

            const dataChannelSubscription = dataChannelSubject.subscribe({
                complete(): void {
                    reject(new Error('no data'));
                },
                error(err): void {
                    reject(err);
                },
                next(message): void {
                    if (typeof message === 'object' && !Array.isArray(message)) {
                        const { type } = <IStringifyableJsonObject>message;

                        // @todo Check why messages with a type of "waiting" can still be received here.
                        if (type === 'waiting') {
                            return;
                        }

                        if (type === 'bof') {
                            buffer = new ArrayBuffer(<number>(<IStringifyableJsonObject>message).byteLength);
                        } else if (type === 'eof') {
                            dataChannelSubscription.unsubscribe();

                            resolve(buffer);
                        }
                    } else {
                        const destination = new Uint8Array(buffer);
                        const source = atob(<string>message);
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
