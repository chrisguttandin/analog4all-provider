const CHUNK_SIZE = 1024;

export class FileSendingService {

    send (dataChannelSubject, file) { // eslint-disable-line class-methods-use-this
        return new Promise((resolve, reject) => {
            var fileReader = new FileReader();

            fileReader.onerror = () => reject(fileReader.error);

            fileReader.onload = async () => {
                var buffer = fileReader.result,
                    byteIndex = 0,
                    byteLength;

                byteLength = buffer.byteLength;

                await dataChannelSubject.send({
                    byteLength,
                    type: 'bof'
                });

                while (byteIndex + CHUNK_SIZE < byteLength) {
                    let slice = buffer.slice(byteIndex, byteIndex + CHUNK_SIZE);

                    await dataChannelSubject.send(btoa(String.fromCharCode.apply(null, new Uint8Array(slice))));

                    byteIndex += CHUNK_SIZE;
                }

                if (byteIndex < byteLength) {
                    let slice = buffer.slice(byteIndex);

                    await dataChannelSubject.send(btoa(String.fromCharCode.apply(null, new Uint8Array(slice))));
                }

                await dataChannelSubject.send({
                    type: 'eof'
                });

                resolve();
            };

            fileReader.readAsArrayBuffer(file);
        });
    }

}
