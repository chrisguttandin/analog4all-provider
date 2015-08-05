'use strict';

class ChannelBroker {

    constructor (options) {
        var channel = options.channel;

        this._channel = channel;
        this._errorHandlers = new Set();
        this._messageHandlers = new Set();

        channel.addEventListener('error', (errorEvent) => this._callErrorHandlers(errorEvent));
        channel.addEventListener('message', (messageEvent) => this._callMessageHandlers(messageEvent));
    }

    addErrorHandler (handler) {
        this._errorHandlers.add(handler);

        return {
            cancel: () => {
                this._errorHandlers.delete(handler);
            }
        };
    }

    addMessageHandler (handler) {
        this._messageHandlers.add(handler);

        return {
            cancel: () => {
                this._messageHandlers.delete(handler);
            }
        };
    }

    async _callErrorHandlers (errorEvent) {
        var err = errorEvent.error;

        for (let errorHandler of this._errorHandlers) {
            try {
                await errorHandler(err);

                // If the errorHandler does not throw an error itself, it should have handled it.
                return;
            } catch (newError) {
                // An errorHandler can throw a modified error or throw a different one.
                err = newError;
            }
        }

        throw err;
    }

    async _callMessageHandlers (messageEvent) {
        var message;

        try {
            message = await this._parseMessage(messageEvent.data);
        } catch (err) {
            // The data seems to be no strigified JSON.
            message = messageEvent.data;
        }

        for (let messageHandler of this._messageHandlers) {
            try {
                await messageHandler(message);

                // If the messageHandler does not throw an error, it should have understood
                // and handled the message.
                return;
            } catch (err) { /* In case of an error call the next messageHandler. */ }
        }

        throw new Error();
    }

    send (message) {
        if (typeof message === 'object' &&
                !(message instanceof ArrayBuffer) &&
                // !(message instanceof ArrayBufferView) &&
                !(message instanceof Blob)) {
            message = JSON.stringify(message);
        }

        this._channel.send(message);
    }

    async _parseMessage (message) {
        return (new Response(message)).json();
    }

}

class ChannelBrokerFactoryService {

    create (options) {
        return new ChannelBroker(options);
    }

}

module.exports = ChannelBrokerFactoryService;
