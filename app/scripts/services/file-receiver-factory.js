'use strict';

var EventEmitter = require('events').EventEmitter;

class FileReceiver extends EventEmitter {

    constructor (options) {
        super();

        this._buffer = null;
        this._byteIndex = 0;
        this._byteLength = 0;
        this._channelBroker = options.channelBroker;
    }

    async fail (err) {
        throw err;
    }

    async receive (message) {
        if (message.type === 'bof') {
            let byteLength = message.byteLength;

            this._buffer = new ArrayBuffer(byteLength);
            this._byteLength = byteLength;

            this._channelBroker.send({
                type: 'drain'
            });
        } else if (message.type === 'eof') {
            this.emit('done', null, this._buffer);
        } else if (message instanceof ArrayBuffer) {
            this._receiveSlice(message);

            this._channelBroker.send({
                type: 'drain'
            });
        } else {
            throw new Error();
        }
    }

    _receiveSlice (slice) {
        var destination = new Uint8Array(this._buffer),
            source = new Uint8Array(slice);

        for (let i = this._byteIndex, length = this._byteIndex + slice.byteLength; i < length; i += 1) {
            destination[i] = source[i - this._byteIndex];
        }

        this._byteIndex += slice.byteLength;
    }

}

class FileReceiverFactoryService {

    create (options) {
        return new FileReceiver(options);
    }

}

module.exports = FileReceiverFactoryService;
