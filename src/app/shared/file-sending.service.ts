import { Injectable } from '@angular/core';
import { IMaskableSubject, TStringifyableJsonValue } from 'rxjs-broker';

const CHUNK_SIZE = 1024;

@Injectable()
export class FileSendingService {

    public send (dataChannelSubject: IMaskableSubject<TStringifyableJsonValue>, file: Blob): Promise<void> { // tslint:disable-line:max-line-length no-null-undefined-union
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onerror = () => reject(fileReader.error);

            fileReader.onload = () => {
                const buffer = fileReader.result;

                if (buffer instanceof ArrayBuffer) {
                    const byteLength = buffer.byteLength;

                    resolve(dataChannelSubject
                        .send({ byteLength, type: 'bof' })
                        .then(() => {
                            let byteIndex = 0;

                            const promise = Promise.resolve();

                            while (byteIndex + CHUNK_SIZE < byteLength) {
                                const slice = buffer.slice(byteIndex, byteIndex + CHUNK_SIZE);

                                promise.then(() => {
                                    dataChannelSubject.send(<any> btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(slice)))));
                                });

                                byteIndex += CHUNK_SIZE;
                            }

                            if (byteIndex < byteLength) {
                                const slice = buffer.slice(byteIndex);

                                promise.then(() => {
                                    dataChannelSubject.send(<any> btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(slice)))));
                                });
                            }

                            return promise;
                        })
                        .then(() => dataChannelSubject.send({ type: 'eof' })));
                } else {
                    reject(new Error('Reading the file failed.'));
                }
            };

            fileReader.readAsArrayBuffer(file);
        });
    }

}
