'use strict';

var EventEmitter = require('events').EventEmitter;

const CHUNK_SIZE = 1024;

class FileSender extends EventEmitter {

    constructor (options) {
        super();

        this._buffer = null;
        this._byteIndex = 0;
        this._byteLength = 0;
        this._channelBroker = options.channelBroker;

        this._readFile(options.file);
    }

    async drain (message) {
        if (message.type === 'drain') {
            this._sendEofOrSlice();
        } else {
            throw new Error();
        }
    }

    async fail (err) {
        throw err;
    }

    _readFile (file) {
        var fileReader = new FileReader();

        fileReader.onload = () => {
            let buffer = fileReader.result;

            this._buffer = buffer;
            this._byteIndex = 0;
            this._byteLength = buffer.byteLength;

            this._sendBof();
        }

        fileReader.readAsArrayBuffer(file);
    }

    _sendBof () {
        this._channelBroker.send({
            byteLength: this._byteLength,
            type: 'bof'
        });
    }

    _sendEofOrSlice () {
        if (this._byteIndex + CHUNK_SIZE < this._byteLength) {
            let slice = this._buffer.slice(this._byteIndex, this._byteIndex + CHUNK_SIZE);

            this._channelBroker.send(slice);

            this._byteIndex += CHUNK_SIZE;
        } else if (this._byteIndex < this._byteLength) {
            let slice = this._buffer.slice(this._byteIndex);

            this._channelBroker.send(slice);

            this._byteIndex = this._byteLength;
        } else {
            this._channelBroker.send({
                type: 'eof'
            });

            this.emit('done', null);
        }
    }

}

class FileSenderFactoryService {

    create (options) {
        return new FileSender(options);
    }

}

module.exports = FileSenderFactoryService;
