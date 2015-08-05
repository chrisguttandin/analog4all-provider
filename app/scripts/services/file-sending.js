'use strict';

class FileSendingService {

    constructor (fileSenderFactoryService) {
        this._fileSenderFactoryService = fileSenderFactoryService;
    }

    send (channelBroker, file) {
        var errorSubscription,
            fileSender,
            messageSubscription;

        fileSender = this._fileSenderFactoryService.create({
            channelBroker: channelBroker,
            file: file
        });

        errorSubscription = channelBroker.addErrorHandler(::fileSender.fail);
        messageSubscription = channelBroker.addMessageHandler(::fileSender.drain);

        return new Promise(function (resolve, reject) {
            fileSender.on('done', function (err) {
                errorSubscription.cancel();
                messageSubscription.cancel();

                if (err === null) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

}

module.exports = FileSendingService;
