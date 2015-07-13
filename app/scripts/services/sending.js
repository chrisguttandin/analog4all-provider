'use strict';

const CHUNK_SIZE = 1024;

class SendingService {

    send (blob, channel) {
        var fileReader = new FileReader();

        fileReader.onload = () => this._sendArrayBuffer(fileReader.result, channel);

        fileReader.readAsArrayBuffer(blob);
    }

    _sendArrayBuffer (arrayBuffer, channel) {
        var byteIndex = 0,
            byteLength = arrayBuffer.byteLength;

        channel.send(JSON.stringify({
            byteLength: byteLength,
            type: 'bof'
        }));

        while (byteIndex + CHUNK_SIZE < byteLength) {
            let slice = arrayBuffer.slice(byteIndex, byteIndex + CHUNK_SIZE);

            channel.send(slice);

            byteIndex += CHUNK_SIZE;
        }

        channel.send(arrayBuffer.slice(byteIndex));

        channel.send(JSON.stringify({
            type: 'eof'
        }));
    }

}

module.exports = SendingService;
